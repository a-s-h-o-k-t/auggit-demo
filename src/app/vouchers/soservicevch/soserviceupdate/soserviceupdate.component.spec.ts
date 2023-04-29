import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoserviceupdateComponent } from './soserviceupdate.component';

describe('SoserviceupdateComponent', () => {
  let component: SoserviceupdateComponent;
  let fixture: ComponentFixture<SoserviceupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoserviceupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoserviceupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
