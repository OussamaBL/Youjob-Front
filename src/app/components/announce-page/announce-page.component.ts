import {Component, OnInit} from '@angular/core';
import {Annonce} from "../../models/annonce.model";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AnnonceService} from "../../services/annonce/annonce.service";
import Swal from "sweetalert2";
import {NgClass, NgIf} from "@angular/common";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {User} from "../../models/User.model";
import {AuthService} from "../../services/auth/auth.service";
import {ConsultationService} from "../../services/consultation/consultation.service";

@Component({
  selector: 'app-announce-page',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './announce-page.component.html',
  styleUrl: './announce-page.component.css'
})
export class AnnouncePageComponent implements OnInit{
  announceId!: string | null;
  announce!: Annonce;
  user: User | null = null;

  loading = true;
  errorMessage = '';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private announceService: AnnonceService,
    private consultationService: ConsultationService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Fetch announcement details immediately
    this.loadAnnounce();

    // Check if user is authenticated
    this.authService.getUserData().subscribe({
      next: (data) => {
        this.user = { ...data, phoneNumber: data.phoneNumber ?? '' };
      },
      error: () => {
        this.user = null; // User is not authenticated, but continue
      }
    });
  }


// Separate function to fetch the announcement
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


  openConsultPopup() {
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.user.role !== 'HANDYMAN') {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'You should be a handyman to consult an announce.',
      });
      return;
    }

    // Open SweetAlert popup for message input
    Swal.fire({
      title: 'Enter your message',
      input: 'text',
      inputPlaceholder: 'Type your message here...',
      inputValidator: (value) => {
        if (!value) {
          return 'Message is required!';
        }
        return undefined; // Ensures all code paths return a value
      },
      showCancelButton: true,
      confirmButtonText: 'Consult'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.consultAnnounce(result.value); // Pass the message to consultAnnounce
      }
    });
  }

  consultAnnounce(message: string) {
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.user.role !== 'HANDYMAN') {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'You should be a handyman to consult an announce.',
      });
      return;
    }

    this.consultationService.consultAnnounce(this.announce.id,this.user.id,message).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Consultation Successful',
          text: 'You have successfully consulted this announce.',
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message,
        });
      }
    });
  }
}
