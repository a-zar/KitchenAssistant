import { Component, OnInit } from '@angular/core';
import { ShoppingListItem } from '../../common/shopping-list-item';
import { ShoppingListItemService } from 'src/app/services/shopping-list-item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/common/product';
import { Category } from 'src/app/common/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.css']
})
export class ShoppingListItemComponent implements OnInit {
onCategoryChange($event: Event) {
throw new Error('Method not implemented.');
}
addItem() {
throw new Error('Method not implemented.');
}
  listName: string | null = '';
  listId: number = -1;
  showAddItemForm: boolean = false;
  newItem: ShoppingListItem | undefined;

  items: ShoppingListItem[] = [];
  productNames: { [productId: string]: string } = {};
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];


  constructor(private route: ActivatedRoute,
    private shoppingListItemService: ShoppingListItemService,
    private productService: ProductService,
    private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.setListId();
    this.loadListName();
    this.loadsItems();
    this.loadAllProductNamesFromProductService();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategoryList().subscribe({
      next: data => {
        this.categories = data._embedded.categories;
      },
      error: (err) => console.error('Błąd ładowania kategorii:', err)
    });
  }

  loadsItems(): void {
    this.shoppingListItemService.getItemsByListId(this.listId).subscribe({
      next: data => this.items = data,
      error: err => console.error('Failed to load shopping list items', err)
    });
  }

  updateItem(item: ShoppingListItem, snapshot: ShoppingListItem): void {
    this.shoppingListItemService.updateItem(this.listId, item.id, item).subscribe({
      next: (updatedItem: ShoppingListItem) => {
        const index = this.items.findIndex(i => i.id === updatedItem.id);
        if (index !== -1) {
          const currentItem = this.items[index];
          //Aktualizujemy obiekt, łącząc stare dane z nowymi z serwera
          this.items[index] = {
            ...currentItem,    
            ...updatedItem,     
          };
          console.log('Stan lokalny zaktualizowany dla ID:', updatedItem.id);      }
      },
      error: err => {
        console.log('Błąd aktualizacji, przywracanie poprzedniego stanu dla ID:', snapshot.id, 'Błąd:', err);
        // Rollback w przypadku błędu - przywracamy poprzednią wartość
        const index = this.items.findIndex(i => i.id === snapshot.id);
          if (index !== -1) {
            this.items[index] = snapshot;
          }
        alert('Wystąpił błąd. Przywrócono poprzednie dane.');
      }
    });
  }

  increaseQuantity(item: ShoppingListItem) {
    const snapshotItem = { ...item };
    item.quantity++;
    this.updateItem(item, snapshotItem);
  }

  decreaseQuantity(item: ShoppingListItem) {
    const snapshotItem = { ...item };
    if (item.quantity > 1) {
      item.quantity--;
      this.updateItem(item, snapshotItem);
    }
  }

  onNoteBlur($event: Event, item: ShoppingListItem) {
    const input = $event.target as HTMLInputElement;
    const snapshotItem = { ...item };
    item.note = input.value;
    this.updateItem(item, snapshotItem);
  }

  onCheckboxChange($event: Event, item: ShoppingListItem) {
    const checkbox = $event.target as HTMLInputElement;
    const snapshotItem = { ...item };
    console.log('Checkbox changed for item ID:', item.id, 'Checked:', checkbox.checked, 'Item found:', item);
    if(item){
      item!.isPurchased = checkbox.checked;
      this.updateItem(item, snapshotItem);
    }
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

  getProductName(productId: number): string {
    return this.productNames[productId] || 'Nieznany produkt';
  } 

  setListId(): void {
    this.listId = Number(this.route.snapshot.paramMap.get('listId'));
  }

  loadListName(): void {
    this.route.queryParamMap.subscribe({
      next: (params) => {
        this.listName = params.get('listName'); 
        console.log('Odebrany parametr:', this.listName);
      },
      error: (err) => console.error(err)
    });
  }

  loadAllProductNamesFromProductService(): void {
    this.productService.getProductList().subscribe({
    next: response => {
      this.allProducts = response._embedded.products;

      response._embedded.products.forEach(product => {
          this.productNames[product.id] = product.name;
        });
    console.log('Słownik załadowany pomyślnie.');
    },
    error: (err) => console.error('Błąd ładowania słownika:', err)
    });
  }
}