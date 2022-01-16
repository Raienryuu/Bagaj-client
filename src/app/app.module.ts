import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {RegisterComponent} from './register/register.component';
import {HttpClientModule} from '@angular/common/http';
import {AuthorizationService} from './services/authorization.service';
import {HomeComponent} from './home/home.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSidenavModule} from '@angular/material/sidenav';
import {AddPackageComponent} from './add-package/add-package.component';
import {MatIconModule} from '@angular/material/icon';
import {MyPackagesComponent} from './my-packages/my-packages.component';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';
import {PackagesMarketComponent} from './packages-market/packages-market.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AddPackageComponent,
    MyPackagesComponent,
    PackagesMarketComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    HttpClientModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatIconModule,
    MatTableModule,
    MatGridListModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSnackBarModule,
  ],
  providers: [AuthorizationService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
