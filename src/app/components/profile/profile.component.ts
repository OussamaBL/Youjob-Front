import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {AuthService} from "../../services/auth/auth.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import Swal from "sweetalert2";
import {NgIf} from "@angular/common";
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profileForm:FormGroup;
  errorMessage:string="";
  user: User | null = null;

  constructor(private fb: FormBuilder,private router:Router,private authService:AuthService) {
    this.profileForm = this.fb.group({
      email: [this.user?.email, [Validators.required, Validators.email]],
      /*password: ['', [Validators.required, Validators.minLength(6)]],*/
      username: [this.user?.username, [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      name: [this.user?.name, [Validators.required]],
      address: [this.user?.address, [Validators.required]],
      phoneNumber: [this.user?.phoneNumber, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      vatNumber: [this.user?.vatNumber],
      skills: [this.user?.skills],
    });
  }

  ngOnInit(): void {
    this.authService.getUserData().subscribe((data) => {
      this.user = data;

      // Initialize form with user data
      this.profileForm = this.fb.group({
        email: [this.user.email, [Validators.required, Validators.email]],
        username: [this.user.username, Validators.required],
        name: [this.user.name, Validators.required],
        address: [this.user.address],
        phoneNumber: [this.user.phoneNumber],
        vatNumber: [this.user.vatNumber],
        skills: [this.user.skills],

      });

      this.profileForm.valueChanges.subscribe(updatedValues => {
        this.user = { ...this.user, ...updatedValues };
      });
    });
  }

  onProfile(): void {
    if (this.profileForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please correct the errors in the form.'
      });
      return;
    }
    this.authService.updateUser(this.user).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile updated successfully.'
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
        });
      }
    });
  }


}
