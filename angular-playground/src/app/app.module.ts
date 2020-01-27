import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { NZ_I18N, ru_RU } from 'ng-zorro-antd';
import { StoreModule } from '@ngrx/store';

import { CoreModule } from '@app/core/core.module';
import { SharedModule } from '@app/shared/shared.module';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { AboutComponent } from '@app/about/about.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';


registerLocaleData(localeRu);


@NgModule({
    declarations: [
        AppComponent,
        AboutComponent,
        PageNotFoundComponent,
    ],

    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({}),

        CoreModule,
        SharedModule,
        AppRoutingModule,
    ],

    providers: [
        { provide: NZ_I18N, useValue: ru_RU },
    ],

    bootstrap: [AppComponent],
})
export class AppModule {}
