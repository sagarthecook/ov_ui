import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonFileUpload } from './common-file-upload';

describe('CommonFileUpload', () => {
  let component: CommonFileUpload;
  let fixture: ComponentFixture<CommonFileUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonFileUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonFileUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
