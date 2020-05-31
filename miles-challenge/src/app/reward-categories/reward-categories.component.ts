import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem} from '@angular/cdk/drag-drop';

import { Category } from '../shared/category';
import { Reward } from '../shared/reward';
import { DragAction } from '../shared/dragAction';

import { Stack } from 'stack-typescript';

// services
import { RewardService } from '../services/reward.service';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-reward-categories',
  templateUrl: './reward-categories.component.html',
  styleUrls: ['./reward-categories.component.scss']
})
export class RewardCategoriesComponent implements OnInit {

  // list of categories & rewards
  categoryList: Category[];

  // stack of operations
  undoStack: Stack<DragAction>;
  redoStack: Stack<DragAction>;

  // undoButton, redoButton enable/disable
  undoButtonEnable: boolean;
  redoButtonEnable: boolean;

  constructor(private rewardService: RewardService) { }

  ngOnInit(): void {


    // initalize data structures
    this.categoryList = this.rewardService.getCategoryList();

    // create the undo and redo stacks
    this.undoStack = new Stack<DragAction>();
    this.redoStack = new Stack<DragAction>();

    // set undo and redo to false to start
    this.undoButtonEnable = false;
    this.redoButtonEnable = false;

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

    let action = new DragAction;

    action.Set("remove", Number(categoryIndex), Number(categoryIndex), rewardIndex, rewardIndex);

  //
  // push action to undo stack
  //
  this.undoStack.push(action);

  // enable undo button
  this.undoButtonEnable = true;

  console.log("undoStack = ", this.undoStack);
  console.log("redoStack = ", this.redoStack);
    

  }

  //
  // Func: dropReward
  // Desc: hanles drop event of rewards
  //
  dropReward(event: CdkDragDrop<string[]>) {

    // action to save the current operation for the undo/redo stacks
    let action = new DragAction;

    if (event.previousContainer === event.container) {

      console.log("move");

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      action.Set("moveItemInArray",Number(event.previousContainer.id), Number(event.container.id), event.previousIndex, event.currentIndex);

    } else {

      // if on first category (the rewards row) then copy the item, otherwise transferMove the item
      console.log("event = ", event);
      console.log("previousContainerID =", event.previousContainer.id);
      console.log("containerID =", event.container.id);
      console.log("previousIndex =", event.previousIndex);
      console.log("containerIndex =", event.currentIndex);

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
        action.Set("copyArrayItem",Number(event.previousContainer.id), Number(event.container.id), event.previousIndex, event.currentIndex);
      }

      // case 2. move/transfer the reward if it is being dragged from the main reward list, to a category
      if ((event.previousContainer.id != "0") && (event.container.id != "0")) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
          action.Set("transferArrayItem", Number(event.previousContainer.id), Number(event.container.id), event.previousIndex, event.currentIndex);
      }

