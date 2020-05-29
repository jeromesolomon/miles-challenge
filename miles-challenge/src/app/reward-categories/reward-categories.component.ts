import { Component, OnInit } from '@angular/core';

import { Category } from '../shared/category';

@Component({
  selector: 'app-reward-categories',
  templateUrl: './reward-categories.component.html',
  styleUrls: ['./reward-categories.component.scss']
})
export class RewardCategoriesComponent implements OnInit {

  // list of categories
  categoryList: Category[];

  constructor() { }

  ngOnInit(): void {
  }


}
