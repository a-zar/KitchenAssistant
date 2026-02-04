import { Component, OnInit } from '@angular/core';
import { ShoppingList } from 'src/app/common/shopping-list';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  shoppingList: ShoppingList[] = [];
  editingListId: number = -1;

  constructor(private shoppingListService: ShoppingListService, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists(): void {
    this.shoppingListService.getShoppingList().subscribe({
      next: data => this.shoppingList = data,
      error: err => console.error('Failed to load shopping lists', err)
    });
  }

  onCreate(): void{

  }

  setEditingListId(listId: number) {
    this.editingListId = this.editingListId === listId ? -1 : listId;  
  } 

  onDelete(listId: number){
    // optionally confirm
    if (!confirm('Czy na pewno usunąć tę listę?')) return;

    this.shoppingListService.deleteList(listId).subscribe({
    next: () => this.loadLists(),
    error: err => console.error('Delete failed', err)});
  }

  onUpdate(list: ShoppingList) {
    this.shoppingListService.updateList(list).subscribe({
      next: () => this.loadLists(),
      error: err => console.error('Update failed', err)
    });
    this.toggleEditMode();
  }

  toggleEditMode(): void {
    this.editingListId = -1;
  }
}
