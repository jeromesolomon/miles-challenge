import { Component, OnInit } from '@angular/core';

import { Category } from '../shared/category';

// services
import { RewardService } from '../services/reward.service';

@Component({
  selector: 'app-reward-categories',
  templateUrl: './reward-categories.component.html',
  styleUrls: ['./reward-categories.component.scss']
})
export class RewardCategoriesComponent implements OnInit {

  // list of categories
  categoryList: Category[];

  constructor(private rewardService: RewardService) { }

  ngOnInit(): void {

    // fetch dishes from dish service
    this.categoryList = this.rewardService.getCategoryList();

  }


}
