import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SovoucherComponent } from './sovoucher.component';

describe('SovoucherComponent', () => {
  let component: SovoucherComponent;
  let fixture: ComponentFixture<SovoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SovoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SovoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
