import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ShoppingListItem } from '../../common/shopping-list-item';
import { ShoppingListItemService } from 'src/app/services/shopping-list-item.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/common/product';
import { Category } from 'src/app/common/category';
import { CategoryService } from '../../services/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.css']
})
export class ShoppingListItemComponent implements OnInit {

  productForm!: FormGroup;

  listName: string | null = '';
  listId: number = -1;

  showAddItemForm: boolean = false;
  items: ShoppingListItem[] = [];

  productNames: { [productId: string]: string } = {};
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  categories: Category[] = [];
  selectedCategoryId: number = -1; 

  constructor(private route: ActivatedRoute,
    private shoppingListItemService: ShoppingListItemService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService ) {}

  ngOnInit(): void {
    this.setListId();
    this.loadListName();
    this.loadsItems();
    this.loadAllProductNamesFromProductService();
    this.loadCategories();
    this.initializeForm();
  }

  private initializeForm() {
    this.productForm = this.formBuilder.group({
      categoryId: [-1, Validators.required],
      productId: ["", Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      note: [""]
    });
  }

  /** 
   * @description Dodawanie produktów do danej listy zakupów. 
   * Produkt jest wyszukiwany z listy wszystkich produktów, możliwe jest filtrowanie po kategorii
   * @requires newItem: ShoppingListItem
   * @returns
   * Jesli produkt istnieje juz na liscie zakupów -> update:
   * - zwiększenie ilości danego produktu
   * - nowa notatka nadpisuje starą
   * - zmiana statusa isPurchase na false
   * 
   * Inaczej dodaje nowy element do listy zakupów
   * @back Po nieudanym update rollback do poprzedniego widoku. 
   * Dodany jest snaphot
   */  

  addItem() {
    if(this.productForm.invalid) return;
    const newItem = this.buildItemFromForm();
    const existingItem = this.findExistingItem(newItem.productId);

    if(existingItem){ 
      this.mergeExistingItem(existingItem, newItem);
    } else {
      this.createNewItem(newItem)
    };

    this.showAddItemForm = false;
    this.resetProductForm();
  }

  private createNewItem(item: ShoppingListItem): void {
    const snapshot = [...this.items];
    this.shoppingListItemService.createItem(item).subscribe({
        next: (saved) => {
          this.items.push(saved);
          this.notificationService.success(`Do listy zakupów dodano: ${this.productNames[item.productId]}`);
        },
        error: () => { this.items = snapshot; }
    });
}

  private findExistingItem(productId: number): ShoppingListItem | undefined {
    return this.items.find(i => i.productId === productId);
}


  private mergeExistingItem(existingItem: ShoppingListItem, newItem: ShoppingListItem): void {
    const snapshotItem = this.setSnaphotItem(existingItem);
    const updatedProduct = {
      ...existingItem, 
      quantity: existingItem.quantity + newItem.quantity,
      note: newItem.note || existingItem.note,
      isPurchased: false
    }

    this.updateItem(updatedProduct, snapshotItem);
}

private buildItemFromForm(): ShoppingListItem {
    return new ShoppingListItem(
        Number(this.productForm.get('productId')!.value),
        this.listId,
        this.productForm.get('quantity')!.value,
        false,
        this.productForm.get('note')!.value
    );
}

  updateItem(item: ShoppingListItem, snapshotItem: ShoppingListItem): void {
    this.shoppingListItemService.updateItem(this.listId, item.id!, item).subscribe({
      next: (updatedItem: ShoppingListItem) => {
        const index = this.items.findIndex(i => i.id === updatedItem.id);
        if (index !== -1) {
          const currentItem = this.items[index];
          //Aktualizujemy obiekt, łącząc stare dane z nowymi z serwera
          this.items[index] = {
            ...currentItem,    
            ...updatedItem,     
          };
        console.log('Local state updated with id:', updatedItem.id);   
        this.notificationService.success(`Lista zakupów została zaaktualizowana`);
        this.resetProductForm();
      }
      },
      error: err => {
        console.log('Update error: ', err);
        // Rollback w przypadku błędu - przywracamy poprzednią wartość
        const index = this.items.findIndex(i => i.id === snapshotItem.id);
          if (index !== -1) {
            this.items[index] = snapshotItem;
            this.notificationService.error(`Wystąpił błąd. Przywrócono poprzednie dane.`);
          }      
      }
    });
  }

  onCategoryChange($event: Event) {
    const select = $event.target as HTMLSelectElement;
    const categoryId = Number(select.value);
    this.selectedCategoryId = categoryId;
    this.filterByCategory();
  }

  increaseQuantity(item: ShoppingListItem) {
    const snapshotItem = this.setSnaphotItem(item);
    const index = this.items.findIndex(i => i.id === item.id);
    const updated = {...item, quantity: item.quantity + 1};

    if (index !== -1) {
      this.items[index] = updated;
      this.updateItem(updated, snapshotItem);
    }
  }

  decreaseQuantity(item: ShoppingListItem) {
    const snapshotItem = this.setSnaphotItem(item);
    const index = this.items.findIndex(i => i.id === item.id);
    const updated = {...item, quantity: item.quantity - 1};

    if (index !== -1 && item.quantity > 1 ) {
      this.items[index] = updated;
      this.updateItem(updated, snapshotItem);
    }
  }
  
  /**
  * Notatka jest zapisywana po opuszczeniu pola przez uzytkownika 
  */
  onNoteBlur($event: Event, item: ShoppingListItem) {
    const input = $event.target as HTMLInputElement;
    const snapshotItem = this.setSnaphotItem(item);
    const updated = {...item, note: input.value};
    const index = this.items.findIndex(i => i.id === item.id);

    if (index !== -1) {
      this.items[index] = updated;
      this.updateItem(updated, snapshotItem);
    }
  }

  /**
   * @Description Zaznaczenie lub odznaczenie checkbox ustawia odpoweidnia isPurchased na true lub false
   * @param item: ShoppingListItem 
   */
  onCheckboxChange($event: Event, item: ShoppingListItem) {
    const checkbox = $event.target as HTMLInputElement;
    const snapshotItem = this.setSnaphotItem(item);
    const updated = {...item, isPurchased:checkbox.checked};
    const index = this.items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.items[index] = updated;
      this.updateItem(updated, snapshotItem);
    }
  }

