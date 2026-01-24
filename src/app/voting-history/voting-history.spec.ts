import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingHistory } from './voting-history';

describe('VotingHistory', () => {
  let component: VotingHistory;
  let fixture: ComponentFixture<VotingHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotingHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotingHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
