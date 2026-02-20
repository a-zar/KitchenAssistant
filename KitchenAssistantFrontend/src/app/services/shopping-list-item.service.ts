import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingListItem } from '../common/shopping-list-item';

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

  deleteItem(listId: number, itemId: number): Observable<any> {
    const url = `${this.baseUrl}/listId/${listId}/delete/itemId/${itemId}`;
    return this.httpClient.delete(url);
  }

  updateItem(listId: number, itemId: number, item: ShoppingListItem): Observable<any> {
    const url = `${this.baseUrl}/listId/${listId}/update/itemId/${itemId}`;
    return this.httpClient.put(url, item);
  }

  createItem(item: ShoppingListItem): Observable<any>{
    const url = `${this.baseUrl}/items/new`;
    return this.httpClient.post(url, item);
  }
}