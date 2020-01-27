import { Action } from '@ngrx/store';


export enum CounterActionTypes {
    Increment = 'Increment',
    Decrement = 'Decrement',
    Reset = 'Reset',
}


export class Increment implements Action { readonly type = CounterActionTypes.Increment }

export class Decrement implements Action { readonly type = CounterActionTypes.Decrement }

export class Reset implements Action { readonly type = CounterActionTypes.Reset }


export type CounterActionsUnion = Increment | Decrement | Reset;
