import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem} from '@angular/cdk/drag-drop';

import { Category } from '../shared/category';
import { Reward } from '../shared/reward';
import { DragAction } from '../shared/dragAction';

import { Stack } from 'stack-typescript';

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

  // stack of operations
  actionStack: Stack<boolean>;

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
  dropReward(event: CdkDragDrop<string[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {

      // if on first category (the rewards row) then copy the item, otherwise transferMove the item
      console.log("event = ", event);
      console.log("previousContainerID =", event.previousContainer.id);
      console.log("containerID =", event.container.id);

      console.log("categoryList = ", this.categoryList);


      //
      // there are 3 cases and behaviors for the rewards
      //

      // case 1. copy the reward if it is being dragged from the main reward list, to a category
      if ((event.previousContainer.id == "0") && (event.container.id != "0")) {
        copyArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }

      // case 2. move/transfer the reward if it is being dragged from the main reward list, to a category
      if ((event.previousContainer.id != "0") && (event.container.id != "0")) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }

      // case 3. remove the reward, if it is being copied back into the main reward list
      if ((event.previousContainer.id != "0") && (event.container.id == "0")) {
        event.previousContainer.data.splice(event.previousIndex,1);
      }

      //
      // save action to stack
      //

    }

  }

  //
  // Func: undoButton
  // Desc: handles undo button click
  //
  undoButton(event: Event) {

    console.log("undo");

  }

    //
  // Func: undoButton
  // Desc: handles undo button click
  //
  redoButton(event: Event) {

    console.log("redo");

  }


}
