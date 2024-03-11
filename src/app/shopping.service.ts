import { Subject } from "rxjs";
import { Ingredient } from "./shared/ingredient.model";

export class ShoppingService {
    ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ];

    emitIngredient = new Subject<any>()

    addIngredients(ingredient: Ingredient) {
        this.ingredients.push(ingredient)
    }
    
    addToIngredients(ingredient) {
        this.ingredients = [...this.ingredients, ...ingredient]
    }
    

    addIngredientToForm(ingredient, index) {
        const ingredientEmitted = {
            ingredient: ingredient,
            index: index,
        }
        this.emitIngredient.next(ingredientEmitted)
    }

    removeIngredient(index: number) {
        this.ingredients.splice(index, 1)        
    }

    editIngredient(index, ingredient) {
        this.ingredients[index].name = ingredient.name
        this.ingredients[index].amount = ingredient.amount
    }
}