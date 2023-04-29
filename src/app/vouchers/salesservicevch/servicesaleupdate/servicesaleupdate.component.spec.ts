import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesaleupdateComponent } from './servicesaleupdate.component';

describe('ServicesaleupdateComponent', () => {
  let component: ServicesaleupdateComponent;
  let fixture: ComponentFixture<ServicesaleupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesaleupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesaleupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
