import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8081/api/project';
  http=inject(HttpClient);
  errorMessage="";
  constructor() { }

  confirmProject(projectID:number){
    return this.http.post<void>(`${this.apiUrl}/confirm/${projectID}`,{responseType: 'json'}).pipe(
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
  completeProject(projectID:number){
    return this.http.post<void>(`${this.apiUrl}/complete/${projectID}`,{responseType: 'json'}).pipe(
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
  deleteProject(projectID:number){
    return this.http.delete<void>(`${this.apiUrl}/delete/${projectID}`,{responseType: 'json'}).pipe(
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

}
