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
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";


@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    RouterLink,
    NavbarComponent,
    FooterComponent
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

  totalItems: number = 0;
  totalConsultations: number = 0;
  approvedCount: number = 0;
  pendingCount: number = 0;
  displayedRangeStart: number = 0;
  displayedRangeEnd: number = 0;
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
  calculateCounts() {
    if (!this.consultations) {
      this.totalConsultations = 0;
      this.approvedCount = 0;
      this.pendingCount = 0;
      return;
    }

    this.totalConsultations = this.consultations.length;
    this.approvedCount = this.consultations.filter(c => c.accepted === true).length;
    this.pendingCount = this.consultations.filter(c => c.accepted === null).length;
  }

  calculateDisplayedRange() {
    if (!this.consultations || this.consultations.length === 0) {
      this.displayedRangeStart = 0;
      this.displayedRangeEnd = 0;
      return;
    }

    const pageSize = 10; // Adjust based on your actual page size
    this.displayedRangeStart = this.page * pageSize + 1;
    this.displayedRangeEnd = Math.min((this.page + 1) * pageSize, this.totalItems || this.totalConsultations);
  }
  fetchConsultation(): void {
    this.loading = true;
    this.consultationService.fetchConsultations(this.announceId, this.page, this.size).subscribe({
      next: (data) => {
        this.consultations = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.totalItems = data.totalElements;

        this.calculateCounts();
        this.calculateDisplayedRange();
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

  protected readonly length = length;
}
