import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Recipe } from 'src/app/common/recipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  createMode: boolean = false;
  recipeForm!: FormGroup;
  recipes: Recipe[] = [];
  newRecipe!: Recipe;
  snaphotRecipes: Recipe[] = [];

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * inizalization recipeForm
   */

  private initializeForm() {
    this.recipeForm = this.formBuilder.group({
      recipeId: [-1, Validators.required],
      recipeTitle: ['', [Validators.required, Validators.minLength(3)]],
      recipeInstructions: ['', [Validators.minLength(3)]],
      createdAt: [''],
    });
  }

  addRecipe() {
    this.snaphotRecipes = [...this.recipes];

    // const recipeIdValue = this.recipeForm.get('recipeId')!.value;
    const recipeTitleValue = this.recipeForm.get('recipeTitle')!.value;
    const recipeInstructionsValue =
      this.recipeForm.get('recipeInstructions')!.value;
    // const now = new Date();
    // const createdAtValue = now.toISOString().replace('T', ' ').substring(0, 19);

    const newRecipe = new Recipe(
      recipeTitleValue,
      recipeInstructionsValue,
      undefined, // created_at will be set by the backend
      undefined, // recipeId will be set by the backend
    );

    this.recipeService.createRecipe(newRecipe).subscribe({
      next: (createdRecipe) => {
        this.recipes = [...this.snaphotRecipes, createdRecipe];
        this.createMode = false;
        alert('Przepis został dodany!');
      },
      error: (err) => {
        console.error('Failed to create recipe', err);
        this.recipes = this.snaphotRecipes; // revert to snapshot on error
        alert('Coś poszło nie tak... Spróbuj ponownie później');
      },
    });
  }

  showCreateView() {
    this.createMode = true;
  }

  cancelCreateMode() {
    this.createMode = false;
  }
}
