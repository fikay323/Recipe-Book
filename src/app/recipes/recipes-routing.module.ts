import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RecipesComponent } from "./recipes.component";
import { AuthGuard } from "../auth/auth.guard";
import { RecipesStartComponent } from "./recipes-start/recipes-start.component";
import { RecipesEditComponent } from "./recipes-edit/recipes-edit.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeResolverService } from "./recipes-resolver.service";

const recipesRoutes: Routes = [
    {
        path: '', 
        component: RecipesComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', component: RecipesStartComponent},
            {path: 'new', component: RecipesEditComponent},
            {path: ':id', component: RecipeDetailComponent, resolve: [RecipeResolverService]},
            {path: ':id/edit', component: RecipesEditComponent, resolve: [RecipeResolverService]},
        ]
    },
]
@NgModule({
    imports: [RouterModule.forChild(recipesRoutes)],
    exports: [RouterModule]
})

export class RecipesRoutingModule{}