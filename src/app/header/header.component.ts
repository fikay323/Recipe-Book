import { Component, EventEmitter, Output } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.css'],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Output() selectedPage = new Subject<string>()
  emittedDetail: string = 'auth'
  isLoggedIn = false
  userSub: Subscription


  constructor(private dataStorageService: DataStorageService, private authService: AuthService) {}

  onSelect(page: string) {
    this.emittedDetail = page
    this.selectedPage.next(this.emittedDetail)
  }
  
  ngOnInit() {
    this.selectedPage.next(this.emittedDetail)
    this.userSub = this.authService.user.subscribe(user => {
      this.isLoggedIn = user ? true : false
    })
  }
  ngOnDestroy() {
    this.userSub.unsubscribe()
  }

  fetchRecipes() {
    this.dataStorageService.fetchRecipesFromDataBase().subscribe()
  }

  saveRecipes() {
    this.dataStorageService.saveRecipesToDataBase()
  }

  onLogOut() {
    this.authService.logout()
  }

}
