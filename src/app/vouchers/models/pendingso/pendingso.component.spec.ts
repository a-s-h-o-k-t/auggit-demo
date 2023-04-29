import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingsoComponent } from './pendingso.component';

describe('PendingsoComponent', () => {
  let component: PendingsoComponent;
  let fixture: ComponentFixture<PendingsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingsoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
