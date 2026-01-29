export class ShoppingList {
    constructor(
        public listTitle: string,
        public recurrencePattern?: string,
        public startOccurrenceDate?: string,  //YYYY-MM-DD
        public id?: number
    ) {}
}