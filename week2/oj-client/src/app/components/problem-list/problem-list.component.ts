import { Component, OnInit } from '@angular/core';
import { Problem, DIFFICULTIES } from '../../models/problem.model'
import { DataService } from '../../services/data.service'
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problemsSubscription: Subscription;
  problems: Problem[];
  // difficultyFilterString: string;
  diffObj: object = {
    easy: true,
    medium: true,
    hard: true,
    super:true
  } // define this way or use defined array in DIFFUCULTIES
  diffculties = DIFFICULTIES;
  
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.subscribeProblems();
  }

  ngOnDestroy() {
    this.problemsSubscription.unsubscribe();
  }

  subscribeProblems() {
    this.problemsSubscription = this.dataService.getProblems()
      .subscribe(problems => this.problems = problems)
  }

  deleteProblem(id: number) {
    this.dataService.deleteProblem(id);
  }

  printFilter() { console.log(this.diffObj); }

  get diffFilter() {
    // critical, returning a new object notifies Angular to do filtering again
    return Object.assign({}, this.diffObj); 
  }
}
