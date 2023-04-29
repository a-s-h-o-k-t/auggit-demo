import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesalelistComponent } from './servicesalelist.component';

describe('ServicesalelistComponent', () => {
  let component: ServicesalelistComponent;
  let fixture: ComponentFixture<ServicesalelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesalelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesalelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
