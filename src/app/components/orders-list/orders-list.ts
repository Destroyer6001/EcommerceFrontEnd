import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {OrderDetails} from '../../models/order-details';
import {ChangeState} from '../../models/change-state';
import {Router} from '@angular/router';
import {OrderServices} from '../../services/order-services';
import {Authservice} from '../../services/authservice';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatSortModule, MatSort} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {DatePipe, DecimalPipe} from '@angular/common';
import {OrderDetailsModal} from '../order-details-modal/order-details-modal';

@Component({
  selector: 'app-orders-list',
  imports: [
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    DecimalPipe,
    DatePipe
  ],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.css',
})
export class OrdersList implements AfterViewInit {
  displayedColumns: string [] = ['id', 'username', 'total', 'date', 'state', 'actions']
  dataSource: MatTableDataSource<OrderDetails>;
  isLoading: boolean = false;
  errorMessage: string = '';
  isAdmin: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private _orderService: OrderServices, private dialog: MatDialog, private _authService: Authservice) {
    this.dataSource = new MatTableDataSource();
  }

  applyFilter(event: Event): void
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator)
    {
      this.dataSource.paginator.firstPage();
    }
  }

  openModal(id:number):void
  {
    const dialogResult = this.dialog.open(OrderDetailsModal, {
      width: '850px',
      maxHeight: '95vw',
      disableClose: true,
      data: {id: id}
    });

    dialogResult.afterClosed().subscribe(result => {

    });
  }

  ngAfterViewInit()
  {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void
  {
    this.isAdmin = this._authService.getRole() == 'ADMIN';

    if (this.isAdmin)
    {
      this.searchOrders();
    }
    else
    {
      this.searchUserOrders();
    }
  }

  searchUserOrders():void
  {
    this.isLoading = true;
    const id = Number(this._authService.getUserId());

    this._orderService.getOrdersUser(id).subscribe({
      next: (result) =>
      {
        this.isLoading = false;
        this.dataSource.data = result.map(item => ({
          ...item,
          nameState: item.state == 'PENDING' ? 'Pendiente' : item.state == 'COMPLETED' ? 'Completado' : item.state == 'SEND' ? 'Enviado' : 'Cancelado',
        }));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      error: (err) =>
      {
        this.errorMessage = err.message;
        Swal.fire({
          'icon': 'error',
          'title': 'Ha ocurrido un error',
          'text': this.errorMessage,
        });
      }
    })
  }

  searchOrders():void
  {
    this.isLoading = true;
    this._orderService.indexOrderDetails().subscribe({
      next: (data) =>
      {
        console.log(data);
        this.isLoading = false;
        this.dataSource.data = data.map(item => ({
          ...item,
          nameState: item.state == 'PENDING' ? 'Pendiente' : item.state == 'COMPLETED' ? 'Completado' : 'Cancelado',
        }));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) =>
      {
        this.isLoading = false;
        this.errorMessage = error.message;
        this.dataSource.data = [];
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMessage
        });
      }
    });
  }

  changeStatusOrder(orderId: number)
  {
    this._orderService.cancelOrder(orderId).subscribe({
      next: (data) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Se ha actualizado con exito el estado de la orden'
        });

        if (this.isAdmin)
        {
          this.searchOrders();
        }
        else
        {
          this.searchUserOrders();
        }
      },
      error: (error) =>
      {
        this.errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMessage
        });

        if (this.isAdmin)
        {
          this.searchOrders();
        }
        else
        {
          this.searchUserOrders();
        }
      }
    });
  }
}
