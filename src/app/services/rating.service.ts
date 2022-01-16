import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {RatingModel} from '../models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private httpClient: HttpClient
  ) { }

  RateAsSender(ratingModel: RatingModel): Observable<any> {
    return this.httpClient.post(environment.api +
      'ratings/rateAndCloseOffer/'
      + localStorage.getItem('token'), ratingModel);
  }

  RateAsTransporter(ratingModel: RatingModel): Observable<any> {
    return this.httpClient.put(environment.api +
      'ratings/rateAsTransporter/'
      + localStorage.getItem('token'), ratingModel);
  }
}
