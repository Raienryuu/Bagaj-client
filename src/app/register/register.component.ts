import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthorizationService} from '../services/authorization.service';
import {Router} from '@angular/router';
import {UserModel} from '../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user: any;
  constructor(private httpClient: HttpClient,
              private authorizationService: AuthorizationService,
              private router: Router) {
    this.user = new UserModel();
  }

  ngOnInit(): void {
  }

  RegisterNewUser(): void {
    this.authorizationService.registerNewUser(this.user)
      .subscribe(() => this.router.navigate(['login']), () => console.log('unable to create account'));
  }

}
