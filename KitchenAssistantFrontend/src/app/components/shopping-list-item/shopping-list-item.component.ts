import { Component, OnInit } from '@angular/core';
import { ShoppingListItem } from '../../common/shopping-list-item';
import { ShoppingListItemService } from 'src/app/services/shopping-list-item.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.css']
})
export class ShoppingListItemComponent implements OnInit {

  items: ShoppingListItem[] = [];
  constructor(private route: ActivatedRoute,
              private shoppingListItemService: ShoppingListItemService) { }

  ngOnInit(): void {
    this.loadsItems();
  }

  loadsItems(): void {
    const listId = Number(this.route.snapshot.paramMap.get('listId'));
    this.shoppingListItemService.getItemsByListId(listId).subscribe({
      next: data => this.items = data,
      error: err => console.error('Failed to load shopping list items', err)
    });
  }



}
