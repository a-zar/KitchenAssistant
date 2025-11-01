import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {


  productFormGroup!: FormGroup;
  nutriGrades: string[] = ["A", "B", "C", "D", "E"];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

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

  onSubmit(){
    console.log("handling the submit button");
    console.log(this.productFormGroup.get('product')?.value);
    console.log(this.productFormGroup.get('nutrients')?.value);
  }

}
