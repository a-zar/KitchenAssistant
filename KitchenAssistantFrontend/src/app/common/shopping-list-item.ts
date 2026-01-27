export class ShoppingListItem {
    constructor(
        public productId: number,
        public listId: number,
        public quantity: number = 0,
        public isPurchased?: boolean,
        public note?: string,
    ) {}
}
