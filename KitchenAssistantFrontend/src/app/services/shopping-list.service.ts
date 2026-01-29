import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingList } from '../common/shopping-list';
import { ShoppingListItem } from '../common/shopping-list-item';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private baseUrl = 'http://localhost:8080/api/shoppingList';

  constructor(private httpClient: HttpClient) {
  }

  getShoppingList(): Observable<ShoppingList[]> {
    const shoppingListUrl = this.baseUrl;
    return this.httpClient.get<ShoppingList[]>(shoppingListUrl);
  }

  getListItems(listId: number): Observable<ShoppingListItem[]> {
    const url = `${this.baseUrl}/listId/${listId}/items`;
    return this.httpClient.get<ShoppingListItem[]>(url);
  }

  deleteList(listId: number): Observable<void> {
    const url = `${this.baseUrl}/delete/listId/${listId}`;
    return this.httpClient.delete<void>(url);
  }
}
  