  onDeleteItem(item: ShoppingListItem) {
    const snaphotItems = [...this.items];
    this.shoppingListItemService.deleteItem(this.listId, item.id!).subscribe({
      next: () => {
        //update UI
        this.items = this.items.filter(i => i.id !== item.id);
        console.log("Deleted item with id: ", item.id)
        this.notificationService.success(`Usunięto produkt: ${this.productNames[item.productId]}`);
      }, 
      error: err => {
        console.error('Failed to delete shopping list item', err);
        this.items = [...snaphotItems];
        this.notificationService.error(`Wystąpił błąd. Nie udało się usunąć elementu.`);
      }
    });
  }

//properties and methods

  filterByCategory(): void {
    console.log('Filtrowanie produktów dla kategorii ID:', this.selectedCategoryId);
    if (this.selectedCategoryId === -1) {
      this.filteredProducts = this.allProducts.sort((a, b) => a.name.localeCompare(b.name));
    }else{
    this.productService.getProductListByCategory(this.selectedCategoryId).subscribe({
      next: response => {
        this.filteredProducts = response._embedded.products.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (err) => {
        console.error('Błąd filtrowania produktów:', err);
        this.notificationService.error(`Wystąpił błąd podczas filtrowania produktów.`);
      }
    });
    }
  }

  private resetProductForm() {
    this.productForm.reset({
      categoryId: -1,
      productId: "",
      quantity: 1,
      note: ""
    });
  }
//loading data
  private setSnaphotItem (item: ShoppingListItem): ShoppingListItem {
    // const index = this.items.indexOf(item);
    const index = this.items.findIndex(i => i.id === item.id); 
    if(index === -1){
      return {...item};
    }
    const snapshotItem = { ...this.items[index] };
    console.log("ustawiono snapshot dla items[id] with id: ", index)
    return snapshotItem;
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
      this.filterByCategory();

      response._embedded.products.forEach(product => {
          this.productNames[product.id] = product.name;
        });
    console.log('Słownik załadowany pomyślnie.');
    },
    error: (err) => console.error('Błąd ładowania słownika:', err)
    });
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
}