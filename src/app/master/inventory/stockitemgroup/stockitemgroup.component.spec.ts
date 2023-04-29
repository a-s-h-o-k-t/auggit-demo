import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockitemgroupComponent } from './stockitemgroup.component';

describe('StockitemgroupComponent', () => {
  let component: StockitemgroupComponent;
  let fixture: ComponentFixture<StockitemgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockitemgroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockitemgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
