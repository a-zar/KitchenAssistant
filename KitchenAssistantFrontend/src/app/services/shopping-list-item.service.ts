import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListItemService {
  private baseUrl = 'http://localhost:8080/api/shoppingList';

  constructor(private httpClient: HttpClient) { }

  getItemsByListId(listId: number): Observable<any> {
    const url = `${this.baseUrl}/listId/${listId}/items`;
    return this.httpClient.get(url);
  }
}