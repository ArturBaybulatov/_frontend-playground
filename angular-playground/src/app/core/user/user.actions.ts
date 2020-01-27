import { Action } from '@ngrx/store';


export enum UserActionTypes {
    GenerateUser = 'GenerateUser',
    GenerateUsers = 'GenerateUsers',
    DeleteUser = 'DeleteUser',
}


export class GenerateUser implements Action { readonly type = UserActionTypes.GenerateUser }

export class GenerateUsers implements Action { readonly type = UserActionTypes.GenerateUsers }

export class DeleteUser implements Action {
    readonly type = UserActionTypes.DeleteUser;

    constructor(public userId: number) {}
}


export type UserActionsUnion = GenerateUser | GenerateUsers | DeleteUser;
