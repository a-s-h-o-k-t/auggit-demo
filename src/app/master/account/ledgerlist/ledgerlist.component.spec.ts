import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerlistComponent } from './ledgerlist.component';

describe('LedgerlistComponent', () => {
  let component: LedgerlistComponent;
  let fixture: ComponentFixture<LedgerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
