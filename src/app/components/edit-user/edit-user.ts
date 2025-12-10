import { Component } from '@angular/core';
import {MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {RegisterUser} from '../../models/register-user';
import {MatButtonModule} from '@angular/material/button';
import {Authservice} from '../../services/authservice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
  ],
  standalone: true,
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser {

  editForm: FormGroup;
  UserId = 0;
  messageError = "";

  constructor(public dialogRef: MatDialogRef<EditUser>, public _authService: Authservice, private fb: FormBuilder)
  {
    this.editForm = fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(32)]],
      lastname: ['', [Validators.required, Validators.maxLength(32)]],
      username: ['', [Validators.required, Validators.maxLength(32)]],
      cellphone: ['', [Validators.required, Validators.maxLength(32)]],
      address: ['', [Validators.required, Validators.maxLength(32)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
    })
  }

  ngOnInit() {
    this.UserId = Number(this._authService.getUserId());
    this.searchUser();
  }

  searchUser(): void {
    this._authService.GetUserId(this.UserId).subscribe({
      next:(resp) => {
        this.editForm.setValue({
          firstname: resp.firstname,
          lastname: resp.lastname,
          username: resp.username,
          cellphone: resp.cellphone,
          address: resp.address,
          email: resp.email,
          password: ""
        });
      },
      error: (err) => {
        this.messageError = err.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.messageError
        });
      }
    });
  }

  updateUser(): void {

    if (this.editForm.valid)
    {
      const user : RegisterUser = {
        firstname: this.editForm.value.firstname,
        lastname: this.editForm.value.lastname,
        email: this.editForm.value.email,
        address: this.editForm.value.address,
        cellphone: this.editForm.value.cellphone,
        username: this.editForm.value.username,
        password: this.editForm.value.password != '' ? this.editForm.value.password : '',
        id: 0,
        typeUser: 0,
      }

      this._authService.UpdateUser(this.UserId, user).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'El usuario ha sido actualizado con exito'
          });

          this.dialogRef.close();
        },
        error: (err) =>
        {
          this.messageError = err.message;
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error',
            text: this.messageError
          })
        }
      })
    }
    else
    {
      const errors = this.getValidationErrors();
      Swal.fire({
        icon: 'error',
        title: 'El formulario tiene los siguientes errores',
        html: errors.join('<br>'),
      })
    }
  }

  getValidationErrors(): string[] {
    const Errors: string[] = [];

    Object.keys(this.editForm.controls).forEach(field => {

      const controlErrors = this.editForm.get(field)?.errors;

      if (controlErrors)
      {
        Object.keys(controlErrors).forEach(fieldError => {

          switch (fieldError)
          {
            case 'required':
              Errors.push(`el campo ${field} es obligatorio`);
              break;

            case 'email':
              Errors.push(`el campo ${field} debe ser un email valido`);
              break;

            case 'maxlength':
              const requiredLength = controlErrors[fieldError].requiredLength;
              Errors.push(`El campo ${field} no debe tener mas de ${requiredLength} caracteres`);
          }
        });
      }
    });

    return Errors;
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
