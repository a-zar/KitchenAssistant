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
  showAddItemForm: boolean = false;
  newItem: ShoppingListItem | undefined;
  items: ShoppingListItem[] = [];
  listName: string | null = '';
  productNames: { [productId: number]: string } = {};

  constructor(private route: ActivatedRoute,
    private shoppingListItemService: ShoppingListItemService,
    private productService: ProductService) {}

  ngOnInit(): void {
    this.loadListName();
    this.loadsItems();
    this.loadAllProductNamesFromProductService();
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
    const listId = Number(this.route.snapshot.paramMap.get('listId'));
    this.shoppingListItemService.getItemsByListId(listId).subscribe({
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

  deleteItem(item: ShoppingListItem) {
  throw new Error('Method not implemented.');
  }
  addItem() {
  throw new Error('Method not implemented.');
  }
  increaseQuantity(arg0: any) {
  throw new Error('Method not implemented.');
  }
  decreaseQuantity(arg0: any) {
  throw new Error('Method not implemented.');
  }
  onCheckboxChange($event: Event) {
  throw new Error('Method not implemented.');
  }
}