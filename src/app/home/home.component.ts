import {Component, OnInit} from '@angular/core';
import {AuthorizationService} from '../services/authorization.service';
import {Router} from '@angular/router';
import {UserModel} from '../models/user.model';
import {PackagesService} from '../services/packages.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userData: any;

  userChoice: number;
  sidenavOpen: boolean;


  constructor(private authorizationService: AuthorizationService,
              private packagesService: PackagesService,
              private router: Router,
              private snackBar: MatSnackBar) {

    this.userChoice = 3; // TODO: zmienić na 2
    this.sidenavOpen = false;
  }

  ngOnInit(): void {

    if (localStorage.getItem('token') == null){
      this.router.navigate(['login']).then();
      return;
    }

    this.userData = new UserModel();

    this.authorizationService.getMyUser()
      .subscribe(data => this.userData = data);
  }

  logout(): void {
    this.authorizationService.logout(
      localStorage.getItem('token'))
      .subscribe(() => {
        localStorage.removeItem('token');
        this.router.navigate(['login']).then(r => this.snackBar
          .open('Pomyślne wylogowanie', 'Ok', {
            duration: 3000 }));
      });
  }




  AddPackage(): void {
    this.userChoice = 1;
    this.sidenavOpen = false;
  }

  GetUserPackages(): void {
    this.sidenavOpen = false;
    this.userChoice = 3;
  }

  GetMarketPackages(): void {
    this.sidenavOpen = false;
    this.userChoice = 2;
  }
}
