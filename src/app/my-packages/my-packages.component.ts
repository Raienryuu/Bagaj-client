import {Component, OnInit, ViewChild} from '@angular/core';
import {PackagesService} from '../services/packages.service';
import {PackageModel} from '../models/package.model';
import {MatTableDataSource} from '@angular/material/table';
import {AuthorizationService} from '../services/authorization.service';
import {MatPaginator} from '@angular/material/paginator';
import {UserModel} from '../models/user.model';
import {FormControl, Validators} from '@angular/forms';
import {BidsService} from '../services/bids.service';
import {Router} from '@angular/router';
import {RatingService} from '../services/rating.service';
import {RatingModel} from '../models/rating.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-packages',
  templateUrl: './my-packages.component.html',
  styleUrls: ['./my-packages.component.scss']
})

export class MyPackagesComponent implements OnInit {

  packagesList: any;
  tableData: MatTableDataSource<PackageModel>;
  detailedView: any;
  selectedPackage: any;
  senderUser: any;
  transporterUser: any;
  myUser: any;
  bidControl: any;
  newBid: any;
  ratingControl: any;
  scrollPos: any;
  pageControl: any;


  @ViewChild(MatPaginator) paginator: MatPaginator | any;


  constructor(private packagesService: PackagesService,
              private authorizationService: AuthorizationService,
              private bidsService: BidsService,
              private router: Router,
              private ratingService: RatingService,
              private snackBar: MatSnackBar
  ) {
    this.tableData = new MatTableDataSource<PackageModel>();

    this.pageControl = {currentPage: 1, pageSize: 6, itemCount: -1};

    this.ratingControl = new FormControl(5, [
      Validators.min(1),
    Validators.max(10)]);

    this.bidControl = new FormControl(1, [
      Validators.min(1)]);

  }

  ngOnInit(): void {

    this.GetUserPackagesCount();
    this.GetMyUser();
    this.senderUser = new UserModel();
    this.transporterUser = new UserModel();
    this.tableData.paginator = this.paginator;

    this.detailedView = false;
  }



  GetUserPackagesPage(): void {
    this.packagesService.GetUserPackagesPage(
      this.pageControl.currentPage,
      this.pageControl.pageSize)
      .subscribe(data => {this.packagesList = data;
      });
  }

  GetUserPackagesCount(): void {
    this.packagesService.GetUserPackagesCount()
      .subscribe(data => {this.pageControl.itemCount = data;
                          this.GetUserPackagesPage();
      });
  }

  openPackageDetails(row: any): void {
    this.selectedPackage = [];
    this.detailedView = true;

    row = Number(row);

    for (const p of this.packagesList) {
      if (p.id === row) {
        row = p;
        break;
      }
    }

    this.selectedPackage = row;

    this.bidControl.max = this.selectedPackage.lowestBid - 1;

    let temp = Number(row.id);

    this.authorizationService.getSenderUser(temp)
      .subscribe(data => this.senderUser = data);

    temp = Number(row.id);

    if (temp > 0 && row.lowestBidId > 0 && (
      row.senderId === this.myUser.id || row.transporterId === this.myUser.id
    )) {
      this.authorizationService.getTransporterUser(temp)
        .subscribe(data => this.transporterUser = data);
    }
  }

  calculateWeightUnit(weight: number): string {
    if (weight >= 1000){
      weight /= 1000;
      return weight + ' t';
    } else {
      return weight + ' kg';
    }
  }

  goBack(): void {
    this.detailedView = false;
  }

  cancelPackage(): void {
    const editPackage = new PackageModel();
    editPackage.Id = this.selectedPackage.id;
    this.packagesService.CancelMyPackage(editPackage)
      .subscribe(() => {this.snackBar
        .open('Anulowano przesyłkę', '', {
          duration: 3000, panelClass: ['red-snackbar'] });
                        this.goBack();
                        this.GetUserPackagesPage(); });
  }

