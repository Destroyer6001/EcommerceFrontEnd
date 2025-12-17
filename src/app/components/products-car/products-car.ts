import { Component } from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DecimalPipe} from '@angular/common';
import Swal from 'sweetalert2';
import {OrderServices} from '../../services/order-services';
import {ProductCarService} from '../../services/product-car-service';
import {ProductCar} from '../../models/product-car';
import {OrderProduct} from '../../models/order-product';
import {Order} from '../../models/order';

@Component({
  selector: 'app-products-car',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    DecimalPipe
  ],
  templateUrl: './products-car.html',
  styleUrl: './products-car.css',
})
export class ProductsCar {

  car: ProductCar[] = [];
  displayedColumns: string[] = ['name', 'salePrice', 'quantity', 'subtotal', 'actions'];
  dataSource: MatTableDataSource<ProductCar>;
  messageError: string = '';

  constructor(private _orderService: OrderServices, private _productCarService: ProductCarService, private dialogRef: MatDialogRef<ProductsCar>) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() : void
  {
    this.searchCar();
  }

  closeModal(): void
  {
    this.dialogRef.close();
  }

  searchCar(): void {
    this._productCarService.cart$.subscribe(item => {
      this.car = item;
      this.dataSource.data = this.car;
    });
  }

  updateProduct(id: number, event: Event): void {
    const quantity = Number((event.target as HTMLInputElement).value);

    if (quantity > 0) {
      this._productCarService.updateItemCar(id, quantity);
    }
  }

  removeItemCar(id: number) {
    return this._productCarService.deleteItemCar(id);
  }

  getTotal(): number
  {
    return this.car.reduce(
      (sum, item) => sum + item.unitPrice * item.stock,
      0
    ) ;
  }

  saveOrder(): void
  {
    if (this.car.length === 0)
    {
      Swal.fire({
        icon: 'warning',
        title: '¡Advertencia!',
        text: 'No has seleccionado ningun producto'
      });
      return;
    }

    const total = this.car.reduce((sum, item) => sum + item.unitPrice * item.stock, 0);
    const productList: OrderProduct[] = this.car.map((item) => ({
      productId: item.id,
      stock: item.stock,
      salePrice: item.unitPrice
    }));

    const order: Order = {
      id: 0,
      total: total,
      orderProducts: productList
    };

    this._orderService.createOrder(order).subscribe({
      next: (resp) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Se ha procesado con exito la orden'
        });
        this._productCarService.clearCar();
        this.dialogRef.close();
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

  getSubtotalProduct(product: ProductCar): number
  {
    const subtotal = product.unitPrice * product.stock;
    console.log(subtotal);
    return subtotal;
  }
}
