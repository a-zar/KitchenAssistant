import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, switchMap, Observable } from 'rxjs';
import { Category } from '../../common/category';
import { Nutrient } from 'src/app/common/nutrient';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product$: Observable<CompleteProduct> | undefined;

  constructor(private productService: ProductService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const theProductId: number =+ params.get('id')!;
        const relatedData$ = forkJoin ({
          category: this.productService.getProductCategory(theProductId),
          nutrients: this.productService.getProductNutrients(theProductId)
        });
        return this.productService.getProduct(theProductId).pipe(
          switchMap(product => {
            return relatedData$.pipe(
              map((results): CompleteProduct=> {
                const completeProduct = product as CompleteProduct;
                completeProduct.category = results.category;
                completeProduct.nutrients = results.nutrients;
                return completeProduct;
              })
            );
          })
        );
      })
    );
  }
}

interface CompleteProduct extends Product{
 category: Category;
 nutrients: Nutrient;
}
