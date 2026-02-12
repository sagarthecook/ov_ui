import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishElection } from './publish-election';

describe('PublishElection', () => {
  let component: PublishElection;
  let fixture: ComponentFixture<PublishElection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishElection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishElection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
