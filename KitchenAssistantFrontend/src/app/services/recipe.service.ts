import { Injectable } from '@angular/core';
import { Recipe } from '../common/recipe';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RecipeItem } from '../common/recipe-item';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {

  private baseUrl = `${environment.apiUrl}/recipe`;

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

  updateRecipe (updatedRecipe: Recipe): Observable<any>{
    const url = `${this.baseUrl}/edit/recipeId/${updatedRecipe.id}`;
    return this.httpClient.put(url, updatedRecipe);
  }

  getRecipeItems(recipeId: Number): Observable<any> {
    const url = `${this.baseUrl}/recipeId/${recipeId}/recipeItems`;
    return this.httpClient.get(url);
  }

  deleteRecipeItem(recipeItemId: Number) {
    const url = `${this.baseUrl}/delete/recipeItemId/${recipeItemId}`;
    return this.httpClient.delete(url);
  }


  addRecipeItem(newItem: RecipeItem): Observable<any> {
    const url = `${this.baseUrl}/recipeItem/new`;
    return this.httpClient.post(url, newItem);
  }

  updateRecipeItem(updatedItem: RecipeItem): Observable<any> {
    const url = `${this.baseUrl}/edit/recipeItemId/${updatedItem.id}`;
    return this.httpClient.put(url, updatedItem);
  }
}
