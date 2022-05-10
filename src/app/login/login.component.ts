import {Component, OnInit} from '@angular/core';
import {AuthorizationService} from '../services/authorization.service';
import {TokenModel} from '../models/token.model';
import {UserModel} from '../models/user.model';
import {Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: any;
  token: any;
  loginControl: FormControl;
  pwControl: FormControl;

  constructor(private authorizationService: AuthorizationService,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.token = new TokenModel();
    this.user = new UserModel();

    this.loginControl = new FormControl(this.user.login, [
      Validators.required,
      Validators.minLength(1)]
    );

    this.pwControl = new FormControl(this.user.password, [
      Validators.required,
      Validators.minLength(1)]
    );

    this.user.login = 'user5';
    this.user.password = 'haslo5';
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null){
      this.router.navigate(['/home']);
    }
  }


  loginButton(): void {
    if (this.loginControl.valid && this.pwControl.valid){
      this.user = {
        login: this.loginControl.value,
        password: this.pwControl.value
      };

      this.authorizationService.loginUser(this.user.login, this.user.password)
        .subscribe(token => {
                              this.token = token;
                              this.router.navigate(['/home']);
                              localStorage.setItem('token', this.token.token);
    }, err => (this.snackBar.open('Nieprawidłowa nazwa użytkownika lub hasło', '', {
            duration: 3000, panelClass: ['red-snackbar'] }))
        );
    }
  }

}
