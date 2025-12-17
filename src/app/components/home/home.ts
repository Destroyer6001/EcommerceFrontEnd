import {Component, ViewChild} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Authservice} from '../../services/authservice';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {MatSidenavModule, MatSidenav} from '@angular/material/sidenav';
import {Router, RouterOutlet} from '@angular/router';
import Swal from 'sweetalert2';
import {EditUser} from '../edit-user/edit-user';
import {MatDivider, MatListItem, MatListItemIcon, MatListItemTitle, MatNavList} from '@angular/material/list';
import {ProductsCar} from '../products-car/products-car';

@Component({
  selector: 'app-home',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatDivider,
    RouterOutlet,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isAdminRole: boolean = false;
  isSidenavOpen: boolean = false;

  constructor(private _authservice: Authservice, private router: Router, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.validateAdminRole();
  }

  toggleSidenav()
  {
    this.sidenav?.toggle();
  }

  Logout(): void {
    this._authservice.logout();
    Swal.fire({
      icon: 'success',
      title: 'Exito',
      text: 'Se ha cerrado con exito la sesion'
    });
    this.router.navigateByUrl('');
  }

  redirectLink(link: string): void {
    this.router.navigateByUrl(link);
  }

  validateAdminRole(){
    const role = this._authservice.getRole();

    if (role != null && role == 'ADMIN')
    {
      this.isAdminRole = true;
    }
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(EditUser, {
      maxWidth: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {})
  }

  openCarProductDialog(): void
  {
    const dialogRef = this.dialog.open(ProductsCar,
      {
        width: '750px',
        maxWidth: '95vw',
        disableClose: true
      });

    dialogRef.afterClosed().subscribe(result => {})
  }
}
