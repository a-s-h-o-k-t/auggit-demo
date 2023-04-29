import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockitemcategoryComponent } from './stockitemcategory.component';

describe('StockitemcategoryComponent', () => {
  let component: StockitemcategoryComponent;
  let fixture: ComponentFixture<StockitemcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockitemcategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockitemcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
