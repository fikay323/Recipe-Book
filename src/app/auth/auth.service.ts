import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./user,model";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

export interface AuthResponse {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null)
    token: string = null
    private tokenExpirationTimer: any

    constructor(private http: HttpClient, private router: Router) {}

    signUp(email: string, password: string) {
        return this.http.post<AuthResponse>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(catchError(error => {
            return this.handleError(error)
        }), tap((resData: AuthResponse) => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }))
    }
    
    login(email: string, password: string) {
        return this.http.post<AuthResponse>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
            )
            .pipe(catchError(error => {
                return this.handleError(error)
            }), tap((resData: AuthResponse) => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
            }))
    }

    autoLogin() {
        if(localStorage.userData){
            const userData: {
                email: string, 
                id: string, 
                _token: string, 
                _tokenExpirationDate: string 
            } = JSON.parse(localStorage.getItem('userData'))
            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))
            console.log(loadedUser)
            if(loadedUser.token) {
                this.user.next(loadedUser)
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
                this.autoLogout(expirationDuration)
2            }
        }
        return
    }

    logout() {
        this.user.next(null)
        localStorage.removeItem('userData')
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer)
        }
        this.tokenExpirationTimer = null
        this.router.navigate(['/auth'])
    }

    autoLogout(expirationDuration: number) {
        console.log(expirationDuration)
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout()
        }, expirationDuration)
    }

    private handleAuthentication(email: string, id: string, token, expiresIn: number) {
        const expipirationDate = new Date(new Date().getTime() + expiresIn*1000)
        const user = new User(email, id, token, expipirationDate)
        this.user.next(user)
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(user))
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred';
        if (!errorRes.error || !errorRes.error.error) {
            return errorMessage
        }
        switch(errorRes.error.error.errors[0].message){
            case 'EMAIL_EXISTS': 
            errorMessage = 'The email address is already in use by another account.';
            break;
            case 'OPERATION_NOT_ALLOWED': 
            errorMessage = 'Password sign-in is disabled for this project.';
            break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER': 
            errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
            break;
            case 'INVALID_LOGIN_CREDENTIALS': 
            errorMessage = 'The password is invalid or the user does not have a password.';
            break;
            case 'INVALID_LOGIN_CREDENTIALS': 
            errorMessage = 'The password is invalid or the user does not have a password.';
            break;
            case 'USER_DISABLED': 
            errorMessage = 'The user account has been disabled by an administrator.';
            break;
        }
        return throwError(errorMessage)
    }
}