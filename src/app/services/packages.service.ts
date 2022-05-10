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

  GetUserPackagesPage(page: string, pageSize: string): Observable<PackageModel> {
    return this.httpClient.get<PackageModel>(
      environment.api + 'packages/releatedP/'
      + localStorage.getItem('token'), {
        params: {page, size: pageSize}});
  }

  GetUserPackagesCount(): Observable<number> {
    return this.httpClient.get<number>(environment.api +
      'packages/releatedCount/' + localStorage.getItem('token'));
  }

  GetMarketPackages(): Observable<PackageModel> {
    return this.httpClient.get<PackageModel>(
      environment.api + 'packages/market/'
      + localStorage.getItem('token'));
  }

  GetMarketPackagesPage(page: string, pageSize: string, voiS: any,
                        voiE: any, dist: any,
                        weightLimitTo: any, weightLimitFrom: any
                        ): Observable<PackageModel> {

    return this.httpClient.get<PackageModel>(
      environment.api + 'packages/marketP/'
      + localStorage.getItem('token'), {
        params: {page, size: pageSize, voiS, voiE, dist,
        weightLimitTo, weightLimitFrom}});
  }

  GetMarketPackagesCount(voiS: any, voiE: any, dist: any,
                         weightLimitTo: any, weightLimitFrom: any
  ): Observable<number> {
    return this.httpClient.get<number>(environment.api +
      'packages/marketCount/' + localStorage.getItem('token'), {
      params: {voiS, voiE, dist,
        weightLimitTo, weightLimitFrom}});
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
