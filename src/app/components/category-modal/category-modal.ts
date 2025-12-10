import {Component, inject} from '@angular/core';
import {MatDialogRef, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {Category} from '../../models/category';
import {Categoryservice} from '../../services/categoryservice';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-category-modal',
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
  templateUrl: './category-modal.html',
  styleUrl: './category-modal.css',
})
export class CategoryModal {

  categoryForm: FormGroup;
  messageError = "";
  isEdit = false;
  title = "Crear";
  data= inject<any>(MAT_DIALOG_DATA);
  id: number;

  constructor(public dialogRef: MatDialogRef<CategoryModal>, private _categoryService: Categoryservice, private fb: FormBuilder)
  {
    this.categoryForm = fb.group({
      name: ['', [Validators.required, Validators.maxLength(64)]],
      description: ['', [Validators.required, Validators.maxLength(322)]],
    })
    this.id = this.data.id;
  }

  ngOnInit(): void {
    if (this.id != 0)
    {
      this.getCategoryById();
      this.title = "Editar";
      this.isEdit = true;
    }
  }

  SaveChanges(): void
  {
    if (this.categoryForm.valid)
    {
      const category: Category = {
        id: 0,
        name: this.categoryForm.value.name,
        description: this.categoryForm.value.description,
      };

      if (this.isEdit)
      {
        this.UpdateCategory(category);
      }
      else
      {
        this.CreateCategory(category);
      }

    }
    else
    {
      const errors = this.getValidationErrors();
      Swal.fire({
        icon: 'warning',
        title: 'El formulario tiene los siguientes errores',
        html: errors.join('<br>')
      });
    }
  }

  CreateCategory(data: Category): void
  {
    this._categoryService.CreateCategory(data).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Categoria creada con exito'
        });
        this.dialogRef.close(true);
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

  UpdateCategory(data: Category) : void
  {
    this._categoryService.UpdateCategory(data, this.id).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'La categoria ha sido actualizada con exito'
        });
        this.dialogRef.close(true);
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
    const Errors: string[] = [];

    Object.keys(this.categoryForm.controls).forEach(field => {

      const controlErrors = this.categoryForm.get(field)?.errors;

      if (controlErrors)
      {
        Object.keys(controlErrors).forEach(fieldError => {

          switch(fieldError)
          {
            case 'required':
              Errors.push(`el campo ${field} es obligatorio`);
              break;

            case 'maxlength':
              const requiredLength = controlErrors[fieldError].requiredLength;
              Errors.push(`el campo ${field} no debe tener mas de ${requiredLength} caracteres`);
          }
        });
      }
    });
    return Errors;
  }

  getCategoryById():void {
    this._categoryService.FindByIdCategory(this.id).subscribe({
      next: (result) => {
        this.categoryForm.setValue({
          name: result.name,
          description: result.description,
        });
      },
      error: (error) => {
        this.messageError = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.messageError,
        });
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close(false);
  }
}
