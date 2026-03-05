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
    this.loadRecipes();
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


  // TODO dodac snaphot
  onDelete(recipeId: Number) {
    this.recipeService.deleteRecipe(recipeId).subscribe({
      next: () => {
        this.recipes = this.recipes.filter((recipe) => recipe.id !== recipeId);
        alert('Przepis został usunięty!');
      },
      error: (err) => {
        console.error('Failed to delete recipe', err);
        alert('Coś poszło nie tak... Spróbuj ponownie później');
      },
    });
  }

  loadRecipes() {
    this.recipeService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.recipes = this.recipes.map((item) => {
          if (item.createdAt != null) {
            item.createdAt = item.createdAt!.replace('T', ' ').substring(0, 16);
            return item;
          }
          return item;
        });
        // this.recipes = data.map((item) => { item.created_at = item.created_at!.replace('T', ' ').substring(0, 19); return item; });
        console.log('Loaded recipes:', this.recipes);
      },
      error: (err) => {
        console.error('Failed to load recipes', err);
        alert('Coś poszło nie tak... Spróbuj ponownie później');
      },
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
      undefined, // created_at will be set by the backend in db
      undefined, // recipeId will be set by the backend
    );

    this.recipeService.createRecipe(newRecipe).subscribe({
      next: (createdRecipe) => {
        createdRecipe.created_at = createdRecipe.created_at
          .replace('T', ' ')
          .substring(0, 19);
        this.recipes = [...this.snaphotRecipes, createdRecipe];
        this.createMode = false;
        alert('Przepis został dodany!');
        console.log('Created recipe:', createdRecipe);
        this.recipeForm.reset();
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
