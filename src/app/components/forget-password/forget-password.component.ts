import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {AuthService} from "../../services/auth/auth.service";
import Swal from "sweetalert2";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent, NgIf],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  forgetpasswordForm: FormGroup;
  errorMessage:string="";

  constructor(private fb: FormBuilder,private router:Router,private authService:AuthService) {
    this.forgetpasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  onSend(): void {
    if (this.forgetpasswordForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form.';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: this.errorMessage,
      });
      return;
    }

    const user = this.forgetpasswordForm.value;

    this.authService.forgetPassword(user).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response,
          confirmButtonText: 'OK'
        });
        this.forgetpasswordForm.reset();
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
