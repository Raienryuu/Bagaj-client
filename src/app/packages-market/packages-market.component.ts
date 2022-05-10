import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PackageModel} from '../models/package.model';
import {PackagesService} from '../services/packages.service';
import {AuthorizationService} from '../services/authorization.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {BidsService} from '../services/bids.service';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {UserModel} from '../models/user.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-packages-market',
  templateUrl: './packages-market.component.html',
  styleUrls: ['./packages-market.component.scss']
})
export class PackagesMarketComponent implements OnInit {

  packagesList: any;
  filteredList: any;
  tableData: MatTableDataSource<PackageModel>;
  displayedColumns: string[];
  detailedView: any;
  selectedPackage: any;
  selectedUser: any;
  bidControl: any;
  newBid: any;
  pageControl: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  filtersGroup: any;

  constructor(private packagesService: PackagesService,
              private bidsService: BidsService,
              private authorizationService: AuthorizationService,
              private router: Router,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar
  ) {

    this.selectedUser = new UserModel();

    this.pageControl = {currentPage: 1, pageSize: 6, itemCount: -1};


    this.tableData = new MatTableDataSource<PackageModel>();

    this.displayedColumns = ['odleglosc', `wojewodztwoS`, `miejscowoscS`, `waga`, `wymiary`, `senderHelp`, `lowestBid`, `wojewodztwoE`, `miejscowoscE`];

    this.bidControl = new FormControl(1, [
      Validators.required,
      Validators.min(1)]);

    this.filtersGroup = this.formBuilder.group({
      startVoivoControl: [''],
      endVoivoControl: [''],
      distanceControl: ['', Validators.min(1)],
      weightLimitControl: ['', Validators.min(1)],
      weightLimitControl2: ['', Validators.min(1)],
    });

  }

  ngOnInit(): void {
    this.GetMarketPackagesCount();
    this.detailedView = false; // tu false powinno
  }


  GetMarketPackagesPage(): void {

    let voiS = this.filtersGroup.controls.startVoivoControl.value;
    let voiE = this.filtersGroup.controls.endVoivoControl.value;
    let dist = this.filtersGroup.controls.distanceControl.value;
    let weightLimitTo = this.filtersGroup.controls.weightLimitControl.value;
    let weightLimitFrom = this.filtersGroup.controls.weightLimitControl2.value;

    if (this.filtersGroup.controls.startVoivoControl.value === ''){
      voiS = '';
    }
    if (this.filtersGroup.controls.endVoivoControl.value === ''){
      voiE = '';
    }
    if (this.filtersGroup.controls.distanceControl.value === '' || this.filtersGroup.controls.distanceControl.value == null){
      dist = -1;
    }
    if (this.filtersGroup.controls.weightLimitControl.value === '' || this.filtersGroup.controls.weightLimitControl.value == null){
      weightLimitTo = -1;
    }
    if (this.filtersGroup.controls.weightLimitControl2.value === '' || this.filtersGroup.controls.weightLimitControl2.value  == null){
      weightLimitFrom = -1;
    }

    this.packagesService.GetMarketPackagesPage(
      this.pageControl.currentPage,
      this.pageControl.pageSize,
      voiS,
      voiE,
      dist,
      weightLimitTo,
      weightLimitFrom)
      .subscribe(data => {this.packagesList = data;
      });
  }

  GetMarketPackagesCount(): void {
    let voiS = this.filtersGroup.controls.startVoivoControl.value;
    let voiE = this.filtersGroup.controls.endVoivoControl.value;
    let dist = this.filtersGroup.controls.distanceControl.value;
    let weightLimitTo = this.filtersGroup.controls.weightLimitControl.value;
    let weightLimitFrom = this.filtersGroup.controls.weightLimitControl2.value;

    if (this.filtersGroup.controls.startVoivoControl.value === ''){
      voiS = '';
    }
    if (this.filtersGroup.controls.endVoivoControl.value === ''){
      voiE = '';
    }
    if (this.filtersGroup.controls.distanceControl.value === '' || this.filtersGroup.controls.distanceControl.value == null){
      dist = -1;
    }
    if (this.filtersGroup.controls.weightLimitControl.value === '' || this.filtersGroup.controls.weightLimitControl.value == null){
      weightLimitTo = -1;
    }
    if (this.filtersGroup.controls.weightLimitControl2.value === '' || this.filtersGroup.controls.weightLimitControl2.value  == null){
      weightLimitFrom = -1;
    }

    this.packagesService.GetMarketPackagesCount(voiS,
      voiE,
      dist,
      weightLimitTo,
      weightLimitFrom)
      .subscribe(data => {this.pageControl.itemCount = data;
                          this.GetMarketPackagesPage();
      });
  }

  openPackageDetails(row: any): void {
    this.detailedView = true;
    this.selectedPackage = [];

    row = Number(row);

    for (const p of this.packagesList) {
      if (p.id === row) {
        row = p;
        break;
      }
    }

    this.selectedPackage = row;

    this.bidControl.max = this.selectedPackage.lowestBid - 1;

    const temp = Number(row.senderId);

    this.authorizationService.getUserDataById(temp)
      .subscribe(data => this.selectedUser = data);
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

  AddNewBid(): void {
    this.newBid = {
      PackageId: this.selectedPackage.id,
      BidValue: this.bidControl.value,
    };
    this.bidsService.PostNewBid(this.newBid)
      .subscribe(() => {this.GetMarketPackagesPage();
                        this.router.navigate(['/']).then(() => this.snackBar
                          .open('Pomyślnie dodano oferte', '', {
                            duration: 3000, panelClass: ['green-snackbar'] })); });
  }

  FilterPackages(): void {
    if (!this.filtersGroup.valid) {
      return;
    }

    this.pageControl.currentPage = 1;
    this.packagesList = [];

    this.GetMarketPackagesCount();

  }

  // page buttons
  goToFirstPage(): void{
    this.pageControl.currentPage = 1;
    this.packagesList = [];
    this.GetMarketPackagesPage();
  }
  goToLeftPage(): void{
    if (this.pageControl.currentPage > 1) {
      this.pageControl.currentPage -= 1;
      this.packagesList = [];
      this.GetMarketPackagesPage();
    }
  }
  goToRightPage(): void{
    if (this.pageControl.currentPage <
      (this.pageControl.itemCount / this.pageControl.pageSize)) {
      this.pageControl.currentPage += 1;
      this.packagesList = [];
      this.GetMarketPackagesPage();
    }
  }
  goToLastPage(): void{
    this.pageControl.currentPage = Math.floor(this.pageControl.itemCount / this.pageControl.pageSize + 1);
    this.packagesList = [];
    this.GetMarketPackagesPage();
  }

}
