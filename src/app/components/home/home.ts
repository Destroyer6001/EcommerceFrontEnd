import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {Authservice} from '../../services/authservice';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {Router, RouterOutlet} from '@angular/router';
import Swal from 'sweetalert2';
import {EditUser} from '../edit-user/edit-user';

@Component({
  selector: 'app-home',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    RouterOutlet,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home {

  isAdminRole: boolean = false;

  constructor(private _authservice: Authservice, private router: Router, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.validateAdminRole();
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
}