      // case 3. remove the reward, iff it is not being copied back into the main reward list
      if ((event.previousContainer.id != "0") && (event.container.id == "0")) {
        event.previousContainer.data.splice(event.previousIndex,1);
        action.Set("remove", Number(event.previousContainer.id), Number(event.container.id), event.previousIndex, event.currentIndex);
      }

    }

    //
    // push action to undo stack
    //
    this.undoStack.push(action);

    // enable undo button
    this.undoButtonEnable = true;

    console.log("undoStack = ", this.undoStack);
    console.log("redoStack = ", this.redoStack);

  }

  //
  // Func: undoButton
  // Desc: handles undo button click
  //
  undoButton(event: Event) {

    console.log("undo");

    if (this.undoStack.size > 0) {

      let lastAction = new DragAction;

      // get the last action
      lastAction = this.undoStack.top;

      // undo this action
      this.undoAction(lastAction);

      // push this action on the redo stack
      this.redoStack.push(lastAction);

      // pop the action off the undo stack
      this.undoStack.pop();

    }

    // if the stack size is zero, disable the undo button
    if (this.undoStack.size == 0) {
      // disable the undo button 
      this.undoButtonEnable = false;
    }

    // enable redo when an undo occurs
    this.redoButtonEnable = true;
    

  }

  //
  // Func: undoButton
  // Desc: handles undo button click
  //
  redoButton(event: Event) {

    console.log("redo");

    if (this.redoStack.size > 0) {

      let lastAction = new DragAction;

      // get the last action
      lastAction = this.redoStack.top;

      // redo this action
      this.redoAction(lastAction);

      // push this action on the undo stack
      this.undoStack.push(lastAction);

      // pop the action off the redo stack
      this.redoStack.pop();

    }

    // if the stack size is zero, disable the redo button
    if (this.redoStack.size == 0) {
      // disable the undo button 
      this.redoButtonEnable = false;
    }

    // enable undo when a redo occurs
    this.undoButtonEnable = true;

  }

  //
  // Func: undoAction
  // Desc: undo the action
  //
  private undoAction(action: DragAction) {

    let operation = action.operation;

    switch(operation) {

      // for copy, we remove the reward from the current container to undo the operation
      case "copyArrayItem": {

        this.categoryList[action.currentContainerIndex].rewardList.splice(action.currentIndex,1);

        break;
      }

      case "moveItemInArray": {

        let temp: Reward;

        // swap the items
        temp = this.categoryList[action.previousContainerIndex].rewardList[action.previousIndex];

        this.categoryList[action.previousContainerIndex].rewardList[action.previousIndex] = 
          this.categoryList[action.currentContainerIndex].rewardList[action.currentIndex];

        // console.log("temp =", temp);

        // if the location was empty previously, then delete the item that is there
        if (temp == undefined) {
          this.categoryList[action.currentContainerIndex].rewardList.splice(action.currentIndex,1);
        } else {
          this.categoryList[action.currentContainerIndex].rewardList[action.currentIndex] = temp;
        }

        break;
      }

      // for move, we reverse the operations order and swap the rewards
      case "transferArrayItem": {

        let temp: Reward;

        // swap the items
        temp = this.categoryList[action.previousContainerIndex].rewardList[action.previousIndex];

        this.categoryList[action.previousContainerIndex].rewardList[action.previousIndex] = 
          this.categoryList[action.currentContainerIndex].rewardList[action.currentIndex];

        // console.log("temp =", temp);

        // if the location was empty previously, then delete the item that is there
        if (temp == undefined) {
          this.categoryList[action.currentContainerIndex].rewardList.splice(action.currentIndex,1);
        } else {
          this.categoryList[action.currentContainerIndex].rewardList[action.currentIndex] = temp;
        }

        break;
      }

      // for remove, we copy an item back into the previous category from the reward list
      case "remove": {

        this.categoryList[action.previousContainerIndex].rewardList.push(
          this.categoryList[0].rewardList[action.currentIndex]);

        break;

      }

      default: { 
        
        console.log("ERROR: Unknown operation");
        break; 
     
      }
    }

  }

  //
  // Func: redoAction
  // Desc: redo the action
  //
  private redoAction(action: DragAction) {

    let operation = action.operation;

    switch(operation) {

      // for copy, we simply copy the item to its current column
      case "copyArrayItem": {

        this.categoryList[action.currentContainerIndex].rewardList[action.currentIndex] = 
          this.categoryList[action.previousContainerIndex].rewardList[action.previousIndex];

        break;

      }

      case "moveItemInArray": {

        let temp: Reward;

        // swap the items
        temp = this.categoryList[action.currentContainerIndex].rewardList[action.currentIndex];

          this.categoryList[action.currentContainerIndex].rewardList[action.currentIndex] =
            this.categoryList[action.previousContainerIndex].rewardList[action.previousIndex];
        // console.log("temp =", temp);

        // if the location was empty previously, then delete the item that is there
        if (temp == undefined) {
          this.categoryList[action.previousContainerIndex].rewardList.splice(action.previousIndex,1);
        } else {
          this.categoryList[action.previousContainerIndex].rewardList[action.previousIndex] = temp;
        }

        break;
      }

      // for move, we reverse the operations order and swap the rewards
      case "transferArrayItem": {

        let temp: Reward;

        // swap the items
        temp = this.categoryList[action.currentContainerIndex].rewardList[action.currentIndex];

          this.categoryList[action.currentContainerIndex].rewardList[action.currentIndex] =
            this.categoryList[action.previousContainerIndex].rewardList[action.previousIndex];
        // console.log("temp =", temp);

        // if the location was empty previously, then delete the item that is there
        if (temp == undefined) {
          this.categoryList[action.previousContainerIndex].rewardList.splice(action.previousIndex,1);
        } else {
          this.categoryList[action.previousContainerIndex].rewardList[action.previousIndex] = temp;
        }

        break;
      }

      // for remove, we delete an item from the reward list
      case "remove": {

        this.categoryList[action.previousContainerIndex].rewardList.splice(action.previousIndex,1);

        break;

      }

      default: { 
        
        console.log("ERROR: Unknown operation");
        break; 
      
      }
    }

    // if redo stack is empty after redo, disable the button
    if (this.redoStack.size == 0) {
      this.redoButtonEnable = false;
    }

  }

}
