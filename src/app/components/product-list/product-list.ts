import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {ProductDetails} from '../../models/product-details';
import {ProductService} from '../../services/product-service';
import {Router} from '@angular/router';
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
import {ProductModal} from '../product-modal/product-modal';
import {MatButtonModule} from '@angular/material/button';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    DecimalPipe,
  ],
  standalone: true,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements AfterViewInit{
  displayedColumns: string [] = ['id', 'name', 'category', 'stock', 'sale', 'image', 'actions'];
  dataSource: MatTableDataSource<ProductDetails>;
  isLoading = false;
  errorMessage: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private _productServices: ProductService, private dialog: MatDialog )
  {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit(): void
  {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openModal(id:number):void
  {
      const dialogRef = this.dialog.open(ProductModal, {
        width: '950px',
        maxWidth: '95vw',
        disableClose: true,
        data: {id: id}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == true)
        {
          this.indexProduct();
        }
      });
  }

  ngOnInit():void
  {
    this.indexProduct();
  }

  redirectInventoryAdjustment(id: number): void
  {
    this.router.navigateByUrl(`/home/inventoryAdjustment/${id}`);
  }

  indexProduct():void
  {
    this.isLoading = true;
    this._productServices.IndexProduct().subscribe({
      next: (data) =>
      {
        this.isLoading = false;
        console.log(data);
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) =>
      {
        this.isLoading = false;
        this.errorMessage = error.message;
        this.dataSource.data = [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMessage,
        });
      }
    });
  }

  onImgError(event: Event){
    (event.target as HTMLImageElement).src = 'https://url-shortener.me/LKI'
  }

  deleteProduct(id:number):void
  {
    this._productServices.DeleteProduct(id).subscribe({
      next: (data) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El producto ha sido eliminado con exito'
        });
        this.indexProduct();
      },
      error: (err) =>
      {
        this.errorMessage = err.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMessage,
        });
        this.indexProduct();
      }
    });
  }

  confirmDeleteProduct(id:number):void
  {
    Swal.fire({
      title: 'Advertencia',
      icon: 'warning',
      text: 'Esta seguro de eliminar el producto',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed)
      {
        this.deleteProduct(id);
      }
    });
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
