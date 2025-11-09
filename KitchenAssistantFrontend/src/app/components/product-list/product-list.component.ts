import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

  products: Product[] =[];
  currentCategoryId: number =1;
  previousCategoryId: number=1;
  searchMode: boolean = false;

  //new properties fir pagination
  thePageNumber: number = 1;
  thePageSize: number = 8;
  theTotalElements: number= 0;

  previousKeyword: string =""

  constructor(private productService: ProductService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
  }

  handleListProducts(){
      //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
    //get the "id" param string and convert string to a number using the "+" symbol
    this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      if(this.previousCategoryId != this.currentCategoryId){
        this.thePageNumber = 1;}

      this.previousCategoryId = this.currentCategoryId;
      this.productService.getProductListByCategoryPagination(this.currentCategoryId, this.thePageNumber -1, 
                          this.thePageSize)
                          .subscribe(data => {
                          this.products = data._embedded.products;
                          this.thePageNumber = data.page.number + 1;
                          this.thePageSize = data.page.size;
                          this.theTotalElements = data.page.totalElements;
                          });
    }
    else{
     //not category id available .. default to category id 1
    this.productService.getProductListPagination(this.thePageNumber -1, this.thePageSize)
    .subscribe(this.processResult());
  }
  console.log(`current: ${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProductPagination(theKeyword, this.thePageNumber -1, 
                        this.thePageSize).subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {  
    this.thePageSize = +pageSize;
    this.thePageNumber =1;
    this.listProducts();
    }

  processResult(){
    return(data: any)=>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
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
