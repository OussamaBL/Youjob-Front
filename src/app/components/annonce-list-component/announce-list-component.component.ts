import {Component, OnInit} from '@angular/core';
import {Annonce} from "../../models/annonce.model";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AnnonceService} from "../../services/annonce/annonce.service";
import Swal from "sweetalert2";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-announce-list-component',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    ReactiveFormsModule,
    NgForOf,
    RouterLink
  ],
  templateUrl: './announce-list-component.component.html',
  styleUrl: './announce-list-component.component.css'
})
export class AnnounceListComponentComponent implements OnInit{
  announces: Annonce[] = [];
  categories: string[] = ['Plumbing', 'Electricity', 'Carpentry', 'Painting'];
  locations: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston'];

  selectedCategory = new FormControl('');
  selectedLocation = new FormControl('');

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(private announceService: AnnonceService) {}

  ngOnInit(): void {
    this.fetchAnnounces();
    this.selectedCategory.valueChanges.subscribe(() => this.filterAnnounces());
    this.selectedLocation.valueChanges.subscribe(() => this.filterAnnounces());
  }

  fetchAnnounces() {
    this.announceService.fetchDisposedAnnounce(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.announces = response.content;
        this.totalPages = response.totalPages;
        console.log(this.announces);
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

    console.log("Filter Request Payload:", { category, location });

    this.announceService.fetchFilterCategoryLocationAnnounce(category, location, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          console.log("API Response:", response);
          console.log("API Content:", response?.content);

          if (response?.content) {
            this.announces = response.content;
            this.totalPages = response.totalPages;
          } else {
            console.warn("No content received!");
            this.announces = [];
          }
        },
        error: (error) => {
          console.error("API Error:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to filter announcements.',
          });
        }
      });
  }


  changePage(step: number) {
    if (this.currentPage + step >= 1 && this.currentPage + step <= this.totalPages) {
      this.currentPage += step;
      this.fetchAnnounces();
    }
  }
}
