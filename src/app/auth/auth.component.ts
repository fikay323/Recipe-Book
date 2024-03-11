import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true
  isLoading = false
  error: string = null

  constructor(private authService: AuthService,  private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  handleClose() {
    this.error = null
  }

  onSubmitForm(authForm: NgForm) {
    if(!authForm.valid) {
      return;
    }

    let authObs
    
    this.isLoading = true
    const email = authForm.value.email
    const password = authForm.value.password
     if(this.isLoginMode) {
       authObs = this.authService.login(email, password)
    } else {
       authObs = this.authService.signUp(email, password)
     }

     authObs.subscribe((responseData) => {
        this.isLoading = false
        this.router.navigate(['/recipes'])
      }, (errorMessage) => {
       this.isLoading = false
       this.error = errorMessage        
      })

    authForm.reset()
  }
}
