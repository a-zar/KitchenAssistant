import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';

import { HttpClientModule} from '@angular/common/http';
import { ProductService } from './services/product.service';
import { CategoryListComponent } from './components/category-list/category-list.component';

import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { ClickStopPropagationDirective } from './shared/directives/click-stop-propagation.directive';

const routes: Routes = [

  {path: 'shoppingList', component: ShoppingListComponent},
  {path: 'shoppingList/:id', component: ShoppingListComponent},
  // {path: 'shoppingList/**', redirectTo: '/shoppingList', pathMatch: 'full'},

  {path: 'products/new', component: ProductFormComponent},
  {path: 'products/edit/:id', component: ProductFormComponent},

  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path:'category/:id', component: ProductListComponent},
  {path:'category', component: ProductListComponent},
  {path:'products', component: ProductListComponent},

  {path:'', redirectTo: '/products', pathMatch: 'full'},
  {path:'**', redirectTo:'/products', pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    CategoryListComponent,
    SearchComponent,
    ProductDetailsComponent,
    ProductFormComponent,
    ShoppingListComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    ClickStopPropagationDirective
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
