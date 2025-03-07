import { Component } from '@angular/core';
import {Annonce} from "../../models/annonce.model";
import {AnnonceService} from "../../services/annonce/annonce.service";
import Swal from "sweetalert2";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-annonce',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './annonce.component.html',
  styleUrl: './annonce.component.css'
})
export class AnnonceComponent {
  annonces: Annonce[] = [];
  totalPages = 0;
  totalElements = 0;
  page = 0;
  size = 5;
  userId: number | null = null;
  loading: boolean = false; // Add a loading state

  constructor(private annonceService: AnnonceService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getId().subscribe((id) => {
      if (id) {
        this.userId = id;
        this.fetchAnnounces();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You must be logged in to view annonces.',
        });
      }
    });
  }

  fetchAnnounces(): void {
    this.loading = true; // Set loading to true when fetching data
    this.annonceService.fetchAnnounces(this.userId, this.page, this.size).subscribe({
      next: (data) => {
        this.annonces = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.loading = false; // Set loading to false after data is fetched
      },
      error: (err) => {
        Swal.fire({
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
      this.fetchAnnounces();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.fetchAnnounces();
    }
  }

  // Add a deleteAnnonce method
  deleteAnnonce(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this annonce?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.annonceService.deleteAnnonce(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Your annonce has been deleted.', 'success');
            this.fetchAnnounces();
          },
          error: (err) => {
            Swal.fire('Error', 'There was an issue deleting the annonce.', 'error');
          },
        });
      }
    });
  }
}
