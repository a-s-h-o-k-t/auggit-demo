import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoupdateComponent } from './poupdate.component';

describe('PoupdateComponent', () => {
  let component: PoupdateComponent;
  let fixture: ComponentFixture<PoupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
