import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, map, throwError, pipe} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiResponse} from '../models/api-response';
import {OrderDetails} from '../models/order-details';
import {OrderDetailsUser} from '../models/order-details-user';
import {Order} from '../models/order';
import {Authservice} from './authservice';
import {ChangeState} from '../models/change-state';
import {ReportTotals} from '../models/report-totals';
import {UserDetails} from '../models/user-details';

@Injectable({
  providedIn: 'root',
})
export class OrderServices {

  private apiUrl = 'http://localhost:8086/api';

  constructor(private http: HttpClient, private _authServices: Authservice) {}

  indexOrderDetails(): Observable<OrderDetails[]>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<OrderDetails[]>>(`${this.apiUrl}/orders/getAllOrders`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message)
        }

        return res.data;
      }),
      catchError(this.handlerError)
    )
  }

  getByIdUserOrder(id: number): Observable<OrderDetailsUser>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<OrderDetailsUser>>(`${this.apiUrl}/orders/orderById/${id}`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message)
        }

        return res.data;
      }),
      catchError(this.handlerError)
    )
  }

  getOrdersUser(UserId:number): Observable<OrderDetails[]>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<OrderDetails[]>>(`${this.apiUrl}/orders/getOrdersUser/${UserId}`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError (this.handlerError)
    )
  }

  createOrder(order: Order): Observable<Order>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/orders/orderCreate`, order, {headers}).pipe(
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

  cancelOrder(orderId: Number): Observable<Number>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.patch<ApiResponse<Number>>(`${this.apiUrl}/orders/cancelOrder/${orderId}`, null, {headers}).pipe(
      map((res) => {
        console.log(res);
        if (!res.success)
        {
          throw Error(res.message);
        }
        return res.data;
      }),
      catchError (this.handlerError)
    )
  }

  reportSalesProduct(): Observable<ReportTotals[]>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<ReportTotals[]>>(`${this.apiUrl}/orders/totalSalesProduct`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error (res.message)
        }

        return res.data;
      }),
      catchError (this.handlerError)
    )
  }

  reportMaxSalesProduct(): Observable<ReportTotals[]>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<ReportTotals[]>>(`${this.apiUrl}/orders/maxSalesProduct`, {headers}).pipe(
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

  reportStatesOrders(): Observable<ReportTotals[]>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<ReportTotals[]>>(`${this.apiUrl}/orders/ordersForState`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error (res.message)
        }

        return res.data;
      }),
      catchError (this.handlerError)
    )
  }

  reportSalesCategories(): Observable<ReportTotals[]>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<ReportTotals[]>>(`${this.apiUrl}/orders/totalSalesCategory`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error (res.message)
        }

        return res.data;
      }),
      catchError (this.handlerError)
    )
  }

  reportMaxSalesCategories() : Observable<ReportTotals[]>
  {
    const token = this._authServices.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<ReportTotals[]>>(`${this.apiUrl}/orders/maxSalesCategory`, {headers}).pipe(
      map((res) => {

        if(!res.success)
        {
          throw Error(res.message);
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

        } catch
        {
          errorMsg = err.message;
        }
      }
    }

    return throwError(() => new Error(errorMsg));
  }
}
