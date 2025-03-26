import {Component, OnInit} from '@angular/core';
import {Annonce} from "../../models/annonce.model";
import {AnnonceService} from "../../services/annonce/annonce.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import Sal from "sweetalert2";
import {Consultation} from "../../models/consultation.model";
import {ConsultationService} from "../../services/consultation/consultation.service";
import Swal from "sweetalert2";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FooterComponent} from "../layout/footer/footer.component";
import {NavbarComponent} from "../layout/navbar/navbar.component";

@Component({
  selector: 'app-mes-consultation',
  standalone: true,
  imports: [
    DatePipe,
    FooterComponent,
    NavbarComponent,
    NgForOf,
    NgIf,
    RouterLink,
    NgClass
  ],
  templateUrl: './mes-consultation.component.html',
  styleUrl: './mes-consultation.component.css'
})
export class MesConsultationComponent implements OnInit{
  consultations: Consultation[] = [];
  userId: number | null = null;
  totalPages = 0;
  totalElements = 0;
  page = 0;
  size = 5;
  loading: boolean = false;
  errorMessage = '';
  pendingCount: number = 0;
  acceptedCount: number = 0;
  rejectedCount: number = 0;

  constructor(private route: ActivatedRoute,private announceService: AnnonceService,private consultationService :ConsultationService, private router: Router, private authService: AuthService) {}

updateCounts() {
  if (!this.consultations) {
    this.pendingCount = 0;
    this.acceptedCount = 0;
    this.rejectedCount = 0;
    return;
  }

  this.pendingCount = this.consultations.filter(c => c.accepted === null).length;
  this.acceptedCount = this.consultations.filter(c => c.accepted === true).length;
  this.rejectedCount = this.consultations.filter(c => c.accepted === false).length;
}

  ngOnInit(): void {
    this.authService.getId().subscribe((id) => {
      if (id) {
        this.userId = id;
        this.fetchConsultation();
      } else {
        Sal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You must be logged in to view announces.',
        });
      }
    });
  }
  fetchConsultation(): void {
    this.loading = true;
    this.consultationService.fetchMesConsultations(this.userId, this.page, this.size).subscribe({
      next: (data) => {
        this.consultations = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.updateCounts();
        this.loading = false;
      },
      error: (err) => {
        Sal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.fetchConsultation();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.fetchConsultation();
    }
  }

  deleteConsultation(consultationID:number):void{
    Sal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Delete this consultation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.consultationService.deleteConsultation(consultationID).subscribe({
          next: () => {
            Sal.fire('Deleted!', 'Your announce has been deleted.', 'success');
            this.fetchConsultation();
          },
          error: (err) => {
            Sal.fire('Error', err.message, 'error');
          },
        });
      }
    });
  }

  protected readonly length = length;
  protected readonly Math = Math;
}
