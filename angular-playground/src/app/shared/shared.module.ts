import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { NavComponent } from '@app/shared/nav/nav.component';
import { UserCardComponent } from '@app/shared/user-card/user-card.component';


@NgModule({
    declarations: [
        NavComponent,
        UserCardComponent,
    ],

    imports: [
        CommonModule,
        RouterModule,
        NgZorroAntdModule,
    ],

    exports: [
        CommonModule,
        HttpClientModule,
        NgZorroAntdModule,

        NavComponent,
        UserCardComponent,
    ],
})
export class SharedModule {}
