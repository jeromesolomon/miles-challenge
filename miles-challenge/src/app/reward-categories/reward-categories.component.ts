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

  constructor(private rewardService: RewardService) { }

  ngOnInit(): void {


    // initalize data structures
    this.categoryList = this.rewardService.getCategoryList();

  }

  //
  // Func: GetCategoryArray
  // Desc: gets a category array
  //
  GetCategoryArray(i: number) {
    return "categoryList[" + i + "]";
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
