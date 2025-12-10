import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, map, throwError, pipe} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiResponse} from '../models/api-response';
import {InventoryAdjustment} from '../models/inventory-adjustment';
import {InventoryAdjustmentDetails} from '../models/inventory-adjustment-details';
import {Authservice} from './authservice';

@Injectable({
  providedIn: 'root',
})
export class InventoryAdjustmentService {

  private apiUrl = 'http://localhost:8086/api';

  constructor(private http: HttpClient, private _authServices: Authservice) {}

  indexInventoryAdjustments(productId:number): Observable<InventoryAdjustmentDetails[]>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<InventoryAdjustmentDetails[]>>(`${this.apiUrl}/inventoryAdjustments/getAll/${productId}`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message)
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  getInventoryAdjustmentsById(id:number): Observable<InventoryAdjustment>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'content-type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<InventoryAdjustment>>(`${this.apiUrl}/inventoryAdjustments/${id}`,{headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message)
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  createInventoryAdjustment(data:InventoryAdjustment): Observable<InventoryAdjustment>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'content-type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.post<ApiResponse<InventoryAdjustment>>(`${this.apiUrl}/inventoryAdjustments`, data, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message)
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  updateInventoryAdjustment(data:InventoryAdjustment, id:number): Observable<InventoryAdjustment>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'content-type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.put<ApiResponse<InventoryAdjustment>>(`${this.apiUrl}/inventoryAdjustments/${id}`, data, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message)
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  deleteInventoryAdjustment(id:number): Observable<InventoryAdjustment>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'content-type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.delete<ApiResponse<InventoryAdjustment>>(`${this.apiUrl}/inventoryAdjustments/${id}`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message)
        }

        return res.data;

      }),
      catchError(this.handleError)
    )
  }



  private handleError(err: HttpErrorResponse)
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
