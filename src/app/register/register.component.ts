import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthorizationService} from '../services/authorization.service';
import {Router} from '@angular/router';
import {UserModel} from '../models/user.model';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user: any;
  loginAvailable: boolean;
  serverResponse: boolean;
  loginControl: FormControl;
  pwControl: FormControl;
  nameControl: FormControl;
  lastnameControl: FormControl;
  contactinfoControl: FormControl;

  constructor(private httpClient: HttpClient,
              private authorizationService: AuthorizationService,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.user = new UserModel();
    this.loginAvailable = true;
    this.serverResponse = true;

    this.loginControl = new FormControl(this.user.login, [
      Validators.required,
      Validators.minLength(6)]
    );

    this.pwControl = new FormControl(this.user.password, [
      Validators.required,
      Validators.minLength(3)]
    );

    this.nameControl = new FormControl(this.user.name, [
      Validators.required,
      Validators.minLength(1)]
    );

    this.lastnameControl = new FormControl(this.user.lastname, [
      Validators.required,
      Validators.minLength(1)]
    );

    this.contactinfoControl = new FormControl(this.user.contactinfo, [
      Validators.required,
      Validators.minLength(1)]
    );



  }

  ngOnInit(): void {
  }

  RegisterNewUser(): void {

    if (this.loginControl.valid && this.pwControl.valid && this.nameControl.valid
    && this.lastnameControl.valid && this.contactinfoControl.valid){
      this.user = {
        login: this.loginControl.value,
        password: this.pwControl.value,
        name: this.nameControl.value,
        lastname: this.lastnameControl.value,
        contactinfo: this.contactinfoControl.value
      };

      this.serverResponse = true;
      this.loginAvailable = true;

      this.authorizationService.isLoginAvailable(this.user.login)
        .subscribe(() => {this.loginAvailable = false;
                          this.loginControl.setErrors({loginAvailable: false});
                          return; },
          () => this.authorizationService.registerNewUser(this.user)
          .subscribe(() => this.router.navigate(['login']).then(() =>
              this.snackBar
                .open('Rejestracja przebiegła pomyślnie', '', {
                  duration: 3000, panelClass: ['purple-snackbar']
                })),
            () => this.serverResponse = false) );

    }

  }

}
