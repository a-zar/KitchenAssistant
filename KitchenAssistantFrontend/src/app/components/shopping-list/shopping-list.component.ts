import { Component, OnInit } from '@angular/core';
import { ShoppingList } from 'src/app/common/shopping-list';
import { ShoppingListService } from '../../services/shopping-list.service';
import { ActivatedRoute } from '@angular/router';
import { ShoppingListItem } from '../../common/shopping-list-item';
import { RecurrencePattern } from 'src/app/common/enums/recurrence-pattern';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  shoppingLists: ShoppingList[] = [];
  shoppingList: ShoppingList = new ShoppingList('');
  editingListId: number = -1;
  createMode : boolean = false; 
  
  readonly RecurrencePattern = RecurrencePattern;
  recurrenceOptions = Object.values(RecurrencePattern);

  labels: Record<RecurrencePattern, string> = {
    [RecurrencePattern.BRAK]: 'Brak powtarzania',
    [RecurrencePattern.DAILY]: 'Codziennie',
    [RecurrencePattern.WEEKLY]: 'Co tydzień',
    [RecurrencePattern.MONTHLY]: 'Co miesiąc',
    [RecurrencePattern.YEARLY]: 'Co rok'
  };  

  constructor(private shoppingListService: ShoppingListService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists(): void {
    this.shoppingListService.getShoppingList().subscribe({
      next: data => this.shoppingLists = data,
      error: err => console.error('Failed to load shopping lists', err)
    });
  }

  onCreate(list: ShoppingList): void{
    this.createMode = false;
    this.shoppingListService.createList(list).subscribe({
      next: () => this.loadLists(),
      error: err => console.error('Create failed', err)
    });
  }

  showCreateView(): void {
    this.createMode = true;
  }

  cancelCreateMode(): void {
    this.createMode = false;
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
