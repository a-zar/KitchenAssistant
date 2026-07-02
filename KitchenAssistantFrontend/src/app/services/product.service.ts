import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Product } from '../common/product';
import { Nutrient } from '../common/nutrient';
import { Category } from '../common/category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = `${environment.apiUrl}/products`;
  constructor(private httpClient: HttpClient) {}

  getCompleteProduct(theProductId: number): Observable<CompleteProduct> {
    const data$ = forkJoin({
    product: this.getProduct(theProductId),
    category: this.getProductCategory(theProductId),
    nutrients: this.getProductNutrients(theProductId),
  });
  return data$.pipe(
    map(({ product, category, nutrients }) => ({ ...product, category, nutrients, weightGrams: 0, itemId:-1  }))
  );
  }

  getAllProductsWithCategories(): Observable<ProductWithCategory[]> {
  return this.getProductList().pipe(
    map(response => response._embedded.products),
    switchMap(products => {
      const productRequests = products.map(product => forkJoin({
        category: this.getProductCategory(product.id),   
      }).pipe(
        map(({ category }) => ({ ...product, category} as ProductWithCategory))
      ));
      return forkJoin(productRequests);
    })
  );
}

  getProductListPagination(thePage: number, thePageSize:number): Observable<GetResponseProducts>{
    
    const searchUrl = `${this.baseUrl}`
                    + `?page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductListByCategoryPagination(theCategoryId: number,
                                      thePage: number, 
                                      thePageSize:number): Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/search/by-category?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  
  getProductListByCategory(theCategoryId: number): Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/search/by-category?id=${theCategoryId}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
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

interface CompleteProduct extends Product{
 category: Category;
 nutrients: Nutrient;
 weightGrams: number;
 itemId: number;
}


interface ProductWithCategory extends Product {
  category: Category;
}