import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPostComponent } from './review-post.component';

describe('ReviewPostComponent', () => {
  let component: ReviewPostComponent;
  let fixture: ComponentFixture<ReviewPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
