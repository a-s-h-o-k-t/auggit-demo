import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockitemupdateComponent } from './stockitemupdate.component';

describe('StockitemupdateComponent', () => {
  let component: StockitemupdateComponent;
  let fixture: ComponentFixture<StockitemupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockitemupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockitemupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
