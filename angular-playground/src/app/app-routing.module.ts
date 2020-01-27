import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from '@app/about/about.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';


const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', loadChildren: './home/home.module#HomeModule' },
    { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
    { path: 'about', component: AboutComponent },
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
