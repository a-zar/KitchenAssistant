import { Category } from "./category";
import { Nutrient } from "./nutrient";

export class Product {
    constructor(
        public id: number,
        public name: string,
        public image: string,
        public codeBar: string,
        public category: Category,
        public nutrients: Nutrient
            ){}
}
