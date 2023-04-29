import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmmsgComponent } from './confirmmsg.component';

describe('ConfirmmsgComponent', () => {
  let component: ConfirmmsgComponent;
  let fixture: ComponentFixture<ConfirmmsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmmsgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
