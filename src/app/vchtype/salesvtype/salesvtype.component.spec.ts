import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesvtypeComponent } from './salesvtype.component';

describe('SalesvtypeComponent', () => {
  let component: SalesvtypeComponent;
  let fixture: ComponentFixture<SalesvtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesvtypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesvtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
