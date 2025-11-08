import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/common/category';
import { CategoryService } from '../../services/category.service';
import { ProductFormService } from '../../services/product-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NutrientItem } from 'src/app/common/nutrient-item';
import { ProductForm } from 'src/app/common/product-form';
import { Product } from 'src/app/common/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {


  productFormGroup!: FormGroup;
  nutriGrades: string[] = ["-","A", "B", "C", "D", "E"];
  categoryList: Category[] = [];
  productEdited!: Product;

  productForm!: ProductForm;
  nutrientsItem!: NutrientItem;


  constructor(private formBuilder: FormBuilder,
              private categoryService: CategoryService,
              private productFormService: ProductFormService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {

    this.getCategoryList();

    this.productFormGroup = this.formBuilder.group({
      product: this.formBuilder.group({
        productName: new FormControl('', [Validators.required, Validators.minLength(2), 
                                          Validators.pattern('^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9]+[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\\s-%()]*[^\\s]$')]),
        categoryName: new FormControl('', [Validators.required]),
        codeBar: new FormControl('', [Validators.pattern('^.*[^\\s]$')]),
        productImage: new FormControl('', [Validators.pattern('^[a-zA-Z0-9_.\\-/]+(\\.[a-zA-Z0-9_.\\-/]+)+[^\\s]$')]),
      }),

      nutrients: this.formBuilder.group({
        energy: new FormControl('', [Validators.required, Validators.pattern('^^\\d+(\\.\\d+)?$')]),
        carbohydrate: new FormControl('', [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')]),
        sugar: new FormControl('', [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')]),
        fat: new FormControl('', [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')]),
        saturatedFat: new FormControl('', [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')]),
        fiber: new FormControl('', [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')]),
        protein: new FormControl('', [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')]),
        nutritionGrade: new FormControl('', [Validators.required]),
      })
    });
  }

  getCategoryList() {
    return this.categoryService.getCategoryList().subscribe(
      data => {
        this.categoryList = data._embedded.categories;
      }
    )  
  }

  get productName(){return this.productFormGroup.get('product.productName');}
  get categoryName(){return this.productFormGroup.get('product.categoryName');}
  get codeBar(){return this.productFormGroup.get('product.codeBar');}
  get productImage(){return this.productFormGroup.get('product.productImage');}

  get energy(){return this.productFormGroup.get('nutrients.energy');}
  get carbohydrate(){return this.productFormGroup.get('nutrients.carbohydrate');}
  get sugar(){return this.productFormGroup.get('nutrients.sugar');}
  get fat(){return this.productFormGroup.get('nutrients.fat');}
  get saturatedFat(){return this.productFormGroup.get('nutrients.saturatedFat');}
  get fiber(){return this.productFormGroup.get('nutrients.fiber');}
  get protein(){return this.productFormGroup.get('nutrients.protein');}
  get nutritionGrade(){return this.productFormGroup.get('nutrients.nutritionGrade');}

  onSubmit(){
    console.log("handling the submit button");

    if(this.productFormGroup.invalid) {
      this.productFormGroup.markAllAsTouched();
    }

    //set up and populate nutrientItem
    let nutrientItem= new NutrientItem();

    nutrientItem.energy = parseInt(this.productFormGroup.get('nutrients.energy')?.value);
    nutrientItem.carbohydrate = parseFloat(this.productFormGroup.get('nutrients.carbohydrate')?.value);
    nutrientItem.sugar = parseFloat(this.productFormGroup.get('nutrients.sugar')?.value);
    nutrientItem.fat = parseFloat(this.productFormGroup.get('nutrients.fat')?.value);
    nutrientItem.saturatedFat = parseFloat(this.productFormGroup.get('nutrients.saturatedFat')?.value);
    nutrientItem.fiber = parseFloat(this.productFormGroup.get('nutrients.fiber')?.value);
    nutrientItem.protein = parseFloat(this.productFormGroup.get('nutrients.protein')?.value);
    nutrientItem.nutritionGrade = this.productFormGroup.get('nutrients.nutritionGrade')?.value;

    let productForm = new ProductForm();

    productForm.productName = this.productFormGroup.get('product.productName')?.value;
    productForm.codeBar = this.productFormGroup.get('product.codeBar')?.value;
    productForm.productImage = this.productFormGroup.get('product.productImage')?.value;
    productForm.categoryName = this.productFormGroup.get('product.categoryName')?.value;

    //copy object
    productForm.nutrient = JSON.parse(JSON.stringify(nutrientItem));

    //call rest api 

    if(this.productFormGroup.valid){

      this.productFormService.createProduct(productForm).subscribe(
        {
          next: response => {
            alert(`Nowy produkt został zapisany: ${response.productName}`);

            this.resetProductForm();
          },
          error: err => {
            alert(`Error: ${err.message}`);
          }
        }
      );
    console.log(JSON.stringify(productForm))
    }
  }

  resetProductForm() {
    this.productFormGroup.reset();

    //navigate back to products list
    this.router.navigateByUrl("/products")
  }

}
