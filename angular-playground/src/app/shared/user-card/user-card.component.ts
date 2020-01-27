import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Genders, User } from '@app/core/user/user.model';


@Component({
    selector: 'c-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.less'],
})
export class UserCardComponent implements OnInit {
    @Input() user!: User;

    Genders = Genders;

    constructor() {}

    ngOnInit() {}
}
