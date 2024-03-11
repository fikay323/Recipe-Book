import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Recipe } from '../recipes/recipe.model';
import { Subject, map, tap } from 'rxjs';
import { RecipeService } from '../recipes/recipe.service';

@Injectable()
export class DataStorageService {
  fetchState  = new Subject<boolean>()

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  saveRecipesToDataBase() {
    const recipes = this.recipeService.getRecipes()
    this.http.put(
      'https://shopping-app-4afdd-default-rtdb.firebaseio.com/recipes.json',
      recipes
    ).subscribe()
  }

  fetchRecipesFromDataBase() {
    this.fetchState.next(true)
    return this.http.get(
      'https://shopping-app-4afdd-default-rtdb.firebaseio.com/recipes.json',
      ).pipe(
        map((recipes) => {
          const recipeArray = []
          for(let key in recipes) {
            if(recipes.hasOwnProperty(key)) {
              const recipe: Recipe = {
                ...recipes[key],
                ingredients: recipes[key].ingredients ? recipes[key].ingredients : [],
                id: key,
              }
              recipeArray.push(recipe)
            }
          }
          return recipeArray
        }), tap(responseData => {
          this.recipeService.setRecipes(responseData)
          this.fetchState.next(false)
        }))
      }
    }
