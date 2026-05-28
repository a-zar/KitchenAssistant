import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { Category } from 'src/app/common/category';
import { Nutrient } from 'src/app/common/nutrient';
import { Product } from 'src/app/common/product';
import { Recipe } from 'src/app/common/recipe';
import { RecipeItem } from 'src/app/common/recipe-item';
import { ProductService } from 'src/app/services/product.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  
  private productsSubject = new BehaviorSubject<FinalProduct[]>([]);
  products$ = this.productsSubject.asObservable();

  mainForm!: FormGroup;
  addItemForm!: FormGroup;

  isEditable = false;

  recipeId: number = -1; 
  recipe!: Recipe;

  recipeItems: RecipeItem[] = []; 
  completeProductsForRecipe: FinalProduct[] = [];

  allProducts : any[] = [];
  selectedProductId: number = -1; 
  filteredProducts: any[] = [];

  categories: Category[] = []; 
  selectedCategoryId: number = -1;
  showAddItemForm: any;
  
  constructor(private fb: FormBuilder, 
              private recipeService: RecipeService,
              private productService: ProductService,
              private categoryService: CategoryService,
              private route: ActivatedRoute) { 

    this.mainForm = this.fb.group({
      // Grupa dla RecipeDto
      recipe: this.fb.group({
        recipeTitle: ['', Validators.required],
        recipeInstructions: ['']
      }),
      items: this.fb.array([])
    });

    this.addItemForm = this.fb.group({
      categoryId: [null],
      productId: [null, Validators.required],
      weight: [1, [Validators.required, Validators.min(0.1)]]
    });
  }

  // Getter dla ułatwienia dostępu do FormArray z template'u
  get itemsFormArray() {
  return this.mainForm.get('items') as FormArray;
}

  ngOnInit(): void {
    this.mainForm.disable(); // Na początku wszystko jest nieedytowalne
    this.setRecipeId();
    this.loadRecipe();
    this.loadCategories();
    this.loadAllProducts();
  }
  
  loadAllProducts (): void {
    this.allProducts = [];
    this.filteredProducts = [];

    console.log('Ładowanie wszystkich produktów z serwisu...');
    this.productService.getAllProductsWithCategories().subscribe({
      next: data => {
        this.allProducts = data;  
        this.filteredProducts = [...this.allProducts];
        console.log('Załadowane wszystkie produkty z kategoriami:', this.allProducts);
      },
      error: (err) => console.error('Błąd ładowania produktów:', err)
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

  onCategoryChange($event: Event) {
    const select = $event.target as HTMLSelectElement;
    const categoryId = Number(select.value);
    this.selectedCategoryId = categoryId;

    if (categoryId > 0) {
      this.filteredProducts = this.allProducts
        .filter(p => p.category.id === categoryId)
        .map(p => ({ id: p.id, name: p.name } as Product));
      console.log('Produkty dla wybranej kategorii:', this.filteredProducts); 
    } else {
      this.filteredProducts = this.allProducts.map(p => ({ id: p.id, name: p.name } as Product));
    };
  }

  addItem() {
  if (this.addItemForm.valid) {
    const formValues = this.addItemForm.value;
    
    // Tworzymy obiekt RecipeItem do wysłania na backend
    const newItem: RecipeItem = {
      recipeId: this.recipeId,
      productId: formValues.productId,
      weightGrams: formValues.weight
    };

    this.recipeService.addRecipeItem(newItem).subscribe({
      next: (createdItem) => {
        console.log('Produkt dodany do przepisu:', createdItem);
        this.addItemForm.reset({ categoryId: null, productId: null, weight: 1 }); // Resetuj formularz po dodaniu
        this.showAddItemForm = false; // Ukryj formularz po dodaniu produktu
        this.loadRecipeItems(); // Odśwież listę produktów w przepisie, aby pokazać nowo dodany produkt        
      },
      error: (err) => {
        console.error('Błąd dodawania produktu do przepisu:', err);
        alert('Nie można dodać produktu do przepisu. Spróbuj ponownie później.');
      }
    });

  } else {
    console.log('Błędy w formularzu dodawania:', this.addItemForm.errors);
    alert('Formularz dodawania produktu jest niepoprawny.');
  }

}

  updateProductsView(newProducts: FinalProduct[]) {
    this.productsSubject.next([...newProducts]);
  }

  setRecipeId(): void {
    this.recipeId = Number(this.route.snapshot.paramMap.get('recipeId'));
  }

  loadRecipe() {
    this.recipeService.getRecipe(this.recipeId).subscribe({
      next: data => {
        this.recipe = data;
        this.mainForm.patchValue({
          recipe: {
            recipeTitle: data.title,       // mapowanie pola title z Javy na recipeTitle w Angularze
            recipeInstructions: data.instruction
          }
        });
      },
      error: err => console.error('Failed to load recipe details', err)
    });

    this.loadRecipeItems(); // Załaduj szczegółowe dane przesu
  }

  loadRecipeItems(){
    this.recipeItems = [];
    this.completeProductsForRecipe = [];
    this.itemsFormArray.clear(); 

    this.recipeService.getRecipeItems(this.recipeId).subscribe({
      next: data => {
        this.recipeItems = data;
        this.recipeItems.forEach(item => {
          this.productService.getCompleteProduct(item.productId).subscribe({
            next: product => {
              const calculatedNutrients = this.calcuateNutrients(item.weightGrams, product.nutrients);
              product.nutrients = calculatedNutrients; // Dodaj obliczone wartości odżywcze do produktu
              product.weightGrams = item.weightGrams; // Dodaj wagę produktu do obiektu
              product.itemId = item.id!; // Przypisz ID RecipeItem do produktu
              this.completeProductsForRecipe.push(product);
              this.updateProductsView([...this.completeProductsForRecipe]);

              //Dodajemy nowy FormGroup do FormArray dla każdego produktu
            this.itemsFormArray.push(this.fb.group({
              itemId: [item.id],
              weight: [item.weightGrams, [Validators.required, Validators.min(0.1)]]
            }));
            },
            error: err => {
              console.error('Failed to load product details for item', item, err);
              alert('Nie można załadować szczegółów produktu dla jednego z elementów przepisu. Spróbuj ponownie później.');
            }
          });
        });
      },
      error: err => console.error('Failed to load recipe items', err)
    }); 
  }

  calcuateNutrients(weightGrams: number, nutrients: Nutrient): Nutrient {
    const factor = weightGrams / 100; // Zakładamy, że wartości odżywcze są podane na 100g
    return {
      id: nutrients.id,
      energy: Number((nutrients.energy * factor).toFixed(2)),
      carbohydrate: Number((nutrients.carbohydrate * factor).toFixed(2)),
      protein: Number((nutrients.protein * factor).toFixed(2)),
      fat: Number((nutrients.fat * factor).toFixed(2)),
      saturatedFat: Number((nutrients.saturatedFat * factor).toFixed(2)),
      sugar: Number((nutrients.sugar * factor).toFixed(2)),
      fiber: Number((nutrients.fiber * factor).toFixed(2)),
      nutritionGrade: nutrients.nutritionGrade
    };
  }

  get totals() {
    return this.completeProductsForRecipe.reduce((acc, product) => {
      acc.energy += product.nutrients.energy || 0;
      acc.carbohydrate += product.nutrients.carbohydrate || 0;
      acc.protein += product.nutrients.protein || 0;
      acc.fat += product.nutrients.fat || 0;
      acc.saturatedFat += product.nutrients.saturatedFat || 0;
      acc.sugar += product.nutrients.sugar || 0;
      acc.fiber += product.nutrients.fiber || 0;
      return acc;
    }, { energy: 0, carbohydrate: 0, protein: 0, fat: 0, saturatedFat: 0, sugar: 0, fiber: 0 });
  }
  
  toggleEdit() {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.mainForm.enable(); // Włącz edycję
    } else {
      this.mainForm.disable(); // Wyłącz edycję
      this.loadRecipeItems(); // Załaduj ponownie dane, aby anulować zmiany
    }
  } 

  save() {
    if (this.mainForm.disabled || !this.mainForm.valid) return;
    this.updateAllItems();
  }


  updateAllItems() {
    const recipeData = this.mainForm.get('recipe')?.value;
    const itemsData = this.itemsFormArray.value; // Pobierz dane z FormArray

    const updatedRecipe = {
      ...this.recipe,
      title: recipeData.recipeTitle,
      instruction: recipeData.recipeInstructions
    };

    const updatedItems: RecipeItem[] = itemsData.map((item: any) => ({
      id: item.itemId,
      recipeId: this.recipeId,
      productId: this.completeProductsForRecipe.find(p => p.itemId === item.itemId)?.id || -1,
      weightGrams: item.weight
    }));

    // PRZERABIAMY obiekty na żądania (strumienie)
    const itemRequests = updatedItems.map(item => this.recipeService.updateRecipeItem(item));
    const recipeUpdate$ = this.recipeService.updateRecipe(updatedRecipe);

    
    this.recipeService.updateRecipe(updatedRecipe).subscribe({
      next: () => {
        console.log('Recipe updated successfully: ', updatedRecipe);
      },
      error: (err) => {
        console.error('Failed to update recipe', err);
        alert('Nie można zaktualizować przepisu. Spróbuj ponownie później.');
      }
    });

    updatedItems.forEach((item, i) => {
      if (item) {
        this.recipeService.updateRecipeItem(item).subscribe({
          next: () => {
            console.log('Recipe item updated successfully: ', item);
            if (i === updatedItems.length - 1) {
              this.viewAfterSave();
            }
          },
          error: (err) => {
            console.error('Failed to update recipe item', err);
            alert('Nie można zaktualizować jednego ze składników przepisu. Spróbuj ponownie później.');
          }
        });
      } else {
        alert('Formularz jest niepoprawny. Proszę popraw błędy i spróbuj ponownie.');
      }
    });
  }

  private viewAfterSave() {
    this.isEditable = false;
    this.mainForm.disable();
    this.loadRecipeItems(); // Odświeżamy widok i przeliczamy makro na bazie nowych wag
  }

  onDeleteItem(itemId: number) {
    const snaphotItems = [...this.recipeItems];
    const snapshotProducts = [...this.completeProductsForRecipe];
    this.recipeService.deleteRecipeItem(itemId).subscribe({
      next: () => {
        const item = snaphotItems.find(i => i.id === itemId);
        // 1. Usuwamy z listy recipeItems (widok wierszy)
        console.log('Usuwanie elementu o ID:',itemId); // Sprawdź to w konsoli F12!
        this.recipeItems = [...this.recipeItems.filter(i => i.id !== itemId)];
        // 2. Usuwamy z listy produktów (widok szczegółów/makro)
        this.completeProductsForRecipe = this.completeProductsForRecipe.filter(p => p.id != item?.productId);

        // 3.Wysyłamy KOPIĘ tablicy do strumienia
        this.updateProductsView([...this.completeProductsForRecipe]);
      },
      error: err => {
        console.error('Failed to delete recipe item', err);
        this.recipeItems = [...snaphotItems]; // Przywróć poprzedni stan w przypadku błędu
        this.completeProductsForRecipe = [...snapshotProducts]; // Przywróć poprzedni stan produktów
        this.updateProductsView([...this.completeProductsForRecipe]);
        alert('Nie można usunąć składnika.');
      }
    });
  }
}

  interface FinalProduct extends Product {
    weightGrams: number;
    itemId: number;
    nutrients: Nutrient;
    category: Category;
  }
