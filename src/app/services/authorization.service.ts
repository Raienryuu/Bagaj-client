import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {TokenModel} from '../models/token.model';
import { UserModel} from '../models/user.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  loginUser(login: string, password: string): Observable<TokenModel> {
    // Add safe, URL encoded search parameter if there is a search term
    const options = new HttpParams()
          .set('login', login)
          .set('password', password);

    // console.log(options);


    return this.httpClient.get<TokenModel>(environment.api + 'authorization',
      {params: options});
  }

  registerNewUser(userData: UserModel): Observable<any>{
    return this.httpClient.post<Observable<any>>(environment.api + 'authorization',
      userData);
  }

  logout(token: string | null): Observable<any>{
    return this.httpClient.delete(environment.api + 'authorization/logout/' + token);
  }

  getSimpleData(): Observable<UserModel> {
    const options = new HttpParams()
      .set('token', localStorage.getItem('token') as string);
    return this.httpClient.get<UserModel>(`${environment.api}values`,
      {params: options});
  }
}
