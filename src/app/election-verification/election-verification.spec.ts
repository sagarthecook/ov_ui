import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionVerification } from './election-verification';

describe('ElectionVerification', () => {
  let component: ElectionVerification;
  let fixture: ComponentFixture<ElectionVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectionVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
