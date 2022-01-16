import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PackageModel} from '../models/package.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackagesService {

  constructor(private httpClient: HttpClient) { }

  GetUserPackages(): Observable<PackageModel> {
    return this.httpClient.get<PackageModel>(
      environment.api + 'packages/releated/'
      + localStorage.getItem('token'));
  }

  GetMarketPackages(): Observable<PackageModel> {
    return this.httpClient.get<PackageModel>(
      environment.api + 'packages/market/'
      + localStorage.getItem('token'));
  }

  AddPackage(token: string, packageModel: PackageModel):
    Observable<any> {
    return this.httpClient.post(environment.api +
      'packages/' + token, packageModel);
  }

  CancelMyPackage(packageModel: PackageModel):
    Observable<any> {
    return this.httpClient.put(environment.api +
    'packages/cancel/' + localStorage.getItem('token'),
      packageModel);
  }

  AcceptTransporterPackage(packageModel: PackageModel):
    Observable<any> {
    return this.httpClient.put(environment.api +
      'packages/accept/' + localStorage.getItem('token'),
      packageModel);
  }
}
