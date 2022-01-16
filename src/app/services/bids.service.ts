import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BidModel} from '../models/bid.model';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BidsService {

  constructor(private httpClient: HttpClient) { }

  PostNewBid(bidModel: BidModel): Observable<any>{
    return this.httpClient.post(environment.api +
      'bids/' + localStorage.getItem('token'), bidModel);
  }
}
