import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasevtypeComponent } from './purchasevtype.component';

describe('PurchasevtypeComponent', () => {
  let component: PurchasevtypeComponent;
  let fixture: ComponentFixture<PurchasevtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasevtypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasevtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
