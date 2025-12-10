import {Component, inject} from '@angular/core';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup ,Validators, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {InventoryAdjustmentService} from '../../services/inventory-adjustment-service';
import {ProductService} from '../../services/product-service';
import {InventoryAdjustment} from '../../models/inventory-adjustment';
import {Product} from '../../models/product';
import Swal from 'sweetalert2';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'app-inventory-adjustment-modal',
  imports: [
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './inventory-adjustment-modal.html',
  styleUrl: './inventory-adjustment-modal.css',
})
export class InventoryAdjustmentModal {

  formInventoryAdjustment: FormGroup;
  messageError: string = '';
  isEdit: boolean = false;
  data = inject<any>(MAT_DIALOG_DATA);
  id: number;
  title: string = 'Crear';
  productName: string = '';
  product!: Product;

  constructor(private _inventoryAdjustmentServices: InventoryAdjustmentService, private _productService: ProductService, private fb: FormBuilder, private dialogRef: MatDialogRef<InventoryAdjustmentModal>)
  {
    this.formInventoryAdjustment = this.fb.group({
      quantityProduct: [''],
      stock: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      price: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      productNewQuantity: []
    });

    this.id = this.data.id;
  }

  async ngOnInit():Promise<void>
  {
    await this.searchProduct();
    this.formInventoryAdjustment.get('quantityProduct')?.disable();
    this.formInventoryAdjustment.get('productNewQuantity')?.disable();

    if (this.id != 0)
    {
      this.isEdit = true;
      this.title = 'Editar';
      this.searchAdjustmentById();
    }
    else
    {
      this.formInventoryAdjustment.patchValue({quantityProduct: this.product.stock});
    }
  }

  async searchProduct():Promise<void>
  {
    try
    {
      const result = await lastValueFrom(
        this._productService.GetByIdProduct(this.data.product.id)
      );

      this.product = result;
      this.productName = result.name;
    }
    catch (error: any)
    {
      this.messageError = error.message;
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error',
        text: this.messageError,
      });
    }
  }

  searchAdjustmentById():void
  {
    this._inventoryAdjustmentServices.getInventoryAdjustmentsById(this.id).subscribe({
      next: (result) => {
        const productStockActually = this.product.stock - result.stock;
        this.formInventoryAdjustment.setValue({
          quantityProduct: productStockActually,
          stock: result.stock,
          price: result.purchasePrice,
          productNewQuantity: this.product.stock,
        });
      },
      error: (error) =>
      {
        this.messageError = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.messageError,
        });
      }
    });
  }

  createInventoryAdjustment(data:InventoryAdjustment): void
  {
    this._inventoryAdjustmentServices.createInventoryAdjustment(data).subscribe({
      next: (result) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Se ha creado con exito el nuevo ajuste de inventario'
        });
        this.dialogRef.close(true);
      },
      error: (error) =>
      {
        this.messageError = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.messageError,
        });
      }
    });
  }

  updateInventoryAdjustment(data:InventoryAdjustment):void
  {
    this._inventoryAdjustmentServices.updateInventoryAdjustment(data, this.id).subscribe({
      next: (result) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Se ha actualizado con exito el ajuste de inventario'
        });
        this.dialogRef.close(true);
      },
      error: (error) =>
      {
        this.messageError = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.messageError
        });
      }
    });
  }

  saveChanges():void
  {
    if (this.formInventoryAdjustment.valid)
    {
      const inventoryAdjustment: InventoryAdjustment = {
        id: 0,
        purchasePrice: this.formInventoryAdjustment.value.price,
        stock: this.formInventoryAdjustment.value.stock,
        productId: this.product.id,
      }

      if (this.isEdit)
      {
        this.updateInventoryAdjustment(inventoryAdjustment);
      }
      else
      {
        this.createInventoryAdjustment(inventoryAdjustment);
      }
    }
    else
    {
      const errors = this.getValidationErrors();
      Swal.fire({
        icon: 'warning',
        title: 'El formulario tiene los siguientes errores',
        html: errors.join('<br>')
      })
    }
  }

  getValidationErrors(): string[]
  {
    const listErrors: string[] = [];

    Object.keys(this.formInventoryAdjustment.controls).forEach((field) => {

      const controlErrors = this.formInventoryAdjustment.get(field)!.errors;

      if (controlErrors)
      {
        Object.keys(controlErrors).forEach((error) => {

          switch (error)
          {
            case 'required':
              listErrors.push(`el campo ${field} es obligatorio`);
              break;

            case 'pattern':
              listErrors.push(`el campo ${field} debe ser numerico`);
              break;
          }
        });
      }
    });

    return listErrors;
  }

  closeModal():void
  {
    this.dialogRef.close(false);
  }

  changeValueInput(event: Event):void
  {
    const value = (event.target as HTMLInputElement).value;
    const productStock = this.formInventoryAdjustment.getRawValue().quantityProduct;
    const finalStock = Number(productStock) + Number(value);
    this.formInventoryAdjustment.patchValue({productNewQuantity: finalStock});
  }

}

