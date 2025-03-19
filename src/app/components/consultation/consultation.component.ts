import {Component, OnInit} from '@angular/core';
import {Annonce} from "../../models/annonce.model";
import {AnnonceService} from "../../services/annonce/annonce.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import Sal from "sweetalert2";
import Swal from "sweetalert2";
import {ConsultationService} from "../../services/consultation/consultation.service";
import {Consultation} from "../../models/consultation.model";
import {DatePipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    RouterLink
  ],
  templateUrl: './consultation.component.html',
  styleUrl: './consultation.component.css'
})
export class ConsultationComponent implements OnInit{
  consultations: Consultation[] = [];
  announceId!: string | null;
  announce!: Annonce;
  totalPages = 0;
  totalElements = 0;
  page = 0;
  size = 5;
  loading: boolean = false;
  errorMessage = '';
  constructor(private route: ActivatedRoute,private announceService: AnnonceService,private consultationService :ConsultationService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadAnnounce();
    this.fetchConsultation();
  }

  loadAnnounce() {
    this.route.paramMap.subscribe(params => {
      this.announceId = params.get('id');
      console.log("Announce ID:", this.announceId);

      if (this.announceId) {
        this.announceService.getAnnounceById(this.announceId).subscribe({
          next: (announce: Annonce) => {
            this.announce = announce;
            console.log("Announce Data:", announce);
            this.loading = false;
          },
          error: (err) => {
            this.errorMessage = 'Error fetching announce details.';
            this.loading = false;
            Swal.fire({ icon: 'error', title: 'Error', text: this.errorMessage });
            console.error(err);
          }
        });
      } else {
        this.loading = false;
        this.errorMessage = 'Invalid announce ID.';
        Swal.fire({ icon: 'error', title: 'Error', text: this.errorMessage });
      }
    });
  }

  fetchConsultation(): void {
    this.loading = true;
    this.consultationService.fetchConsultations(this.announceId, this.page, this.size).subscribe({
      next: (data) => {
        this.consultations = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.loading = false; // Set loading to false after data is fetched
      },
      error: (err) => {
        Sal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
        this.loading = false; // Set loading to false in case of error
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
  approveConsultation(consultationID:number):void{
    Sal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this consultation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.consultationService.approveConsultation(consultationID).subscribe({
          next: () => {
            Sal.fire('Approve!', 'Your annonce has been approved.', 'success');
            this.fetchConsultation();
          },
          error: (err) => {
            Sal.fire('Error', err.message, 'error');
          },
        });
      }
    });
  }
  rejectConsultation(consultationID:number):void{
    Sal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Reject this consultation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.consultationService.rejectConsultation(consultationID).subscribe({
          next: () => {
            Sal.fire('Reject!', 'Your announce has been rejected.', 'success');
            this.fetchConsultation();
          },
          error: (err) => {
            Sal.fire('Error', err.message, 'error');
          },
        });
      }
    });
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
}
