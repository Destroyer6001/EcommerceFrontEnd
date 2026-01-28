import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PayslipDetails } from '../../models/payslip-details';
import { PayslipService } from '../../services/payslip-service';
import { Authservice } from '../../services/authservice';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSortModule, MatSort} from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { PayslipsDetailsModal } from '../payslips-details-modal/payslips-details-modal';
import Swal from 'sweetalert2';
import {DatePipe, DecimalPipe} from '@angular/common';
import {filter} from 'rxjs';

@Component({
  selector: 'app-payslips-list',
  imports: [
    MatDialogModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    MatButtonModule,
    DatePipe,
    DecimalPipe,
  ],
  standalone: true,
  templateUrl: './payslips-list.html',
  styleUrl: './payslips-list.css',
})
export class PayslipsList implements AfterViewInit {
  displayedColumns : string[] = ['id', 'total', 'paymentDate', 'actions'];
  isLoading : boolean = false;
  errorMsg: string = '';
  dataSource: MatTableDataSource<PayslipDetails>;
  id: number = 0;
  deliveryName: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private authService: Authservice, private payslipService: PayslipService, private router: Router, private activatedRouter: ActivatedRoute, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit(): void
  {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit():void
  {
    this.id = Number(this.activatedRouter.snapshot.paramMap.get('id'));
    this.searchDeliveryId();
    this.indexPayslips();
  }

  indexPayslips():void
  {
    this.isLoading = true;
    this.payslipService.indexPayslips(this.id).subscribe({
      next: (data) =>
      {
        this.isLoading = false;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) =>
      {
        this.isLoading = false;
        this.errorMsg = error.message;
        this.dataSource.data = [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMsg,
        });
      }
    });
  }

  searchDeliveryId():void
  {
    this.authService.GetUserId(this.id).subscribe({
      next: (data) =>
      {
        this.deliveryName = `${data.firstname} ${data.lastname}`;
      },
      error: (error) =>
      {
        this.errorMsg = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMsg,
        });
      }
    });
  }

  openModal(id:number):void
  {
    const dialogRef = this.dialog.open(PayslipsDetailsModal, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: true,
      data: {id: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true)
      {
        this.indexPayslips();
      }
    });
  }

  redirectedDeliveryList():void
  {
    this.router.navigateByUrl('home/deliveryList')
  }

  applyFilter(event:Event):void
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator)
    {
      this.dataSource.paginator.firstPage();
    }
  }

  protected readonly filter = filter;
}
