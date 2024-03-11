import { Component, OnInit, HostListener, Injectable, Input } from '@angular/core';
import { ActivatedRoute, Params,Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})

@Injectable()
export class RecipeDetailComponent {
  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) {}
  @Input() recipeDetail
  id: number

  addToShoppingList() {
    this.recipeService.addToShoppingList(this.recipeDetail.ingredients)
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.recipeDetail = this.recipeService.getRecipe(+params.id)
      this.id = +params.id
    })
  }
  removeRecipe() {
    this.recipeService.removeRecipe(this.id)
    this.router.navigate(['recipes'])
  }
}