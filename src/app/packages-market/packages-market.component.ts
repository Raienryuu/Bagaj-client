import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PackageModel} from '../models/package.model';
import {PackagesService} from '../services/packages.service';
import {AuthorizationService} from '../services/authorization.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {BidsService} from '../services/bids.service';
import {Router} from '@angular/router';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
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
    });

  }

  ngOnInit(): void {
    this.GetPackages();
    this.tableData.paginator = this.paginator;
    this.detailedView = false; // tu false powinno
  }

  GetPackages(): void {
    this.packagesService.GetMarketPackages()
      .subscribe(data => {this.packagesList = data;
                          this.paginator.length = this.packagesList.length;
                          this.filteredList = this.packagesList;
                          this.RefreshPage();
      });
  }

  openPackageDetails(row: any): void {
    this.detailedView = true;
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
      .subscribe(() => {this.GetPackages();
                        this.router.navigate(['/']).then(() => this.snackBar
                          .open('Pomyślnie dodano oferte', 'Ok', {
                            duration: 3000 })); });
  }

  ChangePage(p: PageEvent): void{
    this.tableData.data = this.filteredList.slice(
      this.paginator.pageIndex * this.paginator.pageSize,
      this.paginator.pageIndex * this.paginator.pageSize + this.paginator.pageSize);
  }

  RefreshPage(): void{
    this.tableData.data = [];
    this.tableData.data = this.filteredList.slice(
      this.paginator.pageIndex * this.paginator.pageSize,
      this.paginator.pageIndex * this.paginator.pageSize + this.paginator.pageSize);
  }

  FilterPackages(): void {
    if (!this.filtersGroup.valid) {
      return;
    }

    this.filteredList = this.packagesList;

    if (this.filtersGroup.controls.startVoivoControl.value) {
      let startVoi = this.filtersGroup.controls.startVoivoControl.value;
      if (startVoi === 'brak') {
        startVoi = '';
      }
      if (startVoi !== '') {
        this.filteredList = this.filteredList.filter(
          (pack: { startVoivodeship: any; }) => pack.startVoivodeship === startVoi);
      }
    }

    if (this.filtersGroup.controls.endVoivoControl.value) {
      let endVoi = this.filtersGroup.controls.endVoivoControl.value;
      if (endVoi === 'brak') {
        endVoi = '';
      }
      if (endVoi !== '') {
        this.filteredList = this.filteredList.filter(
          (pack: { endVoivodeship: any; }) => pack.endVoivodeship === endVoi);
      }
    }

    if (this.filtersGroup.controls.distanceControl.value){
      const maxDist = this.filtersGroup.controls.distanceControl.value;
      if (maxDist >= 1){
        this.filteredList = this.filteredList.filter(
          (pack: { approximateDistance: any; }) => pack.approximateDistance <= maxDist);
      }
    }

    if (this.filtersGroup.controls.weightLimitControl.value){
      const maxWeight = this.filtersGroup.controls.weightLimitControl.value;
      if (maxWeight >= 1){
        this.filteredList = this.filteredList.filter(
          (pack: { weight: any; }) => pack.weight <= maxWeight);
      }
    }

    this.paginator.length = this.filteredList.length;

    this.RefreshPage();
  }



}
