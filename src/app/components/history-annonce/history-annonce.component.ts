import { Component } from '@angular/core';
import {Annonce} from "../../models/annonce.model";
import {AnnonceService} from "../../services/annonce/annonce.service";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import Sal from "sweetalert2";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FooterComponent} from "../layout/footer/footer.component";
import {NavbarComponent} from "../layout/navbar/navbar.component";

@Component({
  selector: 'app-history-annonce',
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
  templateUrl: './history-annonce.component.html',
  styleUrl: './history-annonce.component.css'
})
export class HistoryAnnounceComponent {
  announces: Annonce[] = [];
  totalPages = 0;
  totalElements = 0;
  page = 0;
  size = 5;
  userId: number | null = null;
  loading: boolean = false;

  constructor(private announceService: AnnonceService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getId().subscribe((id) => {
      if (id) {
        this.userId = id;
        this.fetchHistoryAnnounce();
      } else {
        Sal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You must be logged in to view announces.',
        });
      }
    });
  }

  fetchHistoryAnnounce(): void {
    this.loading = true;
    this.announceService.fetchHistoryAnnounce(this.userId, this.page, this.size).subscribe({
      next: (data) => {
        this.announces = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
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
      this.fetchHistoryAnnounce();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.fetchHistoryAnnounce();
    }
  }

  protected readonly Math = Math;
}
