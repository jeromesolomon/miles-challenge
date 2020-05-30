import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem} from '@angular/cdk/drag-drop';

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

    console.log("event = ", event);
    console.log("categoryIndex = ", categoryIndex);
    console.log("rewardIndex = ", rewardIndex);

    // the first list is the main rewards list
    let currentArray = this.categoryList[categoryIndex].rewardList;
    let targetArray = this.categoryList[0].rewardList;
    
    let currentIndex = rewardIndex;
    let targetIndex = targetArray.length; // put into last element
    
    console.log("targetArray = ",targetArray);
    console.log("currentArray = ",currentArray);

    // remove the element
    currentArray.splice(rewardIndex,1);
    

  }

  //
  // Func: dropReward
  // Desc: hanles drop event of rewards
  //
  dropReward(event: CdkDragDrop<string[]>, categoryIndex: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      // if on first category (the rewards row) then copy the item, otherwise transferMove the item
      console.log("event = ", event);
      console.log("categoryIndex =", categoryIndex);

      // copy the item, if you are not copying it to the rewards category/column
      if (categoryIndex != 0) {
        copyArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
      } else {
        // remove the element
        event.previousContainer.data.splice(event.previousIndex,1);
        console.log("detele");
      }

      

    }
  }


}
