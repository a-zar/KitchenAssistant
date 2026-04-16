import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { Category } from 'src/app/common/category';
import { Nutrient } from 'src/app/common/nutrient';
import { Product } from 'src/app/common/product';
import { Recipe } from 'src/app/common/recipe';
import { RecipeItem } from 'src/app/common/recipe-item';
import { ProductService } from 'src/app/services/product.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  
  private productsSubject = new BehaviorSubject<FinalProduct[]>([]);
  products$ = this.productsSubject.asObservable();

  mainForm!: FormGroup;
  isEditable = false;

  recipeId: number = -1; 
  recipe!: Recipe;

  recipeItems: RecipeItem[] = []; 
  completeProducts: FinalProduct[] = [];

  productsToSelect : Product[] = []; //#TODO
  selectedProductId: number = -1;    //#TODO
  filteredProducts: Product[] = []; //#TODO

  categories: Category[] = [];  //#TODO
  selectedCategoryId: number = -1; //#TODO
  
  constructor(private fb: FormBuilder, 
              private recipeService: RecipeService,
              private productService: ProductService,
              private route: ActivatedRoute) { 

    this.mainForm = this.fb.group({
      // Grupa dla RecipeDto
      recipe: this.fb.group({
        recipeTitle: ['', Validators.required],
        recipeInstructions: ['']
      })
    });
  }

  ngOnInit(): void {
    this.mainForm.disable(); // Na początku wszystko jest nieedytowalne
    this.setRecipeId();
    this.loadRecipe();
  }

  updateProducts(newProducts: FinalProduct[]) {
    this.productsSubject.next([...newProducts]);
  }

  setRecipeId(): void {
    this.recipeId = Number(this.route.snapshot.paramMap.get('recipeId'));
  }

  loadRecipe() {
    this.recipeService.getRecipe(this.recipeId).subscribe({
      next: data => {
        this.recipe = data;
        this.mainForm.patchValue({ recipe: this.recipe });

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
              this.completeProducts.push(product);
              this.updateProducts([...this.completeProducts]);
              console.log('Loaded product for item:', item, 'Product details:', product);
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

    console.log('Recipe items after loadRecipeItems call:', this.recipeItems);
    console.log('Complete products to calculate after loadRecipeItems call:', this.completeProducts);
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
    return this.completeProducts.reduce((acc, product) => {
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
    if (this.mainForm.valid) {
      const recipeData = this.mainForm.get('recipe')?.value;
      const itemData = this.mainForm.get('item')?.value;
      const productData = this.mainForm.get('product')?.value;

      console.log('Saving recipe with data:', { recipeData, itemData, productData });
      // #TODO  zapis do bazy danych
    } else {
      alert('Formularz jest niepoprawny. Proszę popraw błędy i spróbuj ponownie.');
    }
  }

  onDeleteItem(itemId: number) {
    const snaphotItems = [...this.recipeItems];
    const snapshotProducts = [...this.completeProducts];
    this.recipeService.deleteRecipeItem(itemId).subscribe({
      next: () => {
        const item = snaphotItems.find(i => i.id === itemId);
        // 1. Usuwamy z listy recipeItems (widok wierszy)
        console.log('Usuwanie elementu o ID:',itemId); // Sprawdź to w konsoli F12!
        this.recipeItems = [...this.recipeItems.filter(i => i.id !== itemId)];
        // 2. Usuwamy z listy produktów (widok szczegółów/makro)
        this.completeProducts = this.completeProducts.filter(p => p.id != item?.productId);

        // 3.Wysyłamy KOPIĘ tablicy do strumienia
        this.updateProducts([...this.completeProducts]);
        
        console.log('Po usunięciu:', this.recipeItems);
      },
      error: err => {
        console.error('Failed to delete recipe item', err);
        this.recipeItems = [...snaphotItems]; // Przywróć poprzedni stan w przypadku błędu
        this.completeProducts = [...snapshotProducts]; // Przywróć poprzedni stan produktów
        this.updateProducts([...this.completeProducts]);
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
