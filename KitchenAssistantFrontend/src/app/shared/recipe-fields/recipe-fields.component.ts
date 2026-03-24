import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-recipe-fields',
  template: `
    <div [formGroup]="group">
      <input type="text" 
            formControlName="recipeTitle"
            placeholder="Tytuł przepisu" 
            class="form-control m-1"
            required 
            minlength="3">
      
      <div *ngIf="group.get('recipeTitle')?.invalid && (group.get('recipeTitle')?.dirty || group.get('recipeTitle')?.touched)" 
          class="text-danger m-1" style="font-size: 0.85rem;">
        <div *ngIf="group.get('recipeTitle')?.errors?.['required']">Tytuł jest wymagany.</div>
        <div *ngIf="group.get('recipeTitle')?.errors?.['minlength']">Minimum 3 znaki.</div>
      </div>

      <textarea 
            formControlName="recipeInstructions"
            placeholder="Opis przepisu"
            class="form-control m-1"
            minlength="3">
      </textarea>

      <div *ngIf="group.get('recipeInstructions')?.invalid && (group.get('recipeInstructions')?.dirty || group.get('recipeInstructions')?.touched)" 
            class="text-danger m-1" style="font-size: 0.85rem;">
        <div *ngIf="group.get('recipeInstructions')?.errors?.['minlength']">Opis musi mieć min. 3 znaki.</div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class RecipeFieldsComponent implements OnInit {
    @Input() group!: FormGroup | AbstractControl | any;

  constructor() { }

  ngOnInit(): void {}

}
