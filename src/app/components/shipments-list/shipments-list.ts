import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {ShipmentsDetails} from '../../models/shipments-details';
import {ShipmentService} from '../../services/shipment-service';
import {Authservice} from '../../services/authservice';
import {Router, ActivatedRoute} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import {MatSortModule, MatSort} from '@angular/material/sort';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-shipments-list',
  imports: [
    MatCardModule,
    MatPaginatorModule,
    MatChipsModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    DatePipe,
  ],
  standalone: true,
  templateUrl: './shipments-list.html',
  styleUrl: './shipments-list.css',
})
export class ShipmentsList implements AfterViewInit {

  displayedColumns: string[] = ['id', 'state', 'date', 'deliveryDate'];
  dataSource: MatTableDataSource<ShipmentsDetails>;
  isLoading : boolean = false;
  errorMsg : string = '';
  id: number = 0;
  deliveryName: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private activatedRouter: ActivatedRoute,private authService: Authservice, private shipmentService: ShipmentService)
  {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit(): void
  {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit()
  {
    this.id = Number(this.activatedRouter.snapshot.paramMap.get('id'));
    this.indexShipments();
    this.searchDeliveryUser();
  }

  indexShipments():void
  {
    this.isLoading = true;
    this.shipmentService.getShipmentsDetails(this.id).subscribe({
      next: (data) =>
      {
        this.isLoading = false;
        this.dataSource.data = data.map(item => ({
          ...item,
          stateName: item.state == 'PENDING' ? 'Pendiente' : item.state == 'COMPLETED' ? 'Completado' : 'Cancelado',
        }));
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error)  =>
      {
        this.isLoading = false;
        this.dataSource.data = [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.errorMsg = error.message;

        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMsg
        });
      }
    });
  }

  applyFilter(event:Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  searchDeliveryUser():void
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
          text: this.errorMsg
        })
      }
    })
  }

  redirectedDeliveryList():void
  {
    this.router.navigateByUrl('home/deliveryList');
  }

}
