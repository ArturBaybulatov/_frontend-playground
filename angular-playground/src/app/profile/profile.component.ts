import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as counterActions from '@app/profile/counter/counter.actions';


@Component({
    selector: 'c-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.less'],
})
export class ProfileComponent implements OnInit {
    count$: Observable<number> = of(0);

    constructor(private store: Store<{ count: number }>) {
        this.count$ = store.pipe(select('count'));
    }

    ngOnInit() {}

    increment() { this.store.dispatch(new counterActions.Increment()) }

    decrement() { this.store.dispatch(new counterActions.Decrement()) }

    reset() { this.store.dispatch(new counterActions.Reset()) }
}
