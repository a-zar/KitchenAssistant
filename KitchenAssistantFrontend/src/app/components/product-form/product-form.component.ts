import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/common/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {


  productFormGroup!: FormGroup;
  nutriGrades: string[] = ["-","A", "B", "C", "D", "E"];
  categoryList: Category[] = [];


  constructor(private formBuilder: FormBuilder,
                      private categoryService: CategoryService) { }

  ngOnInit(): void {

    this.getCategoryList();

    this.productFormGroup = this.formBuilder.group({
      product: this.formBuilder.group({
        productName: new FormControl('', [Validators.required, Validators.minLength(2), 
                                          Validators.pattern('^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+[0-9\\s]*[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*$')]),
        categoryName: new FormControl('', [Validators.required]),
        codeBar: [''],
        productImage: ['']
      }),

      nutrients: this.formBuilder.group({
        energy: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
        carbohydrate: new FormControl('', [Validators.required, Validators.pattern('^\\d+$')]),
        sugar: new FormControl('', [Validators.required, Validators.pattern('^\\d+$')]),
        fat: new FormControl('', [Validators.required, Validators.pattern('^\\d+$')]),
        saturatedFat: new FormControl('', [Validators.required, Validators.pattern('^\\d+$')]),
        fiber: new FormControl('', [Validators.required, Validators.pattern('^\\d+$')]),
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
  get nutritionGrade(){return this.productFormGroup.get('nutrients.nutritionGrade');}



  onSubmit(){
    console.log("handling the submit button");

    if(this.productFormGroup.invalid) {
      this.productFormGroup.markAllAsTouched();
    }
    console.log(this.productFormGroup.get('product')?.value);
    console.log(this.productFormGroup.get('nutrients')?.value);
  }

}
