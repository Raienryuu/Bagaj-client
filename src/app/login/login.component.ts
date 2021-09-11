import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../services/authorization.service';
import { TokenModel } from '../models/token.model';
import {UserModel} from '../models/user.model';
import {waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: any;
  token: any;

  constructor(private authorizationService: AuthorizationService,
              private router: Router) {
    this.token = new TokenModel();
    this.user = new UserModel();
    this.user.login = 'user1';
    this.user.password = 'haslo1';
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null){
      this.router.navigate(['/home']);
    }
  }


  loginButton(): void {
    this.authorizationService.loginUser(this.user.login, this.user.password)
      .subscribe(token => {this.token = token;
                           this.router.navigate(['/home']);
                           localStorage.setItem('token', this.token.token);
                             });

    // console.log(localStorage.getItem('token'));
    // console.log(this.token.token);
  }

}