  acceptTransporterPackage(): void {
    const editPackage = new PackageModel();
    editPackage.Id = this.selectedPackage.id;
    this.packagesService.AcceptTransporterPackage(
      editPackage).subscribe(() => {this.snackBar
      .open('Pomyślnie akceptowano przewoźnika', '', {
        duration: 3000, panelClass: ['green-snackbar'] });
                                    this.goBack();
                                    this.GetUserPackagesPage(); });
  }

  GetMyUser(): void {
    this.authorizationService.getMyUser()
      .subscribe(data => this.myUser = data);
  }

  AddNewBid(): void {
    this.newBid = {
      PackageId: this.selectedPackage.id,
      BidValue: this.bidControl.value,
    };
    this.bidsService.PostNewBid(this.newBid)
      .subscribe(() => {this.GetUserPackagesPage();
                        this.snackBar
          .open('Pomyślnie złożono oferte', '', {
            duration: 3000, panelClass: ['green-snackbar'] });
                        this.router.navigate(['/']); });
  }

  checkIfSender(): boolean {
    return this.selectedPackage.senderId === this.myUser.id;
  }

  checkIfPackagageGotAnyBid(): boolean {
    return this.selectedPackage.lowestBidId > 0;
  }

  checkIfSenderOrTransporter(): boolean {
    return this.selectedPackage.senderId === this.myUser.id
      || this.selectedPackage.transporterId === this.myUser.id;
  }

  checkDetailView(): boolean {
    return this.detailedView;
  }

  checkIfPackageOfferIsNoLongerOpen(): boolean{
    return this.selectedPackage.offerState !== 0;
  }

  GetStateDescription(offerState: number): string {
    if (offerState === 0){
      return 'Otwarta';
    } else if (offerState === 1){
      return 'W trakcie';
    } else if (offerState === 2){
      return 'Zakończona';
    } else if (offerState === 3) {
      return 'Oceniona';
    } else {
      return 'Anulowana';
    }
  }

  checkIfPackageIsInProgress(): boolean {
    return this.selectedPackage.offerState === 1;
  }

  ratePackage(): void {
    const rating = new RatingModel();
    rating.PackageId = this.selectedPackage.id;

    if (this.selectedPackage.senderId === this.myUser.id){

    rating.TransporterId = this.selectedPackage.transporterId;
    rating.RatedBySender = this.ratingControl.value;

    this.ratingService.RateAsSender(rating)
      .subscribe(() => {
        this.snackBar
        .open('Pomyślnie dodano ocene', '', {
          duration: 3000, panelClass: ['green-snackbar'] });
        this.detailedView = false;
      });
    } else if (this.selectedPackage.transporterId === this.myUser.id){
      rating.RatedByTransporter = this.ratingControl.value;

      this.ratingService.RateAsTransporter(rating)
        .subscribe(() => {this.snackBar
          .open('Pomyślnie dodano ocene', '', {
        duration: 3000, panelClass: ['green-snackbar'] });
                          this.detailedView = false;
        });
    }
  }

  checkIfPackageIsClosed(): boolean {
    return this.selectedPackage.offerState === 2;
  }

  // page buttons
  goToFirstPage(): void{
    this.pageControl.currentPage = 1;
    this.packagesList = [];
    this.GetUserPackagesPage();
  }
  goToLeftPage(): void{
    if (this.pageControl.currentPage > 1) {
      this.pageControl.currentPage -= 1;
      this.packagesList = [];
      this.GetUserPackagesPage();
    }
  }
  goToRightPage(): void{
    if (this.pageControl.currentPage <
      (this.pageControl.itemCount / this.pageControl.pageSize)) {
      this.pageControl.currentPage += 1;
      this.packagesList = [];
      this.GetUserPackagesPage();
    }
  }
  goToLastPage(): void{
    this.pageControl.currentPage = Math.floor(this.pageControl.itemCount / this.pageControl.pageSize + 1);
    this.packagesList = [];
    this.GetUserPackagesPage();
  }
}
