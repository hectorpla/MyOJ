import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'

import { DataService } from '../../services/data.service'
import { Problem, DIFFICULTIES } from '../../models/problem.model';

const DEFAULT_PROBLEM: Problem = Object.freeze({
  id: undefined,
  name: "",
  desc: "",
  difficulty: "medium"
})

// const DIFFICULTIES = ['easy', 'medium', 'hard', 'super']

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})

export class NewProblemComponent implements OnInit {
  newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);
  difficulties: string[] = DIFFICULTIES;
  showProblemExistAlert: boolean = false;

  modifyMode: boolean = false;

  constructor(private dataService: DataService, private route:ActivatedRoute) { }

  addProblem() {
    this.dataService.addProblem(this.newProblem)
      .then(res => this.showProblemExistAlert = false)
      .catch(err => {
        console.log('problem occured when adding problem' + JSON.stringify(err));
        this.showProblemExistAlert = true;
      })
  }

  modifyProblem() {
    this.dataService.modifyProblem(this.newProblem)
      .then(res => console.log(res))
      .catch(err => {})
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // console.log(params)
      if (Object.keys(params).length == 0) {
        return;
      }
      console.log('about to set modify mode')
      this.modifyMode = true;
      this.dataService.getProblem(+params.id)
        .then((problem: Problem) => this.newProblem = problem)
        .catch(err => console.log(err))
    })
  }

}
