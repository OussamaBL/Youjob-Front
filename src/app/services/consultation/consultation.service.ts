import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {PaginatedResponse} from "../../models/PaginatedResponse.model";
import {Annonce} from "../../models/annonce.model";
import {Consultation} from "../../models/consultation.model";

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

  fetchConsultations(announceID: string | null, page: number, size: number): Observable<PaginatedResponse<Consultation>> {
    return this.http.get<PaginatedResponse<Consultation>>(`${this.apiUrl}/ResponderAnnonce/${announceID}?page=${page}&size=${size}`);
  }
  approveConsultation(consultationID:number){
    return this.http.post<void>(`${this.apiUrl}/approve/${consultationID}`,{responseType: 'json'}).pipe(
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
  rejectConsultation(consultationID:number){
    return this.http.post<void>(`${this.apiUrl}/reject/${consultationID}`,{responseType: 'json'}).pipe(
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
  deleteConsultation(consultationID:number){
    return this.http.delete<void>(`${this.apiUrl}/delete/${consultationID}`,{responseType: 'json'}).pipe(
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

  fetchMesConsultations(userID: number | null, page: number, size: number): Observable<PaginatedResponse<Consultation>> {
    return this.http.get<PaginatedResponse<Consultation>>(`${this.apiUrl}/annonceResponder/${userID}?page=${page}&size=${size}`);
  }
}
