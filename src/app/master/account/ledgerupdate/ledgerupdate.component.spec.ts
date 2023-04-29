import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerupdateComponent } from './ledgerupdate.component';

describe('LedgerupdateComponent', () => {
  let component: LedgerupdateComponent;
  let fixture: ComponentFixture<LedgerupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedgerupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
