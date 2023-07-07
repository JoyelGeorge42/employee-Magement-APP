import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveInDetailComponent } from './leave-in-detail.component';

describe('LeaveInDetailComponent', () => {
  let component: LeaveInDetailComponent;
  let fixture: ComponentFixture<LeaveInDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveInDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveInDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
