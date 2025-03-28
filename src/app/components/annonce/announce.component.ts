import {Component, OnInit} from '@angular/core';
import {Annonce} from "../../models/annonce.model";
import {AnnonceService} from "../../services/annonce/annonce.service";
import Sal from "sweetalert2";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Router,RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-announce',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    NgForOf,
    NgIf,
    DatePipe,
    NgClass,
    RouterModule
  ],
  templateUrl: './announce.component.html',
  styleUrl: './announce.component.css'
})
export class AnnounceComponent implements OnInit{
  announces: Annonce[] = [];
  totalPages = 0;
  totalElements = 0;
  page = 0;
  size = 5;
  userId: number | null = null;
  loading: boolean = false; // Add a loading state

  constructor(private announceService: AnnonceService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getId().subscribe((id) => {
      if (id) {
        this.userId = id;
        this.fetchAnnounces();
      } else {
        Sal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You must be logged in to view announces.',
        });
      }
    });
  }

  fetchAnnounces(): void {
    this.loading = true; // Set loading to true when fetching data
    this.announceService.fetchAnnounces(this.userId, this.page, this.size).subscribe({
      next: (data) => {
        this.announces = data.content;
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
  deleteAnnounce(id: number): void {
    Sal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this annonce?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(id);
        this.announceService.deleteAnnounce(id).subscribe({
          next: () => {
            Sal.fire('Deleted!', 'Your annonce has been deleted.', 'success');
            this.fetchAnnounces();
          },
          error: (err) => {
            Sal.fire('Error', 'There was an issue deleting the annonce.'+err.message, 'error');
          },
        });
      }
    });
  }
  getPageNumbers(): Array<{ type: 'number' | 'ellipsis', value: number | string }> {
    const pageNumbers: Array<{ type: 'number' | 'ellipsis', value: number | string }> = [];
    const totalVisiblePages = 5;

    if (this.totalPages <= totalVisiblePages) {
      // Show all pages if there are few pages
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push({ type: 'number', value: i });
      }
    } else {
      // Always show first page
      pageNumbers.push({ type: 'number', value: 1 });

      // Calculate start and end of visible pages
      let startPage = Math.max(2, this.page - 1);
      let endPage = Math.min(this.totalPages - 1, startPage + totalVisiblePages - 3);

      // Adjust if we're near the end
      if (endPage - startPage < totalVisiblePages - 3) {
        startPage = Math.max(2, this.totalPages - totalVisiblePages + 2);
      }

      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pageNumbers.push({ type: 'ellipsis', value: '...' });
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push({ type: 'number', value: i });
      }

      // Add ellipsis if needed after middle pages
      if (endPage < this.totalPages - 1) {
        pageNumbers.push({ type: 'ellipsis', value: '...' });
      }

      // Always show last page
      pageNumbers.push({ type: 'number', value: this.totalPages });
    }

    return pageNumbers;
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber < this.totalPages) {
      this.page = pageNumber;
      // Call your method to load data for this page
      // this.loadAnnounces();
    }
  }
  get activeAnnouncesCount(): number {
    return this.announces ? this.announces.filter(a => a.status === 'ACTIVE').length : 0;
  }

  protected readonly Math = Math;
}
