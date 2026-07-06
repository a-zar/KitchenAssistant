import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Recipe } from 'src/app/common/recipe';
import { NotificationService } from 'src/app/services/notification.service';

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
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadRecipes();
  }

  /**
   * initialization recipeForm
   */

  private initializeForm() {
    this.recipeForm = this.formBuilder.group({
      recipeId: [-1, Validators.required],
      recipeTitle: ['', [Validators.required, Validators.minLength(3)]],
      recipeInstructions: ['', [Validators.minLength(3)]],
      createdAt: [''],
    });
  }

 
  onDelete(recipeId: Number) {
    this.snaphotRecipes = [...this.recipes];
    if (confirm('Czy na pewno chcesz usunąć ten przepis?')) {
      this.recipeService.deleteRecipe(recipeId).subscribe({
        next: () => {
          this.recipes = this.recipes.filter((recipe) => recipe.id !== recipeId);
          console.log(`Deleted recipe with id: ${recipeId}`);
          this.notificationService.success(`Przepis został usunięty`);
        },
        error: (err) => {
          this.recipes = this.snaphotRecipes; // revert to snapshot on error
          console.error('Failed to delete recipe', err);
          this.notificationService.error(`Ups... Spróbuj ponownie później`);
        },
      });
    }
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
        console.log('Loaded recipes:', this.recipes);
      },
      error: (err) => {
        console.error('Failed to load recipes', err);
        this.notificationService.error(`Ups... Spróbuj ponownie później`);

      },
    });
  }

  addRecipe() {
    this.snaphotRecipes = [...this.recipes];

    // const recipeIdValue = this.recipeForm.get('recipeId')!.value;
    const recipeTitleValue = this.recipeForm.get('recipeTitle')!.value;
    const recipeInstructionsValue =
    this.recipeForm.get('recipeInstructions')!.value;

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
        this.notificationService.success(`Przepis został dodany`);
        console.log('Created recipe:', createdRecipe);
        this.recipeForm.reset();
      },
      error: (err) => {
        console.error('Failed to create recipe', err);
        this.recipes = this.snaphotRecipes; // revert to snapshot on error
        this.notificationService.error(`Ups... Spróbuj ponownie później`);
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
