import {Component, inject} from '@angular/core';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {Categoryservice} from '../../services/categoryservice';
import {ProductService} from '../../services/product-service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import {Product} from '../../models/product';
import {Category} from '../../models/category';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';


@Component({
  selector: 'app-product-modal',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
  ],
  standalone: true,
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.css',
})
export class ProductModal {

  formProduct: FormGroup;
  messageError: string = '';
  isEdit = false;
  title = 'Crear';
  data = inject<any>(MAT_DIALOG_DATA);
  id: number;
  categories: Category[] = [];
  imgPreview: string = '';


  constructor(private _categoryServices: Categoryservice, private _productServices: ProductService, private fb: FormBuilder, private dialogRef: MatDialogRef<ProductModal>)
  {
    this.formProduct = fb.group({
      name: ['', [Validators.required, Validators.maxLength(32)]],
      description: ['', [Validators.required, Validators.maxLength(128)]],
      sale: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      salePrice: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      categoryId: [0, [Validators.required]],
      stock: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      date: [null, [Validators.required]],
      image: ['']
    });

    this.id = this.data.id;
  }

  ngOnInit()
  {
    this.searchCategories();

    if (this.id != 0)
    {
      this.searchProductById();
      this.isEdit = true;
      this.title = 'Editar';
      this.formProduct.get('stock')?.disable();
    }
  }

  closeModal() : void
  {
    this.dialogRef.close(false);
  }

  getValidationErrors(): string[] {
    const errors: string[] = [];

    Object.keys(this.formProduct.controls).forEach((field) => {

      const controlErrors = this.formProduct.get(field)?.errors;

      if (controlErrors)
      {
        Object.keys(controlErrors).forEach(fieldError => {

          switch (fieldError)
          {
            case 'required':
              errors.push(`el campo ${field} es obligatorio`);
              break;

            case 'maxLength':
              const requiredLength = controlErrors[fieldError].requiredLength;
              errors.push(`el campo ${field} no puede tener mas de ${requiredLength} caracteres`);
              break;

            case 'pattern':
              errors.push(`el campo ${field} debe ser numerico`);
              break;
          }
        });
      }
    });

    return errors;
  }

  searchCategories() : void {
    this._categoryServices.IndexCategory().subscribe({
      next: (data) =>
      {
        this.categories = data;
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

  searchProductById (): void {
    this._productServices.GetByIdProduct(this.id).subscribe({
      next: (data) =>
      {
        this.formProduct.setValue({
          name: data.name,
          description: data.description,
          sale: data.sale,
          salePrice: data.salePrice,
          categoryId: data.categoryId,
          stock: data.stock,
          date: new Date(data.createdDate),
          image: '',
        });
        console.log(data);
        this.imgPreview = data.imagen != null && data.imagen != '' ? data.imagen : '';
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

  createProduct(product:Product): void
  {
    console.log(product);
    this._productServices.CreateProduct(product).subscribe({
      next: (data) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Se ha creado con exito el producto',
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

  updateProduct(product:Product): void
  {
    this._productServices.UpdateProduct(this.id, product).subscribe({
      next: (data) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Se ha actualizado con exito el producto',
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

  saveChanges() : void
  {
    if (this.formProduct.valid)
    {
      const product: Product = {
        id: 0,
        name: this.formProduct.value.name,
        description: this.formProduct.value.description,
        sale: this.formProduct.value.sale,
        salePrice: this.formProduct.value.salePrice,
        categoryId: this.formProduct.value.categoryId,
        createdDate: this.formProduct.value.date.toISOString(),
        imagen: this.formProduct.value.image,
        stock: this.isEdit ? this.formProduct.getRawValue().stock :this.formProduct.value.stock
      };

      if (this.isEdit)
      {
        this.updateProduct(product);
      }
      else
      {
        this.createProduct(product);
      }
    }
    else
    {
      const errors = this.getValidationErrors();
      Swal.fire({
        icon: 'warning',
        title: 'el formulario tiene los siguientes errores',
        html: errors.join('<br>'),
      });
    }
  }

  onFileSelected(event: any): void
  {
    let imageBase64;
    const file: File = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () =>
    {
       imageBase64 = reader.result as string;
       this.imgPreview = imageBase64;

       this.formProduct.patchValue({ image: imageBase64 });
    };

    reader.readAsDataURL(file);
  }
}
