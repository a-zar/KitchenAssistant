import { Component, OnInit } from '@angular/core';
import { ShoppingListItem } from '../../common/shopping-list-item';
import { ShoppingListItemService } from 'src/app/services/shopping-list-item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingListService } from 'src/app/services/shopping-list.service';

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.css']
})
export class ShoppingListItemComponent implements OnInit {

  items: ShoppingListItem[] = [];
  listName: string | null = '';

  constructor(private route: ActivatedRoute,
    private Router: Router,
    private shoppingListItemService: ShoppingListItemService) {}

  ngOnInit(): void {
    this.loadListName();
    this.loadsItems();
  }

  loadListName(): void {
    this.route.queryParamMap.subscribe({
      next: (params) => {
        // Klucz musi być identyczny jak w URL (?listName=...)
        this.listName = params.get('listName'); 
        console.log('Odebrany parametr:', this.listName);
      },
      error: (err) => console.error(err)
    });
  }

  loadsItems(): void {
    const listId = Number(this.route.snapshot.paramMap.get('listId'));
    this.shoppingListItemService.getItemsByListId(listId).subscribe({
      next: data => this.items = data,
      error: err => console.error('Failed to load shopping list items', err)
    });
  }
}
