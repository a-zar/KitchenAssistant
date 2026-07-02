import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingList } from '../common/shopping-list';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private baseUrl = `${environment.apiUrl}/shoppingList`;

  constructor(private httpClient: HttpClient) {
  }

  getShoppingList(): Observable<ShoppingList[]> {
    const shoppingListUrl = this.baseUrl;
    return this.httpClient.get<ShoppingList[]>(shoppingListUrl);
  }

  deleteList(listId: number): Observable<void> {
    const url = `${this.baseUrl}/delete/listId/${listId}`;
    return this.httpClient.delete<void>(url);
  }

  updateList(list: ShoppingList) : Observable<any> {
    const url = `${this.baseUrl}/edit/listId/${list.id}`;
    return this.httpClient.put(url, list);
  }

  createList(list: ShoppingList): Observable<any> {
    const url = `${this.baseUrl}/new`;
    return this.httpClient.post(url, list);
  }
}
  