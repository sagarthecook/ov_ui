import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionInfo } from './election-info';

describe('ElectionInfo', () => {
  let component: ElectionInfo;
  let fixture: ComponentFixture<ElectionInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectionInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
