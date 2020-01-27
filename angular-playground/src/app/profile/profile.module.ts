import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@app/shared/shared.module';
import { counterReducer } from '@app/profile/counter/counter.reducer';
import { ProfileRoutingModule } from '@app/profile/profile-routing.module';
import { ProfileComponent } from '@app/profile/profile.component';


@NgModule({
    declarations: [ProfileComponent],

    imports: [
        StoreModule.forFeature('count', counterReducer),

        SharedModule,
        ProfileRoutingModule,
    ],
})
export class ProfileModule {}
