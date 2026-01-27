export class ShoppingList {
    constructor(
        public listTitle: string,
        public recurrencePattern?: string,
        public nextOccurrence?: string,  //YYYY-MM-DD
        public id?: number
    ) {}
}