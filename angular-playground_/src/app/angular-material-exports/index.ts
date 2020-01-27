import { NgModule } from '@angular/core';

import {
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatListModule,
} from '@angular/material';


@NgModule({
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatListModule,
    ],

    exports: [
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatListModule,
    ],
})
export class AngularMaterialModule {}
