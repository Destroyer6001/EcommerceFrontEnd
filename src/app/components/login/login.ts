import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {Router, RouterLink} from '@angular/router';
import {Authservice} from '../../services/authservice';
import {LoginRequest} from '../../models/login-request';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NgOptimizedImage,
    RouterLink,
  ],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm: FormGroup;
  errorMessage =  "";
  imgSrc = "https://th.bing.com/th/id/R.8e2c571ff125b3531705198a15d3103c?rik=gzhbzBpXBa%2bxMA&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fuser-png-icon-big-image-png-2240.png&ehk=VeWsrun%2fvDy5QDv2Z6Xm8XnIMXyeaz2fhR3AgxlvxAc%3d&risl=&pid=ImgRaw&r=0";


  constructor(private fb: FormBuilder, private _AuthService: Authservice, private router: Router)
  {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  onSubmit() : void {
    if (this.loginForm.valid) {
      const UserLogin: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      }

      this._AuthService.Login(UserLogin).subscribe({
        next: () => {
          this.router.navigateByUrl('/home');
        },
        error: (err) => {
          this.errorMessage = err.message;
          swal.fire({
            title: "¡Error!",
            icon:"error", text:
            this.errorMessage
          });
        }
      });
    }
    else
    {
      const errorMessage = this.getFormValidationErrors();
      swal.fire({
        icon: 'error',
        title: 'El formulario tiene los siguientes errores',
        html: errorMessage.join('<br>'),
      })
    }
  }

  getFormValidationErrors(): string[] {
    const errors: string[] = [];

    Object.keys(this.loginForm.controls).forEach(field => {
      const controlErrors = this.loginForm.get(field)?.errors;
      if (controlErrors)
      {
        Object.keys(controlErrors).forEach(fieldError =>
        {
          switch (fieldError)
          {
            case 'required':
              errors.push(`${field} es obligatorio`);
              break;
            case 'email':
              errors.push(`${field} debe ser un email valido`);
          }
        });
      }
    });

    return errors;
  }

  get f() {
    return this.loginForm.controls;
  }
}
