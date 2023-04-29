import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoservicelistComponent } from './poservicelist.component';

describe('PoservicelistComponent', () => {
  let component: PoservicelistComponent;
  let fixture: ComponentFixture<PoservicelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoservicelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoservicelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
