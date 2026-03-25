export class RecipeItem {
    constructor(
        public weightGrams: number, 
        public productId: number, 
        public recipeId: number,
        public id?: number,
    ) {}
}
