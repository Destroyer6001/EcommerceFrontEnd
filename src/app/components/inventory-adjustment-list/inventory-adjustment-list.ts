import { Component, AfterViewInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import {InventoryAdjustmentDetails} from '../../models/inventory-adjustment-details';
import {Product} from '../../models/product';
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
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {InventoryAdjustmentModal} from '../inventory-adjustment-modal/inventory-adjustment-modal';
import {MatButtonModule} from '@angular/material/button';
import {DecimalPipe, DatePipe} from '@angular/common';
import {InventoryAdjustmentService} from '../../services/inventory-adjustment-service';
import {ProductService} from '../../services/product-service';

@Component({
  selector: 'app-inventory-adjustment-list',
  imports: [
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    DecimalPipe,
    DatePipe
  ],
  standalone: true,
  templateUrl: './inventory-adjustment-list.html',
  styleUrl: './inventory-adjustment-list.css',
})
export class InventoryAdjustmentList implements AfterViewInit {
  displayedColumns: string [] = ['id', 'stock', 'price', 'dateAdjustment', 'actions'];
  dataSource: MatTableDataSource<InventoryAdjustmentDetails>;
  isLoading = false;
  errorMessage: string = '';
  product!: Product;
  productName: string = '';
  id!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private _inventoryAdjustmentService: InventoryAdjustmentService, private _productService: ProductService, private dialog: MatDialog)
  {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit(): void
  {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.id = Number (this.activeRoute.snapshot.paramMap.get('id'));
    this.indexInventoryAdjustment();
    this.searchProduct();
  }

  searchProduct():void
  {
    this._productService.GetByIdProduct(this.id).subscribe({
      next: (data) => {
        this.product = data;
        this.productName = this.product.name;
      },
      error: (error) => {
        this.errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMessage,
        });
      }
    });
  }

  indexInventoryAdjustment(): void
  {
    this.isLoading = true;
    this._inventoryAdjustmentService.indexInventoryAdjustments(this.id).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) =>
      {
        this.isLoading = false;
        this.dataSource.data = [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMessage,
        });
      }
    });
  }

  confirmDeleteInventoryAdjustment(id:number): void
  {
    Swal.fire({
      title: 'Advertencia',
      icon: 'warning',
      text: 'Esta seguro de eliminar el ajuste de inventario',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Eliminar',
    }).then((result) => {
      if (result.isConfirmed)
      {
        this.deleteInventoryAdjustment(id);
      }
    });
  }

  openModal(id: number): void
  {
    const dialogRef = this.dialog.open(InventoryAdjustmentModal, {
      width: '750px',
      maxWidth: '95vw',
      disableClose: true,
      data: {id: id, product: this.product},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true)
      {
        this.indexInventoryAdjustment();
      }
    });
  }

  deleteInventoryAdjustment(id: number): void
  {
    this._inventoryAdjustmentService.deleteInventoryAdjustment(id).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El producto ha sido eliminado con exito'
        });
        this.indexInventoryAdjustment();
      },
      error: (error) => {
        this.errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMessage,
        });
        this.indexInventoryAdjustment();
      }
    });
  }

  redirectedProductIndex():void
  {
    this.router.navigateByUrl('/home/productList');
  }

  applyFilter(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator)
    {
      this.dataSource.paginator.firstPage();
    }
  }

}
