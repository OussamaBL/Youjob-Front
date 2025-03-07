import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {Annonce} from "../../models/annonce.model";
import {PaginatedResponse} from "../../models/PaginatedResponse.model";

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {
  private apiUrl = 'http://localhost:8081/api/annonce';
  http=inject(HttpClient);
  errorMessage="";
  constructor() { }


  create(announce: Annonce): Observable<any> {
    return this.http.post<any>(this.apiUrl +"/create" , announce,{ responseType: 'json' }).pipe(
      map(response => {
        /*this.storeUserInfo(response);*/
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

  fetchAnnounces(userId: number | null, page: number, size: number): Observable<PaginatedResponse<Annonce>> {
    return this.http.get<PaginatedResponse<Annonce>>(`${this.apiUrl}/AnnonceUser/${userId}?page=${page}&size=${size}`);
  }
  deleteAnnonce(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

}
