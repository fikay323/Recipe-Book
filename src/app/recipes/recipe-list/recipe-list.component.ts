import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { tap } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {
  isFetching = false  

  constructor(private recipeService: RecipeService, private dataStorageService: DataStorageService, private router: Router, private route: ActivatedRoute) { }
  
  recipes: Recipe[]

  ngOnInit() {
    this.dataStorageService.fetchState.subscribe((clicked) => {
      this.isFetching = true
    })
    this.recipeService.recipeChanged.subscribe(recipes => {
      this.recipes = recipes
      this.isFetching = false
    })
    this.recipes = this.recipeService.getRecipes()
  }

  addNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }

}
