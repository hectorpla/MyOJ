import { Routes, RouterModule } from '@angular/router';
import { ProblemListComponent } from './components/problem-list/problem-list.component'
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component'
import { NewProblemComponent } from './components/new-problem/new-problem.component';

// why
const routes: Routes = [
    {
        path: '',
        redirectTo: 'problems',
        pathMatch: 'full'
    },
    {
        path: 'problems',
        component: ProblemListComponent
    },
    {
        path: 'problems/:id',
        component: ProblemDetailComponent
    },
    {
        path: 'add-problem',
        component: NewProblemComponent,
        pathMatch: 'prefix'
    },
    {
        path: 'modify-problem/:id',
        component: NewProblemComponent
    },
    {
        path: '*',
        // set redirect
        redirectTo: 'problems'
    }
]

export const routing = RouterModule.forRoot(routes);