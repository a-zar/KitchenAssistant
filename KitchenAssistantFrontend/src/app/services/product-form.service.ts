import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductForm } from '../common/product-form';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductFormService {

  private productFormUrl = 'http://localhost:8080/api/productCreation/new'

  constructor(private httpClient: HttpClient) { }

  createProduct(productForm: ProductForm): Observable<any>{
    return this.httpClient.post<ProductForm>(this.productFormUrl, productForm);
  }
}
