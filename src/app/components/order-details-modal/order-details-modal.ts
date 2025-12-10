import {Component, AfterViewInit, inject, ViewChild} from '@angular/core';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {OrderServices} from '../../services/order-services';
import Swal from 'sweetalert2';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatSortModule, MatSort} from '@angular/material/sort';
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTooltipModule} from '@angular/material/tooltip';
import {OrderDetails} from '../../models/order-details';
import {OrderProductsDetailsUser} from '../../models/order-products-details-user';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-order-details-modal',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDatepickerModule,
    MatTooltipModule,
    DecimalPipe
  ],
  templateUrl: './order-details-modal.html',
  styleUrl: './order-details-modal.css',
})
export class OrderDetailsModal implements AfterViewInit
{
  displayedColumns: string [] = ['productName', 'stock', 'salePrice', 'total']
  dataSource: MatTableDataSource<OrderProductsDetailsUser>;
  formDetails: FormGroup;
  messageError: string = '';
  data = inject<any>(MAT_DIALOG_DATA)
  id: number
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, private _orderService: OrderServices, private dialogRef: MatDialogRef<OrderDetailsModal>)
  {
    this.dataSource = new MatTableDataSource();
    this.id = this.data.id;
    this.formDetails = fb.group({
      userName: ['', Validators.required],
      state: ['', Validators.required],
      date: [null, Validators.required],
      total: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngAfterViewInit()
  {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  closeModal()
  {
    this.dialogRef.close();
  }

  ngOnInit(): void
  {
    this.searchDetailsOrder();
  }

  searchDetailsOrder():void
  {
    this._orderService.getByIdUserOrder(this.id).subscribe({
      next: (resp) =>
      {
        console.log(resp);
        this.dataSource.data = resp.detailsUser.map(item => ({
          ...item,
          totalProduct: item.salePrice * item.stock
        }));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.formDetails.setValue({
          userName: resp.username,
          date: new Date (resp.orderDate),
          state: resp.state == 'PENDING' ? 'PENDIENTE' : resp.state == 'COMPLETED' ? 'COMPLETADO': 'CANCELADO',
          total: resp.total,
          address: resp.address,
        });

        this.formDetails.get('userName')?.disable();
        this.formDetails.get('date')?.disable();
        this.formDetails.get('total')?.disable();
        this.formDetails.get('address')?.disable();
        this.formDetails.get('state')?.disable();
      },
      error: (err) =>
      {
        this.messageError = err.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.messageError,
        })
      }
    })
  }
}
