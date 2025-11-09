import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductForm } from '../common/product-form';
import { Observable } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductFormService {

  private productFormUrl = 'http://localhost:8080/api/productCreation'

  constructor(private httpClient: HttpClient) { }

  createProduct(productForm: ProductForm): Observable<any>{
    const newFormUrl = `${this.productFormUrl}/new`
    return this.httpClient.post<ProductForm>(newFormUrl, productForm);
  }

  editProduct(theProductId : number, productForm: ProductForm): Observable<any> {
    const editFormUrl = `${this.productFormUrl}/edit/${theProductId}`;
    return this.httpClient.put<ProductForm>(editFormUrl, productForm); 
    
  }
}
