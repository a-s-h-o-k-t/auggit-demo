import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesaleComponent } from './servicesale.component';

describe('ServicesaleComponent', () => {
  let component: ServicesaleComponent;
  let fixture: ComponentFixture<ServicesaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
