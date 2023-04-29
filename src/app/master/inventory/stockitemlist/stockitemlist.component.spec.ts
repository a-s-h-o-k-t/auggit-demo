import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockitemlistComponent } from './stockitemlist.component';

describe('StockitemlistComponent', () => {
  let component: StockitemlistComponent;
  let fixture: ComponentFixture<StockitemlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockitemlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockitemlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
