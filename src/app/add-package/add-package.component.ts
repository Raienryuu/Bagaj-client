import {Component, OnInit} from '@angular/core';
import {PackageModel} from '../models/package.model';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AuthorizationService} from '../services/authorization.service';
import {PackagesService} from '../services/packages.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.scss']
})
export class AddPackageComponent implements OnInit {

  package: any;

  firstFormGroup: any;
  secondFormGroup: any;
  thirdFormGroup: any;
  fourthFormGroup: any;

  commentControl: any;
  distanceControl: any;

  constructor(private authorizationService: AuthorizationService,
              private packagesService: PackagesService,
              private router: Router,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) {
    this.package = new PackageModel();

    this.package.StartVoivodeship = 'dolnośląskie';
    this.package.EndVoivodeship = 'dolnośląskie';
  }

  ngOnInit(): void {

    this.firstFormGroup = this.formBuilder.group({
      firstVoivodeshipControl: ['dolnośląskie', Validators.required],
      firstPostalControl: ['', Validators.required],
      firstCityControl: ['', Validators.required],
      firstAddressControl: ['', Validators.required],

    });
    this.secondFormGroup = this.formBuilder.group({
      secondVoivodeshipControl: ['dolnośląskie', Validators.required],
      secondPostalControl: ['', Validators.required],
      secondCityControl: ['', Validators.required],
      secondAddressControl: ['', Validators.required],
    });
    this.thirdFormGroup = this.formBuilder.group({
      weightControl: [1, Validators.min(0.000001)],
      dimensionControl: ['5m x 1m x 2cm', Validators.required],
      senderHelpsControl: [false, Validators.required],
    });
    this.fourthFormGroup = this.formBuilder.group({
      commentControl: new FormControl(),
      distanceControl: [1, Validators.min(1)],
    });

  }

  AddPackage(): void {

    this.package = {
      StartVoivodeship: this.firstFormGroup.controls.firstVoivodeshipControl.value,
      StartPostCode: this.firstFormGroup.controls.firstPostalControl.value,
      StartCity: this.firstFormGroup.controls.firstCityControl.value,
      StartStreetAddress: this.firstFormGroup.controls.firstAddressControl.value,

      EndVoivodeship: this.secondFormGroup.controls.secondVoivodeshipControl.value,
      EndPostCode: this.secondFormGroup.controls.secondPostalControl.value,
      EndCity: this.secondFormGroup.controls.secondCityControl.value,
      EndStreetAddress: this.secondFormGroup.controls.secondAddressControl.value,

      Weight: this.thirdFormGroup.controls.weightControl.value,
      Dimensions: this.thirdFormGroup.controls.dimensionControl.value,
      SenderHelp: this.thirdFormGroup.controls.senderHelpsControl.value,
      Comment: this.fourthFormGroup.controls.commentControl.value,
      ApproximateDistance: this.fourthFormGroup.controls.distanceControl.value,

    };


    const tok = String(localStorage.getItem('token'));
    this.packagesService.AddPackage(tok, this.package)
      .subscribe(() => {
        this.snackBar
          .open('Pomyślnie dodano przesyłkę', 'Ok', {
            duration: 3000, panelClass: ['green-snackbar'] });
        this.router.navigate(['/']);
      });
  }
}
