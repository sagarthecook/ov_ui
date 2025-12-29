import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateForm } from './candidate-form';

describe('CandidateForm', () => {
  let component: CandidateForm;
  let fixture: ComponentFixture<CandidateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
