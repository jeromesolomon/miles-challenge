import { Injectable } from '@angular/core';
import { Category } from '../shared/category';
import { CATEGORYLIST } from '../shared/categoryList'
import { Reward } from '../shared/reward';
import { REWARDLIST } from '../shared/rewardList'

@Injectable({
  providedIn: 'root'
})
export class RewardService {

  constructor() { }

  //
  // Func: getCategoryList
  // Desc: returns category list
  //
  getCategoryList(): Category[] {
    return CATEGORYLIST;
  }

}
