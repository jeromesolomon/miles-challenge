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
  // Func: closeReward
  // Desc: closes a reward by transfering item back to the rewards list
  //
  closeReward(event: Event, categoryIndex: number, rewardIndex: number) {

    console.log(event);
    console.log("categoryIndex = ", categoryIndex);
    console.log("rewardIndex = ", rewardIndex);

    // the first list is the main rewards list
    let currentArray = this.categoryList[categoryIndex].rewardList;
    let targetArray = this.categoryList[0].rewardList;
    
    let currentIndex = rewardIndex;
    let targetIndex = targetArray.length; // put into last element
    
    console.log("targetArray = ",targetArray);
    console.log("currentArray = ",currentArray);

    // move the element
    transferArrayItem(currentArray, targetArray, currentIndex, targetIndex);

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
