import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../common/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  private baseUrl = 'http://localhost:8080/api/categories'

  constructor(private httpClient: HttpClient) { }

  getCategoryList(): Observable<GetResponseCategories>{
    return this.httpClient.get<GetResponseCategories>(this.baseUrl);
  }
}

interface GetResponseCategories {
  _embedded: {
    categories: Category[];
  }
}

