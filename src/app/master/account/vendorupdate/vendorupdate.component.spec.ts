import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorupdateComponent } from './vendorupdate.component';

describe('VendorupdateComponent', () => {
  let component: VendorupdateComponent;
  let fixture: ComponentFixture<VendorupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
