import {Component, OnInit, ViewChild} from '@angular/core';
import {PackagesService} from '../services/packages.service';
import {PackageModel} from '../models/package.model';
import {MatTableDataSource} from '@angular/material/table';
import {AuthorizationService} from '../services/authorization.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
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
  displayedColumns: string[];
  detailedView: any;
  selectedPackage: any;
  senderUser: any;
  transporterUser: any;
  myUser: any;
  bidControl: any;
  newBid: any;
  ratingControl: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  constructor(private packagesService: PackagesService,
              private authorizationService: AuthorizationService,
              private bidsService: BidsService,
              private router: Router,
              private ratingService: RatingService,
              private snackBar: MatSnackBar
  ) {
    this.tableData = new MatTableDataSource<PackageModel>();

    this.ratingControl = new FormControl(5, [
      Validators.min(1),
    Validators.max(10)]);

    this.bidControl = new FormControl(1, [
      Validators.min(1)]);

    this.displayedColumns = ['odleglosc', `wojewodztwoS`, `miejscowoscS`, `waga`, `wymiary`, `senderHelp`, `lowestBid`, `wojewodztwoE`, `miejscowoscE`, 'stanPaczki'];
  }

  ngOnInit(): void {
    this.GetUserPackages();
    this.GetMyUser();
    this.senderUser = new UserModel();
    this.transporterUser = new UserModel();
    this.tableData.paginator = this.paginator;

    this.detailedView = false; // tu false
  }

  GetUserPackages(): void {
    this.packagesService.GetUserPackages()
      .subscribe(data => {this.packagesList = data;
                          this.paginator.length = this.packagesList.length;
                          this.tableData.data = this.packagesList;
      });
  }

  openPackageDetails(row: any): void {
    this.selectedPackage = [];
    this.detailedView = true;
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
    this.tableData.paginator = this.paginator;
    this.detailedView = false;
  }

  cancelPackage(): void {
    const editPackage = new PackageModel();
    editPackage.Id = this.selectedPackage.id;
    this.packagesService.CancelMyPackage(editPackage)
      .subscribe(() => {this.snackBar
        .open('Anulowano przesyłkę', 'Ok', {
          duration: 3000 });
                        this.goBack();
                        this.GetUserPackages(); });
  }

  acceptTransporterPackage(): void {
    const editPackage = new PackageModel();
    editPackage.Id = this.selectedPackage.id;
    this.packagesService.AcceptTransporterPackage(
      editPackage).subscribe(() => {this.snackBar
      .open('Pomyślnie akceptowano przewoźnika', 'Ok', {
        duration: 3000 });
                                    this.goBack();
                                    this.GetUserPackages(); });
  }

  GetMyUser(): void {
    this.authorizationService.getMyUser()
      .subscribe(data => this.myUser = data);
  }

  ChangePage(p: PageEvent): void{
    this.tableData.data = this.packagesList.slice(
      this.paginator.pageIndex * this.paginator.pageSize,
      this.paginator.pageIndex * this.paginator.pageSize + this.paginator.pageSize);
  }

  AddNewBid(): void {
    this.newBid = {
      PackageId: this.selectedPackage.id,
      BidValue: this.bidControl.value,
    };
    this.bidsService.PostNewBid(this.newBid)
      .subscribe(() => {this.GetUserPackages();
                        this.snackBar
          .open('Pomyślnie złożono oferte', 'Ok', {
            duration: 3000 });
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
        .open('Pomyślnie dodano ocene', 'Ok', {
          duration: 3000 });
        this.detailedView = false;
      });
    } else if (this.selectedPackage.transporterId === this.myUser.id){
      rating.RatedByTransporter = this.ratingControl.value;

      this.ratingService.RateAsTransporter(rating)
        .subscribe(() => {this.snackBar
          .open('Pomyślnie dodano ocene', 'Ok', {
        duration: 3000 });
                          this.detailedView = false;
        });
    }
  }

  checkIfPackageIsClosed(): boolean {
    return this.selectedPackage.offerState === 2;
  }
}
