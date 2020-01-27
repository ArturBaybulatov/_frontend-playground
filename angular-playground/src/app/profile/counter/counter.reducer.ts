import * as counterActions from '@app/profile/counter/counter.actions';


const CounterActionTypes = counterActions.CounterActionTypes;


export function counterReducer(count = 0, action: counterActions.CounterActionsUnion) {
    switch (action.type) {
        case CounterActionTypes.Increment:
            return count + 1;

        case CounterActionTypes.Decrement:
            return count - 1;

        case CounterActionTypes.Reset:
            return 0;

        default:
            return count;
    }
}
