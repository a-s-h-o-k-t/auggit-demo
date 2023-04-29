import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoserviceComponent } from './soservice.component';

describe('SoserviceComponent', () => {
  let component: SoserviceComponent;
  let fixture: ComponentFixture<SoserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoserviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
