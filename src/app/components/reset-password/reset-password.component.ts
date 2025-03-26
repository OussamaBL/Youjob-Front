import { Component } from '@angular/core';
import {FooterComponent} from "../layout/footer/footer.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {NgClass, NgIf} from "@angular/common";
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
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  newPasswordForm!: FormGroup;
  errorMessage:string="";
  token="";

  // Add these properties for the new functionality
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
  showPassword = {
    password: false,
    confirmPassword: false
  };

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private route: ActivatedRoute) {}

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

    // Add listener for password changes to calculate strength
    this.newPasswordForm.get('password')?.valueChanges.subscribe(password => {
      this.calculatePasswordStrength(password);
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Add this method to toggle password visibility
  togglePasswordVisibility(field: string): void {
    if (field === 'password' || field === 'confirmPassword') {
      this.showPassword[field as keyof typeof this.showPassword] = !this.showPassword[field as keyof typeof this.showPassword];
    }
  }

  // Add this method to calculate password strength
  calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 'weak';
      return;
    }

    // Calculate password strength
    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Complexity checks
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Determine strength based on score
    if (score < 3) {
      this.passwordStrength = 'weak';
    } else if (score < 5) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
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
