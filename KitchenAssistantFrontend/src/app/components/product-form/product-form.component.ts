import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
        productName: [''],
        categoryName: [''],
        codeBar: [''],
        productImage: ['']
      }),

      nutrients: this.formBuilder.group({
        energy: [''],
        carbohydrate: [''],
        sugar: [''],
        fat: [''],
        saturatedFat: [''],
        fiber: [''],
        nutritionGrade: [''],
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
