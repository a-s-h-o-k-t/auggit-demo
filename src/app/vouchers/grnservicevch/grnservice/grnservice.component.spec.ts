import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnserviceComponent } from './grnservice.component';

describe('GrnserviceComponent', () => {
  let component: GrnserviceComponent;
  let fixture: ComponentFixture<GrnserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnserviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
