import { Component, Injectable, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipes-edit',
  templateUrl: './recipes-edit.component.html',
  styleUrls: ['./recipes-edit.component.css']
})

@Injectable()
export class RecipesEditComponent implements OnInit {
  id: number
  editMode = false
  newRecipeForm: FormGroup

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id
      this.editMode = params.id != null      
    })
    this.initForm()
  }

  private initForm() {
    let recipeName = ''
    let recipeImageUrl = ''
    let recipeDescription = ''
    let recipeIngredient = new FormArray([])

    if(this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id)
      recipeName = recipe.name
      recipeImageUrl = recipe.imagePath
      recipeDescription = recipe.description
      if(recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredient.push(new FormGroup({
            'name': new FormControl(ingredient.name),
            'amount': new FormControl(ingredient.amount),
          }))
        }
      }
    }

    
    this.newRecipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'url': new FormControl(recipeImageUrl, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredient
    })
  }

  getControls() {    
    return (<FormArray>this.newRecipeForm.get('ingredients')).controls
  }

  addRecipe() {
    const recipe = new Recipe(
      this.newRecipeForm.value.name,
      this.newRecipeForm.value.description,
      this.newRecipeForm.value.url,
      this.newRecipeForm.value.ingredients
    )
    if (this.editMode) {
      this.recipeService.editRecipe(this.id, recipe)
      this.router.navigate(['recipes', this.id])
    } else {
      const length = this.recipeService.addRecipe(recipe)
      this.router.navigate(['recipes', length-1])
    }
  }

  onAddIngredient(){
    const control = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')]),
    });
    (<FormArray>this.newRecipeForm.get('ingredients')).push(control)
  }

  removeIngredient(i) {
    (<FormArray>this.newRecipeForm.get('ingredients')).removeAt(i)
  }

  onCancelForm() {
    this.newRecipeForm.reset()
    this.router.navigate(['recipes'])
  }

}
