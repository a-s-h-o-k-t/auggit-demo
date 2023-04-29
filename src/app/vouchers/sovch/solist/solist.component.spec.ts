import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolistComponent } from './solist.component';

describe('SolistComponent', () => {
  let component: SolistComponent;
  let fixture: ComponentFixture<SolistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
