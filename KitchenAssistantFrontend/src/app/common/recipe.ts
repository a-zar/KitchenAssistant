export class Recipe {
    constructor(
        public title: String,
        public instruction: String,
        public createdAt?: String,  //YYYY-MM-DD
        public id?: Number
    ){}
}