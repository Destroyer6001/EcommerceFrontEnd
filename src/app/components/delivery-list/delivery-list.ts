import {Component, AfterViewInit, ViewChild, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {UserDetails} from '../../models/user-details';
import {Authservice} from '../../services/authservice';
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
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {AdminModal} from '../admin-modal/admin-modal';

@Component({
  selector: 'app-delivery-list',
  imports: [
    MatCardModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatProgressBarModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
  ],
  standalone: true,
  templateUrl: './delivery-list.html',
  styleUrl: './delivery-list.css',
})
export class DeliveryList implements AfterViewInit{

  displayedColumns:string[] = ['id', 'username', 'fullname', 'email', 'phone', 'actions'];
  dataSource: MatTableDataSource<UserDetails>;
  isLoading: boolean = false;
  errorMsg: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private _authServices:Authservice, private dialog: MatDialog)
  {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit()
  {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(id:number) : void
  {
    const dialogRef = this.dialog.open(AdminModal, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: true,
      data: {id: id, userType: 3}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true)
      {
        this.indexUser();
      }
    });
  }

  ngOnInit():void
  {
    this.indexUser();
  }

  indexUser():void
  {
    this.isLoading = true;
    this._authServices.getDeliveriesUser().subscribe({
      next: (data) => {
        this.isLoading = false;

        this.dataSource.data = data.map(item => ({
          ...item,
          fullname: `${item.firstname} ${item.lastname}`,
        }));

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
          text: this.errorMsg
        });
      }
    });
  }

  deleteUser(id:number):void
  {
    this._authServices.deleteAdminUser(id).subscribe({
      next: (data) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'Se ha eliminado con exito el usuario seleccionado'
        });
        this.indexUser();
      },
      error: (error) =>
      {
        this.errorMsg = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMsg
        });
        this.indexUser();
      }
    });
  }

  redirectedLink(id:number, typeUrl: number): void
  {
    if (typeUrl == 1)
    {
      this.router.navigateByUrl(`/home/payslipsList/${id}`);
    }
    else
    {
      this.router.navigateByUrl(`/home/shipmentsList/${id}`);
    }
  }

  confirmDeleteUser(id:number):void
  {
    Swal.fire({
      title: "Advertencia",
      icon: "warning",
      text: "Esta seguro de querer eliminar el usuario",
      showCancelButton: true,
      confirmButtonText: "Si, Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed)
      {
        this.deleteUser(id);
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
