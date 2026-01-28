import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, throwError, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response';
import { ShipmentsDetails } from '../models/shipments-details';
import { ReportTotals } from '../models/report-totals';
import { Authservice } from './authservice';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {

  private apiUrl = 'http://localhost:8086/api';

  constructor(private http: HttpClient, private authservice: Authservice) { }

  getShipmentsDetails(id: number): Observable<ShipmentsDetails[]>
  {
    const token = this.authservice.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<ShipmentsDetails[]>>(`${this.apiUrl}/shipments/getAll/${id}`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handlerError)
    )
  }

  reportShipmentsUser():Observable<ReportTotals[]>
  {
    const token = this.authservice.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<ReportTotals[]>>(`${this.apiUrl}/shipments/deliveriesUsersTotals`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error (res.message);
        }

        return res.data;
      }),
      catchError(this.handlerError)
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
