import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateVerification } from './candidate-verification';

describe('CandidateVerification', () => {
  let component: CandidateVerification;
  let fixture: ComponentFixture<CandidateVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
