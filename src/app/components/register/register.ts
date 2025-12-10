import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {Router, RouterLink} from '@angular/router';
import {Authservice} from '../../services/authservice';
import {RegisterUser} from '../../models/register-user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true,
})

export class Register {
  registerForm: FormGroup;
  errorMessage= "";

  constructor(private fb: FormBuilder, private _AuthService: Authservice, private router: Router)
  {
    this.registerForm = fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(32)]],
      lastname: ['', [Validators.required, Validators.maxLength(32)]],
      username: ['', [Validators.required, Validators.maxLength(32)]],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required, Validators.maxLength(32)]],
      address: ['', [Validators.required, Validators.maxLength(32)]],
      password: ['', [Validators.required]],
    })
  }

  onSubmit() : void
  {
    if (this.registerForm.valid)
    {
      const User: RegisterUser = {
        firstname: this.registerForm.value.email,
        lastname: this.registerForm.value.lastname,
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        cellphone: this.registerForm.value.cellphone,
        address: this.registerForm.value.address,
        password: this.registerForm.value.password,
        typeUser: 2,
        id: 0,
      }

      this._AuthService.Register(User).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'Se ha registrado con exito el usuario'
          });
          this.router.navigateByUrl('');
        },

        error: (err) =>
        {
          this.errorMessage = err.message;

          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error',
            text: this.errorMessage,
          });
        }
      });
    }
    else
    {
      const errors = this.getFormValidationError();
      Swal.fire({
        title: "el formulario tiene los siguientes errores",
        icon: "error",
        html: errors.join('<br>'),
      });
    }
  }

  getFormValidationError() : string[] {
    const errors: string[] = [];

    Object.keys(this.registerForm.controls).forEach(field => {
      const controlErrors = this.registerForm.get(field)?.errors;

      if (controlErrors)
      {
        Object.keys(controlErrors).forEach(fieldError => {

          switch (fieldError)
          {
            case 'required':
              errors.push(`el campo ${field} es obligatorio`);
              break;

            case 'email':
              errors.push(`el campo ${field} deber ser un email valido`);
              break;

            case "maxlength":
              const requiredLength = controlErrors['maxlength'].requiredLength;
              errors.push(`el campo ${field} no puede tener mas de ${requiredLength} caracteres `);
          }
        });
      }
    });

    return errors;
  }
}
