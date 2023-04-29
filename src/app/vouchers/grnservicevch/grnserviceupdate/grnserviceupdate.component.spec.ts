import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnserviceupdateComponent } from './grnserviceupdate.component';

describe('GrnserviceupdateComponent', () => {
  let component: GrnserviceupdateComponent;
  let fixture: ComponentFixture<GrnserviceupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnserviceupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnserviceupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
