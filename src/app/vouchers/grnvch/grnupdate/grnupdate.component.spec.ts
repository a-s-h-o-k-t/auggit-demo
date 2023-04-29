import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnupdateComponent } from './grnupdate.component';

describe('GrnupdateComponent', () => {
  let component: GrnupdateComponent;
  let fixture: ComponentFixture<GrnupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
