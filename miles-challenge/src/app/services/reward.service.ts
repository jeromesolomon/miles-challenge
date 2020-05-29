import { Injectable } from '@angular/core';
import { Category } from '../shared/category';
import { CATEGORYLIST } from '../shared/categoryList'

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
