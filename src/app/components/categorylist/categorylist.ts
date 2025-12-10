import {Component, AfterViewInit, ViewChild, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {Category} from '../../models/category';
import {Categoryservice} from '../../services/categoryservice';
import {Router} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortHeader, MatSortModule} from '@angular/material/sort';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {CategoryModal} from '../category-modal/category-modal';


@Component({
  selector: 'app-categorylist',
  imports: [
    MatCardModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
  ],
  standalone: true,
  templateUrl: './categorylist.html',
  styleUrl: './categorylist.css',
})
export class Categorylist implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource: MatTableDataSource<Category>;
  isLoading: boolean = false;
  errorMessage: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private _categoryService: Categoryservice, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.indexCategory();
  }

  indexCategory(): void {
    this.isLoading = true;
    this._categoryService.IndexCategory().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.errorMessage = err.message;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage,
        });
        this.isLoading = false;
        this.dataSource.data = [];
      }
    });
  }

  openCategoryDialog(id: number) {

    const dialogRef = this.dialog.open(CategoryModal, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true,
      data: {id: id},
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result == true)
      {
        this.indexCategory();
      }
    })
  }

  confirmDeleteCategory(id: number): void {

    Swal.fire({
      title: "Advertencia",
      icon: "warning",
      text: "Esta seguro de querer eliminar la categoria?",
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed)
      {
        this.deleteCategory(id);
      }
    })
  }

  deleteCategory(id: number): void {
    this._categoryService.DeleteCategory(id).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Categoria eliminada con exito'
        });
        this.indexCategory();
      },
      error: (err) => {
        this.errorMessage = err.message;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage,
        });
        this.indexCategory();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
