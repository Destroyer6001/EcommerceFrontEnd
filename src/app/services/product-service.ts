import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, map, throwError, pipe} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiResponse} from '../models/api-response';
import {Product} from '../models/product';
import {ProductDetails} from '../models/product-details';
import {Authservice} from './authservice';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = 'http://localhost:8086/api';

  constructor(private http: HttpClient, private _authService: Authservice) {}

  CreateProduct(product: Product): Observable<Product>
  {
    const token = this._authService.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/products`, product, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handlerError)
    );
  }

  IndexProduct():Observable<ProductDetails[]>
  {
    const token = this._authService.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<ProductDetails[]>>(`${this.apiUrl}/products/getAll`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handlerError)
    );
  }

  GetByIdProduct(id:number):Observable<Product>
  {
    const token = this._authService.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handlerError)
    );
  }

  UpdateProduct (id: number, product: Product): Observable<Product>
  {
    const token = this._authService.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`, product, {headers}).pipe(
      map((res) => {

        if (!res.success)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handlerError)
    );
  }

  DeleteProduct(id:number): Observable<Product>{

    const token = this._authService.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.delete<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`, {headers}).pipe(
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

  private handlerError(err: HttpErrorResponse)
  {
    let errorMsg = 'error desconocido';

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
