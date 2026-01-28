import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, map, throwError, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response';
import { PayslipDetails } from '../models/payslip-details';
import { PaymentsDetails } from '../models/payments-details';
import { Authservice } from './authservice';
import { ReportTotals } from '../models/report-totals';

@Injectable({
  providedIn: 'root',
})
export class PayslipService {

  private apiUrl = 'http://localhost:8086/api';

  constructor(private http: HttpClient, private authservice: Authservice) { }

  indexPayslips(id:number): Observable<PayslipDetails[]>
  {
    const token = this.authservice.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<PayslipDetails[]>>(`${this.apiUrl}/payslips/getAllPayslipsUser/${id}`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message)
        }

        return res.data;
      }),
      catchError (this.handlerError)
    )
  }

  getByIdPayslip(id:number): Observable<PayslipDetails>
  {
    const token = this.authservice.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<PayslipDetails>>(`${this.apiUrl}/payslips/getById/${id}`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message)
        }

        return res.data;
      }),
      catchError (this.handlerError)
    )
  }

  reportPayslipUsers(): Observable<ReportTotals[]>
  {
    const token = this.authservice.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<ReportTotals[]>>(`${this.apiUrl}/payslips/payslipUsersTotal`, {headers}).pipe(

      map((res) => {

        if (!res.success)
        {
          throw Error (res.message);
        }

        return res.data;
      }),
      catchError (this.handlerError)
    )
  }

  private handlerError(err: HttpErrorResponse)
  {
    let errorMsg = 'Error desconocido';

    if (err.error instanceof ErrorEvent)
    {
      errorMsg = `Error de cliente: ${err.error.message}`;
    }
    else if (!err.error)
    {
      errorMsg = err.message;
    }
    else
    {
      if (typeof err.error === 'string')
      {
        try
        {
          const parsed = JSON.parse(err.error);
          errorMsg = parsed.message;
        }
        catch
        {
          errorMsg = err.message;
        }
      }
    }
    return throwError(() => new Error(errorMsg));
  }
}
