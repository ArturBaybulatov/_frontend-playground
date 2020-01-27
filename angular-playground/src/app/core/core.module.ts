import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { userReducer } from '@app/core/user/user.reducer';


@NgModule({
    declarations: [],
    imports: [StoreModule.forFeature('users', userReducer)],
})
export class CoreModule {}
