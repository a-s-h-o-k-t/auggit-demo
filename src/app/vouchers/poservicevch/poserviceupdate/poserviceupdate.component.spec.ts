import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoserviceupdateComponent } from './poserviceupdate.component';

describe('PoserviceupdateComponent', () => {
  let component: PoserviceupdateComponent;
  let fixture: ComponentFixture<PoserviceupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoserviceupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoserviceupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
