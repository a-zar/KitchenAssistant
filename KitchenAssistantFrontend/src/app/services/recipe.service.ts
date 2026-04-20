import { Injectable } from '@angular/core';
import { Recipe } from '../common/recipe';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RecipeItem } from '../common/recipe-item';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {

  private baseUrl = 'http://localhost:8080/api/recipe';

  constructor(private httpClient: HttpClient) {}

  createRecipe(newRecipe: Recipe): Observable<any> {
    const url = `${this.baseUrl}/new`;
    return this.httpClient.post(url, newRecipe);
  }

  getRecipe(recipeId: number): Observable<any> {
    const url = `${this.baseUrl}/recipeId/${recipeId}`;
    return this.httpClient.get(url);
  }

  getRecipes(): Observable<Recipe[]> {
    const url = this.baseUrl;
    return this.httpClient.get<Recipe[]>(url);
  }

  deleteRecipe(recipeId: Number) {
    const url = `${this.baseUrl}/delete/recipeId/${recipeId}`;
    return this.httpClient.delete(url);
  }

  getRecipeItems(recipeId: Number): Observable<any> {
    const url = `${this.baseUrl}/recipeId/${recipeId}/recipeItems`;
    return this.httpClient.get(url);
  }

  deleteRecipeItem(recipeItemId: Number) {
    const url = `${this.baseUrl}/delete/recipeItemId/${recipeItemId}`;
    return this.httpClient.delete(url);
  }

  updateRecipe(recipeId: Number, updatedRecipe: Recipe): Observable<any>{
    const url = `${this.baseUrl}/update/recipeId/${recipeId}`;
    return this.httpClient.put(url, updatedRecipe);
  }

  addRecipeItem(newItem: RecipeItem): Observable<any> {
    const url = `${this.baseUrl}/recipeItem/new`;
    return this.httpClient.post(url, newItem);
  }
}
