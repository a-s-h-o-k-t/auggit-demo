import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessmsgComponent } from './successmsg.component';

describe('SuccessmsgComponent', () => {
  let component: SuccessmsgComponent;
  let fixture: ComponentFixture<SuccessmsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessmsgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
