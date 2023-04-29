import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnlistComponent } from './grnlist.component';

describe('GrnlistComponent', () => {
  let component: GrnlistComponent;
  let fixture: ComponentFixture<GrnlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
