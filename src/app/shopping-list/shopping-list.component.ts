import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from '../shopping.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  constructor(private shoppingService: ShoppingService) { }

  ingredients = this.shoppingService.ingredients

  ngOnInit() {
  }

  addToForm(ingredient: Ingredient, index: number) {
    this.shoppingService.addIngredientToForm(ingredient, index)
  }

}
