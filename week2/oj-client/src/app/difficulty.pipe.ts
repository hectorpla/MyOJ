import { Pipe, PipeTransform } from "@angular/core";
import { Problem } from './models/problem.model'

@Pipe({name: "difficultyFilter"})
export class difficultyPipe implements PipeTransform {
    transform(problems: Problem[], filter: Object) {
        // console.log(filter)
        return problems.filter(p => filter[p.difficulty]);
    }
}