import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrtyComponent } from './enrty.component';

describe('EnrtyComponent', () => {
  let component: EnrtyComponent;
  let fixture: ComponentFixture<EnrtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrtyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
