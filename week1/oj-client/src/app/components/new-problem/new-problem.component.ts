import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service'
import { Problem } from '../../models/problem.model';

const DEFAULT_PROBLEM: Problem = Object.freeze({
  id: undefined,
  name: "",
  desc: "",
  difficulty: "medium"
})

const DIFFICULTIES = ['easy', 'medium', 'hard', 'super']

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})

export class NewProblemComponent implements OnInit {
  newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);
  difficulties: string[] = DIFFICULTIES;

  constructor(private dataService: DataService) { }

  addProblem() {
    this.dataService.addProblem(this.newProblem);
  }

  ngOnInit() {

  }

}
