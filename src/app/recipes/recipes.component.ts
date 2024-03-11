import { Component,  Injectable } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
@Injectable()
export class RecipesComponent{
  isFetching = false

  constructor(private dataStorageService: DataStorageService ) {}
  
  ngOnInit() {
    this.dataStorageService.fetchState.subscribe((bool) => {
      this.isFetching = bool
    })
  }

}
