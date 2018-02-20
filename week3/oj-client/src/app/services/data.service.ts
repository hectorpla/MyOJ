import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { Observable } from 'rxjs/Observable'; // different from the demo
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { HttpClient, HttpHeaders } from '@angular/common/http';

const jsonOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class DataService {
  private _problemStream = new BehaviorSubject<Problem[]>([]);
  private serverAPI: string = 'app/v1';

  constructor(private httpClient: HttpClient) {}

  getProblems(): Observable<Problem[]> {
    this.httpClient.get(`${this.serverAPI}/problems`)
      .toPromise()
      .then((res: any) => this._problemStream.next(res))
      .catch(this.handleError);
    return this._problemStream;
  }

  getProblem(id: number): Promise<Problem> {
    // generic function?
    return this.httpClient.get<Problem>(`${this.serverAPI}/problems/${id}`)
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }

  addProblem(newProblem: Problem) {
    
    return this.httpClient.post(`${this.serverAPI}/problems`, newProblem, jsonOptions)
      .toPromise()
      .then(res => {
        this.getProblems();
        return res;
      })
      .catch(this.handleError);
  }

  modifyProblem(problem: Problem) {
    return this.httpClient.put(`${this.serverAPI}/problems`, problem, jsonOptions)
      .toPromise()
      .then(res => res)
      .catch(this.handleError)
  }

  deleteProblem(id: number) {
    this.httpClient.delete(`${this.serverAPI}/problems/${id}`)
      .toPromise()
      .then(res => {
        console.log(`deleted sucessfully, message from the server: 
        ${JSON.stringify(res)}`);
        this.getProblems();
      })
      .catch(err => console.log(`deletion failed: ${err}`));
  }

  buildAndRun(lang: string, code: string) {
    let body = {lang: lang, code: code};
    return this.httpClient.post(`${this.serverAPI}/build-and-run`, body, jsonOptions)
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }

  private handleError(err: any) { // type annotation missed
    console.error(err);
    return Promise.reject(err.body || err);
  } 
}
