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
        productName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        categoryName: new FormControl('', [Validators.required]),
        codeBar: [''],
        productImage: ['']
      }),

      nutrients: this.formBuilder.group({
        energy: new FormControl('', [Validators.required]),
        carbohydrate: new FormControl('', [Validators.required]),
        sugar: new FormControl('', [Validators.required]),
        fat: new FormControl('', [Validators.required]),
        saturatedFat: new FormControl('', [Validators.required]),
        fiber: new FormControl('', [Validators.required]),
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

  onSubmit(){
    console.log("handling the submit button");
    console.log(this.productFormGroup.get('product')?.value);
    console.log(this.productFormGroup.get('nutrients')?.value);
  }

}
