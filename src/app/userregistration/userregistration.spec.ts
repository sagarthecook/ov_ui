import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userregistration } from './userregistration';

describe('Userregistration', () => {
  let component: Userregistration;
  let fixture: ComponentFixture<Userregistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userregistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Userregistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
