import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoservicelistComponent } from './soservicelist.component';

describe('SoservicelistComponent', () => {
  let component: SoservicelistComponent;
  let fixture: ComponentFixture<SoservicelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoservicelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoservicelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
