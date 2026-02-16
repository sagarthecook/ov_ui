import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementApproval } from './management-approval';

describe('ManagementApproval', () => {
  let component: ManagementApproval;
  let fixture: ComponentFixture<ManagementApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
