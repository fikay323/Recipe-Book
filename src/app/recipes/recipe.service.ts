import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingService } from "../shopping.service";
import { Subject } from "rxjs";

@Injectable()
export class RecipeService  {
    recipeChanged = new Subject<Recipe[]>()
    constructor(private shoppingService: ShoppingService) {}

    recipes: Recipe[] = [
        // new Recipe('A Test Recipe 1', 'This is simply a test 1', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg', [new Ingredient('potato', 10), new Ingredient('spinach', 20)]),
        // new Recipe('Another Test Recipe', 'This is simply a test 2', 'https://www.foodandwine.com/thmb/pwFie7NRkq4SXMDJU6QKnUKlaoI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Ultimate-Veggie-Burgers-FT-Recipe-0821-5d7532c53a924a7298d2175cf1d4219f.jpg', [new Ingredient('yam', 10), new Ingredient('lettuce', 30)])
    ];
    selectedRecipe: Recipe

    selectRecipe(selected) {
        this.selectedRecipe = selected
    }
    editRecipe(index: number, recipe: Recipe) {
        this.recipes[index] = recipe
    }
    getRecipes() {
        return this.recipes.slice()
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe)
        return this.recipes.length
    }
    removeRecipe(index: number) {
        this.recipes.splice(index, 1)
    }
    getRecipe(id: number) {
        return this.recipes[id]
    }
    addToShoppingList(ingredient: Ingredient[]) {
        this.shoppingService.addToIngredients(ingredient)        
    }
    setRecipes(recipesArray: Recipe[]) {
        this.recipes = recipesArray
        this.recipeChanged.next(this.recipes)
    }
}