import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoserviceComponent } from './poservice.component';

describe('PoserviceComponent', () => {
  let component: PoserviceComponent;
  let fixture: ComponentFixture<PoserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoserviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
