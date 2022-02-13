import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private userId: string;
  private isUserAuthenticated = false;
  private authStatusListner = new Subject<boolean>();
  private tokenTImer: any;
  constructor(private httpClient: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }
  getUserId() {
    return this.userId;
  }
  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }
  getUserAuthStatus() {
    return this.isUserAuthenticated;
  }
  createUser(email: string, password: string) {
    const data: AuthData = {
      email: email,
      password: password,
    };
    return this.httpClient.post(BACKEND_URL + '/signup', data);
  }
  userLogin(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.httpClient
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>(BACKEND_URL + '/login', authData)
      .subscribe(
        (res) => {
          if (res.message === 'Login Successful!') {
            this.token = res.token;
            if (this.token) {
              this.userId = res.userId;
              const tokenexpiryDuartion = res.expiresIn;
              this.setAuthTimer(tokenexpiryDuartion);
              this.isUserAuthenticated = true;
              this.authStatusListner.next(true);
              const now = new Date();
              const expirationDate = new Date(
                now.getTime() + tokenexpiryDuartion * 1000
              );
              this.saveAuthData(this.token, expirationDate, res.userId);
              this.router.navigate(['/']);
            }
          }
        },
        (error) => {
          this.authStatusListner.next(false);
        }
      );
  }

  logoutUser() {
    this.token = null;
    this.userId = null;
    this.isUserAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTImer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (authInfo) {
      const now = new Date();
      const tokenExpiresIn = authInfo.expirationDate.getTime() - now.getTime(); // difference in milliseconds
      if (tokenExpiresIn > 0) {
        this.token = authInfo.token;
        this.userId = authInfo.userId;
        this.isUserAuthenticated = true;
        this.authStatusListner.next(true);
        this.setAuthTimer(tokenExpiresIn / 1000);
      }
    } else {
      return;
    }
  }
  private setAuthTimer(duration: number) {
    this.tokenTImer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }
  private saveAuthData(token: string, tokenExpiryDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiryDate', tokenExpiryDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiryDate');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const tokenExpiryDate = localStorage.getItem('expiryDate');
    const userId = localStorage.getItem('userId');
    if (!token || !tokenExpiryDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(tokenExpiryDate),
      userId,
    };
  }
}
