import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShoppingService } from 'src/app/shopping.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('f') ingredientForm: NgForm
  index: number
  bool = false

  constructor(private shoppingService: ShoppingService) { }

  ngOnInit() {
    this.shoppingService.emitIngredient.subscribe((ingredient) => {
      this.index = ingredient.index
      this.bool = true   
      this.ingredientForm.setValue({
        Name: ingredient.ingredient.name,
        Amount: ingredient.ingredient.amount
      })
    })
  }

  submitIngredient() {
    if(this.bool) {
      this.shoppingService.editIngredient(this.index, {
        name: this.ingredientForm.value.Name,
        amount: this.ingredientForm.value.Amount,
      })
    } else {
      this.shoppingService.addIngredients({
        name: this.ingredientForm.value.Name,
        amount: this.ingredientForm.value.Amount,
      }) 
    }
    this.ingredientForm.resetForm()
    this.bool = false
  }

  clearForm() {
    this.ingredientForm.reset()
    this.bool = false
  }

  removeIngredient() {
    this.shoppingService.removeIngredient(this.index)
    this.clearForm()
  }
}
