import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoterSearchComponent } from './votersearch';

describe('VoterSearchComponent', () => {
  let component: VoterSearchComponent;
  let fixture: ComponentFixture<VoterSearchComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoterSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
