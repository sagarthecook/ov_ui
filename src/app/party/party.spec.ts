import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyCreation } from './party';

describe('Party', () => {
  let component: PartyCreation;
  let fixture: ComponentFixture<PartyCreation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyCreation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyCreation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
