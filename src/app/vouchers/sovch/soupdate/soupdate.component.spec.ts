import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoupdateComponent } from './soupdate.component';

describe('SoupdateComponent', () => {
  let component: SoupdateComponent;
  let fixture: ComponentFixture<SoupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
