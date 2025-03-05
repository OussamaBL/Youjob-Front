import { Component } from '@angular/core';
import {FooterComponent} from "../layout/footer/footer.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FooterComponent,
    FormsModule,
    NavbarComponent,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  newPasswordForm!: FormGroup;
  errorMessage:string="";
  token="";
  constructor(private fb: FormBuilder,private router:Router,private authService:AuthService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.newPasswordForm = this.fb.group({
      password: ['',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        ]
      ],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.newPasswordForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form.';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: this.errorMessage,
      });
      return;
    }

    const ResetPassword = { newPassword:this.newPasswordForm.get('password')?.value, token: this.token };

    this.authService.resetPassword(ResetPassword).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response,
          confirmButtonText: 'OK'
        });
        this.newPasswordForm.reset();
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
