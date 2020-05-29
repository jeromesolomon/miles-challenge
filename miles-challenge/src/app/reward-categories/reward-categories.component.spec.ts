import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardCategoriesComponent } from './reward-categories.component';

describe('RewardCategoriesComponent', () => {
  let component: RewardCategoriesComponent;
  let fixture: ComponentFixture<RewardCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
