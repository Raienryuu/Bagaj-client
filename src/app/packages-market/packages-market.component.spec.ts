import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PackagesMarketComponent} from './packages-market.component';

describe('PackagesMarketComponent', () => {
  let component: PackagesMarketComponent;
  let fixture: ComponentFixture<PackagesMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagesMarketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagesMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
