import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, map, throwError, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';
import {ApiResponse} from '../models/api-response';
import {DecodedToken} from '../models/decoded-token';
import {LoginRequest} from '../models/login-request'
import {RegisterUser} from '../models/register-user';
import {UserDetails} from '../models/user-details';

@Injectable({
  providedIn: 'root',
})
export class Authservice {

  private apiUrl = "http://localhost:8086/api";
  private tokenKey =  "token";
  private userIdKey = "user_id";
  private roleKey = "role_user";

  constructor(private http: HttpClient) {}

  Login(data: LoginRequest) : Observable<string> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/users/login`, data).pipe(
      map((res) => {

        let token = "";

        if (!res.success) {
          throw new Error(res.message);
        }

        if (res.success)
        {
          token = res.data;
          const decoded = jwtDecode<DecodedToken>(token);

          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem(this.userIdKey, decoded.id.toString());
          localStorage.setItem(this.roleKey, decoded.rol)
        }

        return token;

      }),
      catchError(this.handleError)
    );
  }

  Register(data: RegisterUser) : Observable<RegisterUser>
  {
    return this.http.post<ApiResponse<RegisterUser>>(`${this.apiUrl}/users/register`, data).pipe(
      map((res)=> {

        if (!res.success)
        {
          throw Error(res.message);
        }

        return res.data;
      }) ,
      catchError(this.handleError)
    );
  }

  findAdminsUsers(): Observable<UserDetails[]>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<UserDetails[]>>(`${this.apiUrl}/users`, {headers}).pipe(
      map((res) => {
        if (!res.success)
        {
          throw Error(res.message);
        }

        console.log(res.data);
        return res.data;
      }),
      catchError(this.handleError)
    );
  }

  deleteAdminUser(id: number) : Observable<UserDetails>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.delete<ApiResponse<UserDetails>>(`${this.apiUrl}/users/${id}`, {headers}).pipe(
      map((res) => {
        if (!res.success)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handleError)
    );
  }

  GetUserId(id: number) : Observable<UserDetails>
  {
    const token = this.getToken();
    console.log(token);
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Accept', 'application/json');

    return this.http.get<ApiResponse<UserDetails>>(`${this.apiUrl}/users/userInfo/${id}`, {headers}).pipe(
      map((res) => {
        console.log(res);
        if (!res.success)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  UpdateUser(id: number, data: RegisterUser) : Observable<RegisterUser> {
    const token = this.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});
    return this.http.put<ApiResponse<RegisterUser>>(`${this.apiUrl}/users/editUser/${id}`, data, {headers}).pipe(
      map((res) => {
        if (!res.success)
        {
          throw Error(res.message);
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  getDeliveriesUser():Observable<UserDetails[]>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`});

    return this.http.get<ApiResponse<UserDetails[]>>(`${this.apiUrl}/users/getAllDeliveries`, {headers}).pipe(
      map((res) => {
        if (!res.success)
        {
          throw Error (res.message);
        }

        return res.data;
      }),
      catchError(this.handleError)
    )
  }

  logout() : void
  {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.roleKey);
  }

  getToken() :string | null
  {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId() : string | null
  {
    return localStorage.getItem(this.userIdKey);
  }

  getRole() : string | null
  {
    return localStorage.getItem(this.roleKey);
  }

  IsLoggedIn(): boolean
  {
    const token = this.getToken();
    if (!token) return false;

    try
    {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded && decoded.exp)
      {
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now)
        {
          this.logout();
          return false;
        }
      }
    }
    catch
    {
      return false;
    }

    return true;
  }

  private handleError(error: HttpErrorResponse)
  {
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
        if (typeof error.error === "string")
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
