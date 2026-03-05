import { Injectable } from '@angular/core';
import { Recipe } from '../common/recipe';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  getRecipes(): Observable<Recipe[]> {
    const url = this.baseUrl;
    return this.httpClient.get<Recipe[]>(url);
  }
}
