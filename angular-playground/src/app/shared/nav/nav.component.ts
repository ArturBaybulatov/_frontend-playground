import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as util from '@app/core/util';
import { User } from '@app/core/user/user.model';


@Component({
    selector: 'c-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.less'],
})
export class NavComponent implements OnInit {
    foo = util.sample([true, false]);

    users$: Observable<User[]> = of([]);

    constructor(private store: Store<{ yyy: User[] }>) {
        this.users$ = store.pipe(select('users'));
    }

    ngOnInit() {}
}
