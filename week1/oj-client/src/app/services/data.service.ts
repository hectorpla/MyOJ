import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';

const PROBLEMS = [
  new Problem(1, "two sum", "find ...", "easy"),
  new Problem(2, "sky line", "output ...", "hard"),
  new Problem(3, "Room scheduler", "check ...", "medium"),
  {
    id: 4,
    name: 'Count and Say',
    desc: "The count-and-say sequence is the sequence of integers with the first five terms as following:",
    difficulty: "easy"
  }
]

@Injectable()
export class DataService {
  problems: Problem[] = PROBLEMS;

  constructor() { }

  getProblems() {
    return this.problems;
  }

  getProblem(id: number) {
    return this.problems.find(p => p.id === id)
  }

  addProblem(newProblem: Problem) {
    newProblem = Object.assign({}, newProblem);
    newProblem.id = PROBLEMS.length + 1;
    this.problems.push(newProblem);
  }
}
