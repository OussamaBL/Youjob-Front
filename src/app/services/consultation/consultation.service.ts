import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private apiUrl = 'http://localhost:8081/api/consultation';
  http=inject(HttpClient);
  errorMessage="";
  constructor() { }

  consultAnnounce(annonce_id: number, id_user: number, message: string) {
    const consultation = {
      annonce_id: annonce_id,
      user_id: id_user,
      message: message
    };
    return this.http.post<void>(`${this.apiUrl}/create`, consultation,{responseType: 'json'}).pipe(
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
