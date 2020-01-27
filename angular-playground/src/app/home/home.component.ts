import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { NzNotificationService } from 'ng-zorro-antd';

import { User, Genders } from '@app/core/user/user.model';
import * as userActions from '@app/core/user/user.actions';


@Component({
    selector: 'c-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
    users$: Observable<User[]> = of([]);

    Genders = Genders;

    constructor(
        private store: Store<{ xxx: User[] }>,
        private notifService: NzNotificationService,
    ) {
        this.users$ = store.pipe(select('users'));
    }

    ngOnInit() {}

    generateUser() { this.store.dispatch(new userActions.GenerateUser()) }

    generateUsers() { this.store.dispatch(new userActions.GenerateUsers()) }

    showUser(userId: number) {
        this.users$.pipe(take(1)).subscribe(users => {
            this.notifService.info('', `
                <div class="pre pad-s">${ JSON.stringify(users.find(x => x.id === userId), null, 4) }</div>
            `);
        });
    }

    selectUser(userId: number) {
        // this.users$.pipe(take(1)).subscribe(users => this.currentUser = users.find(x => x.id === userId));
    }

    deleteUser(userId: number, event: MouseEvent) {
        event.stopPropagation();

        this.store.dispatch(new userActions.DeleteUser(userId));
    }
}
