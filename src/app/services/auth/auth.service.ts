import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, catchError, map, throwError, switchMap} from 'rxjs';
import {jwtDecode} from "jwt-decode";
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  http=inject(HttpClient);
  errorMessage="";

  constructor() {}

  signup(user: any): Observable<any> {
    console.log(user);
    return this.http.post<any>(this.apiUrl +"/register" , user,{ responseType: 'json' }).pipe(
      map(response => {
        this.storeUserInfo(response);
        return response;
      }),
      catchError(error => {
        let errorMessage = 'An error occurred. Please try again.';
        if (error.error) {
          try {
            const errorObj = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
            errorMessage = errorObj.error || errorMessage;
          } catch (e) {
            console.error('Error parsing response:', e);
          }
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  login(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/login", user, { responseType: 'json'}).pipe(
      map(response => {
        this.storeUserInfo(response);
        return response;
      }),
      catchError(error => {
        let errorMessage = 'An error occurred. Please try again.';

        // Check if it's a validation error (400 status)
        if (error.status === 400 && error.error) {
          if (typeof error.error === 'object') {
            // Loop through validation errors and join them into a string
            errorMessage = Object.values(error.error).join('\n');
          }
        } else if (error.error) {
          try {
            errorMessage = typeof error.error === 'string' ? JSON.parse(error.error).error : error.error.error;
          } catch (e) {
            console.error('Error parsing response:', e);
          }
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  forgetPassword(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl +"/password/forgot" , user,{ responseType: 'text' as 'json' }).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        let errorMessage = 'An error occurred. Please try again.';
        if (error.error) {
          try {
            const errorObj = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
            errorMessage = errorObj.error || errorMessage;
          } catch (e) {
            console.error('Error parsing response:', e);
          }
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  resetPassword(ResetPassword: any): Observable<any> {
    return this.http.post<any>(this.apiUrl +"/password/reset" , ResetPassword,{ responseType: 'text' as 'json' }).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        let errorMessage = 'An error occurred. Please try again.';
        if (error.error) {
          try {
            const errorObj = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
            errorMessage = errorObj.error || errorMessage;
          } catch (e) {
            console.error('Error parsing response:', e);
          }
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private storeUserInfo(token: any): void {
    localStorage.setItem('tokenUser', JSON.stringify( token ));
    localStorage.setItem('isAuthenticated', 'true');
  }

  logout(): void {
    localStorage.removeItem('tokenUser');
    localStorage.removeItem('isAuthenticated');
  }
  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  getToken(): string | null {
    const tokenData = localStorage.getItem('tokenUser');
    return tokenData ? JSON.parse(tokenData).token : null;
  }
  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.username; // Extract the username
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
      }
    }
    return null;
  }
  getUserData(): Observable<User> {
    const username = this.getUsernameFromToken();
    if (username) {
      return this.http.get<User>(`http://localhost:8081/api/user/fetch/${username}`).pipe(
        map(response => {
          return response;
        }),
        catchError(error => {
          let errorMessage = 'An error occurred. Please try again.';
          if (error.status === 400 && error.error) {
            if (typeof error.error === 'object') {
              errorMessage = Object.values(error.error).join('\n');
            }
          } else if (error.error) {
            try {
              errorMessage = typeof error.error === 'string' ? JSON.parse(error.error).error : error.error.error;
            } catch (e) {
              console.error('Error parsing response:', e);
            }
          }
          return throwError(() => new Error(errorMessage));
        })
      );
    }
    return throwError(() => new Error('User not authenticated or token is invalid.'));
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8081/api/user/profile/${user.id}`, user, { responseType: 'json'}).pipe(
          map(response => {
            return response;
          }),
          catchError(error => {
            let errorMessage = 'An error occurred. Please try again.';
            if (error.status === 400 && error.error) {
              if (typeof error.error === 'object') {
                errorMessage = Object.values(error.error).join('\n');
              }
            } else if (error.error) {
              try {
                errorMessage = typeof error.error === 'string' ? JSON.parse(error.error).error : error.error.error;
              } catch (e) {
                console.error('Error parsing response:', e);
              }
            }
            return throwError(() => new Error(errorMessage));
          })
        );


  }

}
