import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnservicelistComponent } from './grnservicelist.component';

describe('GrnservicelistComponent', () => {
  let component: GrnservicelistComponent;
  let fixture: ComponentFixture<GrnservicelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnservicelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnservicelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
