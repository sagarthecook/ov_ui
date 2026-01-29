import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishResult } from './publish-result';

describe('PublishResult', () => {
  let component: PublishResult;
  let fixture: ComponentFixture<PublishResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishResult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
