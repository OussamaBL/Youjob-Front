import { Component, OnInit } from '@angular/core';
import { Annonce } from '../../models/annonce.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AnnonceService } from '../../services/annonce/annonce.service';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-announce-list',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    ReactiveFormsModule,
    NgForOf,
    RouterLink,
    NgClass,
    NgIf,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './announce-list-component.component.html',
  styleUrls: ['./announce-list-component.component.css'] // Fixed 'styleUrl' typo
})
export class AnnounceListComponent implements OnInit {
  announces: Annonce[] = [];
  categories: string[] = ['Plumbing', 'Electricity', 'Carpentry', 'Painting'];
  locations: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston'];

  selectedCategory = new FormControl('');
  selectedLocation = new FormControl('');

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalItems = 0;

  constructor(private announceService: AnnonceService) {}

  ngOnInit(): void {
    this.fetchAnnounces();

    this.selectedCategory.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.filterAnnounces();
    });

    this.selectedLocation.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.filterAnnounces();
    });
  }

  fetchAnnounces() {
    this.announceService.fetchDisposedAnnounce(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.announces = response.content;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalElements || response.content.length * response.totalPages;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load announcements.',
        });
      }
    });
  }

  filterAnnounces() {
    const category = this.selectedCategory?.value || null;
    const location = this.selectedLocation?.value || null;

    this.announceService.fetchFilterCategoryLocationAnnounce(category, location, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          if (response?.content) {
            this.announces = response.content;
            this.totalPages = response.totalPages;
            this.totalItems = response.totalElements || response.content.length * response.totalPages;
          } else {
            this.announces = [];
            this.totalPages = 0;
            this.totalItems = 0;
          }
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to filter announcements.',
          });
        }
      });
  }

  changePage(step: number) {
    const newPage = this.currentPage + step;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.filterAnnounces();
    }
  }

  getPaginationRange(): (number | string)[] {
    const range: (number | string)[] = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    range.push(1);

    if (currentPage > 4) {
      range.push('...');
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (currentPage < totalPages - 3) {
      range.push('...');
    }

    range.push(totalPages);

    return range;
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterAnnounces();
    }
  }

  resetFilters(): void {
    this.selectedCategory.setValue('');
    this.selectedLocation.setValue('');
    this.currentPage = 1;
    this.filterAnnounces();
  }

  protected readonly Math = Math;
}
