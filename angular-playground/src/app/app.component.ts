import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as userActions from '@app/core/user/user.actions';


@Component({
    selector: 'c-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    constructor(private store: Store<any>) {} // TODO: Get rid of `any`

    ngOnInit() { this.store.dispatch(new userActions.GenerateUsers()) }
}
