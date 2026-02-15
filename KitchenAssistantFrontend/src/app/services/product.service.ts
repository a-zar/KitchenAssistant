import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { Nutrient } from '../common/nutrient';
import { Category } from '../common/category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products'
  constructor(private httpClient: HttpClient) {}

  getProductListPagination(thePage: number, 
                           thePageSize:number): Observable<GetResponseProducts>{
    
    const searchUrl = `${this.baseUrl}`
                    + `?page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductListByCategoryPagination(theCategoryId: number,
                                      thePage: number, 
                                      thePageSize:number): Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/search/by-category?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    console.log('getProductListByCategoryPagination '+searchUrl);

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  
  getProductListByCategory(theCategoryId: number): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/by-category?id=${theCategoryId}`;

        console.log('getProductListByCategory '+searchUrl);

    return this.httpClient.get<any>(searchUrl);
  }

  getProductList(): Observable<GetResponseProducts>{
    return this.httpClient.get<GetResponseProducts>(this.baseUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/by-name?search=${theKeyword}`;
    return this.httpClient.get<any>(searchUrl);
  }

  
  searchProductPagination(theKeyword: string, thePage: number, 
                          thePageSize:number): Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/search/by-name?search=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getProductCategory(theProductId: number): Observable<Category> {
    const productCategoryUrl = `${this.baseUrl}/${theProductId}/category`;
    return this.httpClient.get<Category>(productCategoryUrl);
  }

  getProductNutrients(theProductId: number): Observable<Nutrient> {
    const productNutrientsUrl = `${this.baseUrl}/${theProductId}/nutrients`;
    return this.httpClient.get<Nutrient>(productNutrientsUrl);
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }, 
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number;
  }
}
