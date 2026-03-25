import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/common/category';
import { Nutrient } from 'src/app/common/nutrient';
import { Product } from 'src/app/common/product';
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

  recipeItems: RecipeItem[] = []; 

  completeProductsToCalculate: CompleteProduct[] = [];

  getProductName(productId: number): string {
    const product = this.completeProductsToCalculate.find(p => p.id === productId);
    return product ? product.name : 'Nieznany produkt';
  } 

  productsToSelect : Product[] = []; //#TODO
  selectedProductId: number = -1;    
  filteredProducts: Product[] = [];

  categories: Category[] = [];  //#TODO
  selectedCategoryId: number = -1; 
  

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
    this.loadRecipeItems(); // Załaduj dane przepisów do formularza
  }

  setRecipeId(): void {
    this.recipeId = Number(this.route.snapshot.paramMap.get('recipeId'));
  }

  loadRecipeItems(){
    this.recipeService.getRecipeItems(1).subscribe({
      next: data => { console.log('Loaded recipe items:', data),
        this.recipeItems = data;
        this.recipeItems.forEach(item => {
          this.productService.getCompleteProduct(item.productId).subscribe({
            next: completeProduct => {
              this.completeProductsToCalculate.push(completeProduct);
              // this.calculateNutrients();   //#TODO
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
    console.log('Complete products to calculate after loadRecipeItems call:', this.completeProductsToCalculate);
  }

  toggleEdit() {
  this.isEditable = !this.isEditable;
  if (this.isEditable) {
    this.mainForm.enable(); // Włącz edycję
  } else {
    this.mainForm.disable(); // Wyłącz edycję
    this.loadProductDetails(); // Załaduj ponownie dane, aby anulować zmiany
  }
} 

  loadProductDetails() {
    this.mainForm.reset(); // Resetuj formularz przed załadowaniem danych
    const id = this.selectedProductId; // Pobierz ID produktu z formularza

    this.productService.getCompleteProduct(id).subscribe({
      next: (completeProduct) => {
        this.completeProductsToCalculate.push(completeProduct);
        // this.calculateNutrients();
      },
      error: (err) => {
        console.error('Failed to load product details', err);
        alert('Nie można załadować szczegółów produktu. Spróbuj ponownie później.');
      }
    });
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
}

interface CompleteProduct extends Product{
 category: Category;
 nutrients: Nutrient;
}
