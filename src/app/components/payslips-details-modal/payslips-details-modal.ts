import {Component, inject, Inject} from '@angular/core';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTooltipModule} from '@angular/material/tooltip';
import {PayslipService} from '../../services/payslip-service';
import {PayslipDetails} from '../../models/payslip-details';
import Swal from 'sweetalert2';
import {DatePipe, DecimalPipe} from '@angular/common';
import {PaymentsDetails} from '../../models/payments-details';

@Component({
  selector: 'app-payslips-details-modal',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatDatepickerModule,
    MatTooltipModule,
    ReactiveFormsModule,
    DecimalPipe,
    DatePipe,
  ],
  standalone: true,
  templateUrl: './payslips-details-modal.html',
  styleUrl: './payslips-details-modal.css',
})
export class PayslipsDetailsModal {

  displayedColumns: string[] = ['id', 'payValue', 'nameState', 'payDay']
  dataSource : MatTableDataSource<PaymentsDetails>;
  formDetails : FormGroup;
  errorMessage : string = '';
  data = inject<any>(MAT_DIALOG_DATA);
  id:number = 0;

  constructor(private fb: FormBuilder, private payslipService: PayslipService, private matDialog: MatDialogRef<PayslipsDetailsModal>)
  {
    this.dataSource = new MatTableDataSource();
    this.formDetails = fb.group({
      total: ['', Validators.required],
      date: [null, Validators.required],
    });
    this.id = this.data.id;
  }

  ngOnInit():void
  {
    this.searchPayslipDetails();
  }

  closeModal():void
  {
    this.matDialog.close();
  }

  searchPayslipDetails():void
  {
    this.payslipService.getByIdPayslip(this.id).subscribe({
      next: (data) =>
      {
        this.dataSource.data = data.payments.map(payments => ({
          ...payments,
          nameState: payments.state ? 'Pagado' : 'Pendiente de pago'
        }));

        this.formDetails.setValue({
          total: data.total,
          date: new Date(data.paymentDate),
        });

        this.formDetails.get('total')?.disable();
        this.formDetails.get('date')?.disable();

      },
      error: (error) =>
      {
        this.errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: this.errorMessage,
        });
      }
    });
  }

}
