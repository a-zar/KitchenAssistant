import { Component, OnInit } from '@angular/core';
import { ShoppingListItem } from '../../common/shopping-list-item';
import { ShoppingListItemService } from 'src/app/services/shopping-list-item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.css']
})
export class ShoppingListItemComponent implements OnInit {
  listId: number = -1;
  showAddItemForm: boolean = false;
  newItem: ShoppingListItem | undefined;
  items: ShoppingListItem[] = [];
  listName: string | null = '';
  productNames: { [productId: number]: string } = {};

  constructor(private route: ActivatedRoute,
    private shoppingListItemService: ShoppingListItemService,
    private productService: ProductService) {}

  ngOnInit(): void {
    this.setListId();
    this.loadListName();
    this.loadsItems();
    this.loadAllProductNamesFromProductService();
  }

  setListId(): void {
    this.listId = Number(this.route.snapshot.paramMap.get('listId'));
  }
  loadListName(): void {
    this.route.queryParamMap.subscribe({
      next: (params) => {
        // Klucz musi być identyczny jak w URL (?listName=...)
        this.listName = params.get('listName'); 
        console.log('Odebrany parametr:', this.listName);
      },
      error: (err) => console.error(err)
    });
  }

  loadsItems(): void {
    this.shoppingListItemService.getItemsByListId(this.listId).subscribe({
      next: data => this.items = data,
      error: err => console.error('Failed to load shopping list items', err)
    });
  }

  loadProductNameById(productId: number): string {
    if (this.productNames[productId]) {
      return this.productNames[productId];
    } else {
      this.productService.getProduct(productId).subscribe({
        next: product => {
          this.productNames[productId] = product.name;
        },
        error: err => console.error(`Failed to load product name for ID ${productId}`, err)
      });
      return this.productNames[productId]??'Ładowanie...';
    }
  }

  loadAllProductNamesFromProductService(): void {
    this.productService.getProductList().subscribe({
      next: products => {
        products.forEach(product => {
          this.productNames[product.id] = product.name;
        }); 
      },
      error: err => console.error('Failed to load product names', err)
    });
  }

  onDeleteItem(item: ShoppingListItem) {
    // if (!confirm(`Czy na pewno chcesz usunąć "${this.productNames[item.productId]}" z listy zakupów?`)) return;

    this.shoppingListItemService.deleteItem(this.listId, item.id).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.id !== item.id);
      },
      error: err => console.error('Failed to delete shopping list item', err)
    });
  }

  increaseQuantity(item: ShoppingListItem) {
    item.quantity++;
    // this.shoppingListItemService.updateItem(item).subscribe({
    //   next: (updatedItem: ShoppingListItem) => {
    //     const itemId = this.items.findIndex(i => i.id === updatedItem.id);
    //     if (itemId !== -1) {
    //       this.items[itemId] = updatedItem;
    //     }
    //   },
    //   error: err => console.error('Failed to update shopping list item quantity', err)
    // });
  }

  decreaseQuantity(item: ShoppingListItem) {
    if (item.quantity > 0) {
      item.quantity--;
      if (item.quantity === 0) {
        this.onDeleteItem(item);
        return;
      } 
      // this.shoppingListItemService.updateItem(item).subscribe({
      //   next: (updatedItem: ShoppingListItem) => {
      //     const itemId = this.items.findIndex(i => i.id === updatedItem.id);
      //     if (itemId !== -1) {
      //       this.items[itemId] = updatedItem;
      //     }
      //   },
      //   error: err => console.error('Failed to update shopping list item quantity', err)
      // });
    }
  }
  onCheckboxChange($event: Event) {
    const checkbox = $event.target as HTMLInputElement;
    const itemId = Number(checkbox.value);
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.isPurchased = checkbox.checked;
    //   this.shoppingListItemService.updateItem(item).subscribe({
    //     next: (updatedItem: ShoppingListItem) => {
    //       const updatedItemId = this.items.findIndex(i => i.id === updatedItem.id);
    //       if (updatedItemId !== -1) {
    //         this.items[updatedItemId] = updatedItem;
    //       }
    //     },
    //     error: err => console.error('Failed to update shopping list item isPurchased status', err)
    //   });
    }
  }
}