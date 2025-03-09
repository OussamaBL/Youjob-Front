import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AnnonceService } from '../../services/annonce/annonce.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../reset-password/user.model";

@Component({
  selector: 'app-create-annonce',
  standalone: true,
  templateUrl: './create-announce.component.html',
  imports: [
    NavbarComponent,
    FooterComponent,
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./create-announce.component.css']
})
export class CreateAnnounceComponent implements OnInit{
  announceForm: FormGroup;
  isLoading = false;
  user_id: number | null = null;
  constructor(
    private fb: FormBuilder,
    private announceService: AnnonceService,
    private authService: AuthService,
    private router: Router
  ) {
    this.announceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      location: [''],
    });
  }

  ngOnInit(): void {
    this.authService.getUserData().subscribe((data) => {
      this.user_id = data.id;
    });
  }

  submitAnnounce() {
    if (this.announceForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please fill out all required fields correctly.',
      });
      return;
    }

    this.isLoading = true;
    const newAnnounce = { ...this.announceForm.value, user_id: this.user_id };

    this.announceService.create(newAnnounce).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Annonce Created',
          text: 'Your annonce has been successfully created!',
        }).then(() => this.router.navigate(['/announce']));
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Failed to create annonce.',
        });
      }
    });
  }
}
