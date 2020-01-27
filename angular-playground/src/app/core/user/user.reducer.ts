import * as _ from 'lodash';

import { generateUser } from '@app/core/util';
import { User } from '@app/core/user/user.model';
import * as userActions from '@app/core/user/user.actions';


const UserActionTypes = userActions.UserActionTypes;

export function userReducer(users: User[] = [], action: userActions.UserActionsUnion): User[] {
    switch (action.type) {
        case UserActionTypes.GenerateUser:
            return [...users, generateUser()];

        case UserActionTypes.GenerateUsers:
            return _.times(_.random(3, 10), generateUser);

        case UserActionTypes.DeleteUser:
            return [...users.filter(x => x.id !== action.userId)];

        default:
            return [...users];
    }
}
