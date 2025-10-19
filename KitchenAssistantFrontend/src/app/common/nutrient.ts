export class Nutrient {
    
    constructor(
                public id: number,
                public energy: string,
                public fat: string,
                public saturatedFat: string,
                public carbohydrate: string,
                public sugar: string,
                public protein: string,
                public fiber: string,
                public nutritionGrade: string
    ){}
}
