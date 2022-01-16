import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {TokenModel} from '../models/token.model';
import {UserModel} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private httpClient: HttpClient) {
  }

  loginUser(login: string, password: string): Observable<TokenModel> {
    // Add safe, URL encoded search parameter if there is a search term
    const options = new HttpParams()
          .set('login', login)
          .set('password', password);

    return this.httpClient.get<TokenModel>(environment.api + 'authorization',
      {params: options});
  }

  registerNewUser(userData: UserModel): Observable<any>{
    return this.httpClient.post<Observable<any>>(environment.api + 'authorization',
      userData);
  }

  logout(token: string | null): Observable<any>{
    return this.httpClient.delete(environment.api +
      'authorization/logout/' + token);
  }

  isLoginAvailable(login: string | null): Observable<any>{
    return this.httpClient.get(environment.api +
      'authorization/checkUsername/' + login);
  }

  getUserDataById(id: number | null): Observable<any>{
    return this.httpClient.get(environment.api +
    'Authorization/getUsername/' + id);
  }

  getSenderUser(packageId: number | null): Observable<any>{
    return this.httpClient.get(environment.api +
      'Authorization/getSenderUser/' + packageId
    + '/' + localStorage.getItem('token'));
  }

  getTransporterUser(packageId: number | null): Observable<any>{
    return this.httpClient.get(environment.api +
      'Authorization/getTransporterUser/' + packageId
      + '/' + localStorage.getItem('token'));
  }

  getMyUser(): Observable<any>{
    return this.httpClient.get(environment.api +
      'Authorization/getMyUser/'
      + localStorage.getItem('token'));
  }

  getSimpleData(): Observable<UserModel> {
    const options = new HttpParams()
      .set('token', localStorage.getItem('token') as string);
    return this.httpClient.get<UserModel>(`${environment.api}values`,
      {params: options});
  }
}
