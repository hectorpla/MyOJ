import { Component, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model'

const PROBLEMS = [
  new Problem(1, "two sum", "find ...", "easy"),
  new Problem(2, "sky line", "output ...", "hard"),
  new Problem(3, "Room scheduler", "check ...", "medium"),
  new Problem(1, "aa", "find ...", "super")
]

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems : Problem[];

  constructor() { }

  ngOnInit() {
    this.problems = PROBLEMS;
  }

}
