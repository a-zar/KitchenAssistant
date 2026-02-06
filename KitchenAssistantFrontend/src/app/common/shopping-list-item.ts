export class ShoppingListItem {
    constructor(
        public id: number,
        public productId: number,
        public listId: number,
        public quantity: number = 0,
        public isPurchased?: boolean,
        public note?: string,
    ) {}
}
