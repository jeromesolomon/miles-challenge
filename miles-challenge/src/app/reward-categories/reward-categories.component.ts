import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { Category } from '../shared/category';
import { Reward } from '../shared/reward';

// services
import { RewardService } from '../services/reward.service';

@Component({
  selector: 'app-reward-categories',
  templateUrl: './reward-categories.component.html',
  styleUrls: ['./reward-categories.component.scss']
})
export class RewardCategoriesComponent implements OnInit {

  // list of categories & rewards
  categoryList: Category[];
  rewardList: Reward[];
  categoryTable: Array<Array<Reward>>;

  // categories
  cat1: Reward[];

  constructor(private rewardService: RewardService) { }

  ngOnInit(): void {

    // fetch dishes from dish service
    this.categoryList = this.rewardService.getCategoryList();
    this.rewardList = this.rewardService.getRewardList();
    this.categoryTable = [[],[]];

  }

  //
  // Func: drop
  // Desc: hanles drop event of rewards
  //
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }


}
