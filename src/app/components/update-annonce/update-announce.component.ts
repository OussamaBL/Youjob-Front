import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AnnonceService} from "../../services/annonce/annonce.service";
import {Annonce} from "../../models/annonce.model";
import Swal from "sweetalert2";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-update-annonce',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './update-announce.component.html',
  styleUrl: './update-announce.component.css'
})
export class UpdateAnnounceComponent implements OnInit{
  announceForm!: FormGroup;
  announceId!: string | null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private announceService: AnnonceService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form with default values
    this.announceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      location: [''],
    });

    this.announceId = this.route.snapshot.paramMap.get('id');
    if (this.announceId) {
      this.announceService.getAnnounceById(this.announceId).subscribe({
        next: (announce: Annonce) => {
          this.announceForm.patchValue({
            title: announce.title,
            description: announce.description,
            category: announce.category,
            price: announce.price,
            location: announce.location,
          });
        },
        error: (err) => {
          this.errorMessage = 'Error fetching annonce details.';
          Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: this.errorMessage,
          });
        }
      });
    }
  }

  updateAnnounce(): void {
    if (this.announceForm.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please fill out all required fields correctly.',
      });
      return;
    }

    this.loading = true;
    const updatedAnnounce = this.announceForm.value;
    this.announceService.updateAnnounce(this.announceId, updatedAnnounce).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Announce Created',
          text: 'Your announce has been successfully created!',
        }).then(() => this.router.navigate(['/announce']));
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Error updating annonce.',
        });
      }
    });
  }
}
