import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddelivaddressComponent } from './adddelivaddress.component';

describe('AdddelivaddressComponent', () => {
  let component: AdddelivaddressComponent;
  let fixture: ComponentFixture<AdddelivaddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdddelivaddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdddelivaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
