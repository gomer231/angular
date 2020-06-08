import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user): Observable<User> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
    .pipe(
      tap(this.setToken)
    );
  }

  private setToken(response): void {
    if (response) {
      const expData = new Date( new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fb-token-exp', expData.toString());
      localStorage.setItem('fb-token', response.idToken);
    } else {
      localStorage.clear();
    }
  }

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    const now = new Date();
    if (now > expDate){
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  logout(): void {
    this.setToken(null);
  }

  isAuthenicated(): boolean {
    return !!this.token;
  }
}
