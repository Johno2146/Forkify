import axios from 'axios';


export default class Recipe {
    constructor(id){
        this.id = id;
    }
    async getRecipe(){
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            console.log(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            }catch (error){
            console.log(error);
            alert('Something went wrong :(')
        }
        //return res;
    }

    calcTime(){
        //Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng /3);
        this.time = periods * 15;
        }

    calcServings(){
        this.servings = 4;
    }
    parseIngredient(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ozs', 'ounces', 'ounce','teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'oz', 'tsp', 'tsp', 'pound'];
        const units = [... unitsShort,'g', 'kg'];
        const newIngredients = this.ingredients.map(el => {
            // 1.Uniform units
            let ingredients = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredients = ingredients.replace(unit, unitsShort[i]);
            })
            // 2. Remove ()
            ingredients = ingredients.replace(/ *\([^)]*\) */g, ' ');

            //3.Parse ingridents into count, unit and ingredient
            const arrIng = ingredients.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if(unitIndex > -1){
                //EG 4 1/2 cups arrCound is [4, 1/2]
                // There is a unit 
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                }else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredients: arrIng.slice(unitIndex + 1).join(' ')
                }

            }else if (parseInt(arrIng[0]), 10) {
                // There is no unit, but the 1st element is a number
                objIng = {
                    count: (parseInt(arrIng[0]), 10),
                    unit:'',
                    ingredients: arrIng.slice(1).join(' ')
                }
            }else if (unitIndex === -1){
                //There is no unit and no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredients
                }
            }
            
            return objIng;

        });
        //this.ingredients = newIngredients;
    }

    updateServings(type){
        //servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });
        
        this.servings = newServings;
    }
}
