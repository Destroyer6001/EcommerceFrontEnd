import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, map, throwError, pipe} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiResponse} from '../models/api-response';
import {Authservice} from './authservice';
import {Category} from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class Categoryservice {

  private apiUrl = 'http://localhost:8086/api';

  constructor(private http: HttpClient, private _authService: Authservice) {
  }

  CreateCategory(category: Category): Observable<Category> {
    const token = this._authService.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/categories`, category, {headers}).pipe(
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

  IndexCategory(): Observable<Category[]> {
    const token = this._authService.getToken();
    const headers = new HttpHeaders({'content-type': 'application/json', Authorization: `Bearer ${token}`});
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`, {headers}).pipe(
      map((res) => {
        if (!res.success)
        {
          throw Error(res.message);
        }
        console.log(res.data);
        return res.data;
      }),
      catchError(this.handlerError)
    )
  }

  FindByIdCategory(id: number): Observable<Category> {
    const token = this._authService.getToken();
    const headers = new HttpHeaders({'content-type': 'application/json', Authorization: `Bearer ${token}`});

    return  this.http.get<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`, {headers}).pipe(
      map((res) => {
        if (!res.success)
        {
          throw Error (res.message)
        }

        return res.data;
      }),
      catchError(this.handlerError)
    )
  }

  UpdateCategory(category: Category, id: number): Observable<Category> {
    const token = this._authService.getToken();
    const headers = new HttpHeaders({'content-type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`, category, {headers}).pipe(
      map ((res) => {
        if (!res.success)
        {
          throw Error (res.message);
        }

        return res.data;
      }),

      catchError(this.handlerError)
    )
  }

  DeleteCategory(id: number): Observable<Category> {
    const token = this._authService.getToken();
    const headers = new HttpHeaders({'content-type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.delete<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`, {headers}).pipe(
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

  private handlerError(error: HttpErrorResponse) {

    let errorMsg = "error desconocido";

    if (error.error instanceof ErrorEvent)
    {
      errorMsg = `Error de cliente: ${error.error.message}`;
    }
    else if (!error.error)
    {
      errorMsg = error.message;
    }
    else
    {
      if (typeof error.error === 'string')
      {
        try
        {
          const parsed = JSON.parse(error.error);
          errorMsg = parsed.message;
        }
        catch
        {
          errorMsg = error.error;
        }
      }
    }

    return throwError(() => new Error(errorMsg));
  }

}
