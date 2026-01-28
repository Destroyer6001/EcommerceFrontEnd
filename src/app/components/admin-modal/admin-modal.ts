import {Component, inject} from '@angular/core';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {Authservice} from '../../services/authservice';
import Swal from 'sweetalert2';
import {RegisterUser} from '../../models/register-user';

@Component({
  selector: 'app-admin-modal',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  standalone: true,
  templateUrl: './admin-modal.html',
  styleUrl: './admin-modal.css',

})
export class AdminModal {

  formUser: FormGroup;
  messageError: string = '';
  isEdit = false;
  title= 'Crear';
  data = inject<any>(MAT_DIALOG_DATA);
  id: number;
  userType: number;

  constructor(private _authServices: Authservice, private dialogRef: MatDialogRef<AdminModal>, private fb: FormBuilder) {

    this.formUser = fb.group({
      username: ['', [Validators.required, Validators.maxLength(32)]],
      firstname: ['', [Validators.required, Validators.maxLength(32)]],
      lastname: ['', [Validators.required, Validators.maxLength(32)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.maxLength(32)]],
      password: [''],
    });

    this.id = this.data.id;
    this.userType = this.data.userType
  }

  ngOnInit() {
    if (this.id)
    {
      this.searchById();
      this.isEdit = true;
      this.title = 'Editar';
    }
  }

  searchById() : void {
    this._authServices.GetUserId(this.id).subscribe({
      next: (result) =>
      {
        this.formUser.setValue({
          firstname: result.firstname,
          lastname: result.lastname,
          email: result.email,
          username: result.username,
          address: result.address,
          phone: result.cellphone,
          password: ''
        });
      },
      error: (err) => {
        this.messageError = err.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.messageError,
        });
      }
    });
  }

  getValidationErrors(): string[]
  {
    const Errors:string [] = [];

    Object.keys(this.formUser.controls).forEach((field) => {

      const controlErrors = this.formUser.get(field)?.errors;

      if (controlErrors)
      {
        Object.keys(controlErrors).forEach((fieldError) => {

          switch (fieldError)
          {
            case 'required':
              Errors.push(`el campo ${field} es obligatorio`);
              break;

            case 'email':
              Errors.push(`el campo ${field} debe ser un email valido`);
              break;

            case 'maxLength':
              const requiredLength = controlErrors[fieldError].requiredLength;
              Errors.push(`el campo ${field} no puede ser mayor a ${requiredLength} caracteres`);
              break;
          }
        });
      }
    });

    return Errors;
  }

  createUser(User: RegisterUser): void {
    this._authServices.Register(User).subscribe({
      next: (result) => {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Usuario Registrado con exito'
        });
        this.dialogRef.close(true);
      },
      error: (err) =>
      {
        this.messageError = err.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.messageError,
        });
      }
    });
  }

  updateUser(User: RegisterUser): void {
    this._authServices.UpdateUser(this.id, User).subscribe({
      next: (result) => {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Usuario actualizado con exito',
        });
        this.dialogRef.close(true);
      },
      error: (err) =>
      {
        this.messageError = err.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.messageError,
        });
      }
    });
  }

  SaveChangesUser(): void
  {
    if (this.formUser.valid)
    {
      const User: RegisterUser = {
        firstname: this.formUser.value.firstname,
        lastname: this.formUser.value.lastname,
        username: this.formUser.value.username,
        cellphone: this.formUser.value.phone,
        address: this.formUser.value.address,
        email: this.formUser.value.email,
        id: 0,
        typeUser: this.userType,
        password: this.formUser.value.password != '' ? this.formUser.value.password : '',
      };

      if (this.isEdit)
      {
        this.updateUser(User);
      }
      else
      {
        if (User.password == '')
        {
          Swal.fire({
            icon: 'warning',
            title: 'El formulario tiene los siguientes errores',
            text: 'el campo contraseña es un campo requerido'
          });
        }
        else
        {
          this.createUser(User);
        }
      }
    }
    else
    {
      const errors = this.getValidationErrors();
      Swal.fire({
        icon: 'warning',
        title: 'El formulario tiene los siguientes errores',
        html: errors.join('<br>'),
      });
    }
  }

  closeModal(): void {
    this.dialogRef.close(false);
  }
}
