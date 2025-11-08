import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/common/category';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product | any;

  constructor(private productService: ProductService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
    this.handleProductDetails();
    });
  }

  handleProductDetails() {

    //get id
    const theProductId: number =+ this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
    
    this.productService.getProductCategory(theProductId).subscribe(
      data => {
        this.product.category = data;
      }
    )

    this.productService.getProductNutrients(theProductId).subscribe(
      data => {
        this.product.nutrients = data;
      }
    )

    
  }

}
