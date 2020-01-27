import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }   from '@angular/forms';

import { AngularMaterialModule } from './angular-material-exports';
import { AppComponent } from './app.component';


@NgModule({
    declarations: [
        AppComponent,
    ],

    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        FormsModule,
    ],

    bootstrap: [AppComponent],
})
export class AppModule {}
