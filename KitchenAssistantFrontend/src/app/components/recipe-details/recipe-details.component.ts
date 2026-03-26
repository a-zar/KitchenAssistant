import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  mainForm!: FormGroup;
  isEditable = false;

  recipeId: number = -1; 
  recipe!: Recipe;

  recipeItems: RecipeItem[] = []; 

  completeProducts: CompleteProduct[] = [];

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
      // Grupa dla RecipeItemDto
      // item: this.fb.group({
      //   weightGrams: [0, [Validators.required, Validators.min(0)]],
      //   productId: [null, Validators.required]
      // }),
      // Grupa dla ProductDto (tylko do wyświetlania, więc bez walidatorów)
      // product: this.fb.group({
      //   name: [{ value: '', disabled: true }],
      //   category: [{ value: '', disabled: true }]   
      // })
    });
  }

  ngOnInit(): void {
    this.mainForm.disable(); // Na początku wszystko jest nieedytowalne
    this.setRecipeId();
    this.loadRecipe();
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
        console.log("Dane odebrane ze Springa:", this.recipe); // TUTAJ sprawdź wynikconsole.log("Dane odebrane ze Springa:", this.recipe); // TUTAJ sprawdź wynik
      },
      error: err => console.error('Failed to load recipe details', err)
    });

    this.loadRecipeItems(); // Załaduj dane przepisów do formularza


    console.log("recipe id: "+ this.recipeId);
    console.log( "recipe object called: ", this.recipe);
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
              this.completeProducts.push(product);
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

  getProductDetails(productId: number): CompleteProduct | undefined {
    return this.completeProducts.find(p => p.id === productId);
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
  
  toggleEdit() {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.mainForm.enable(); // Włącz edycję
    } else {
      this.mainForm.disable(); // Wyłącz edycję
      this.loadRecipeItems(); // Załaduj ponownie dane, aby anulować zmiany
    }
  } 

}



interface CompleteProduct extends Product{
 category: Category;
 nutrients: Nutrient;
}
