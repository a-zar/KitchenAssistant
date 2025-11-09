export class Nutrient {
    
    constructor(
        public id: number,
        public energy: number,
        public fat: number,
        public saturatedFat: number,
        public carbohydrate: number,
        public sugar: number,
        public protein: number,
        public fiber: number,
        public nutritionGrade: String
    ){}
}
