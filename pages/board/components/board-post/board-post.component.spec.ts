import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardPostComponent } from './board-post.component';

describe('BoardPostComponent', () => {
  let component: BoardPostComponent;
  let fixture: ComponentFixture<BoardPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoardPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
