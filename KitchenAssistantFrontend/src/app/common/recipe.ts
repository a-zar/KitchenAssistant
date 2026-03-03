export class Recipe {
    constructor(
        public title: String,
        public instructions: String,
        public created_at: String,  //YYYY-MM-DD
        public id?: Number
    ){}
}