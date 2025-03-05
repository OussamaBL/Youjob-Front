import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {AuthService} from "../../services/auth/auth.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  selectedRole: string = 'CUSTOMER';
  errorMessage:string="";
  constructor(private fb: FormBuilder,private router:Router,private authService:AuthService) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      vatNumber: [''],
      skills: [''],
    });
  }

  setRole(role: string) {
    this.selectedRole = role;
  }

  onSignup(): void {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form.';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: this.errorMessage,
      });
      return;
    }

    const user = { ...this.signupForm.value, role: this.selectedRole };

    this.authService.signup(user).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Register successfully.',
          confirmButtonText: 'OK'
        });
        this.signupForm.reset();
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      }
    });
  }

}
