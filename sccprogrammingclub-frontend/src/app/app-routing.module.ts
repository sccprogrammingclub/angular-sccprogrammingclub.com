import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './pages/contact/contact.component';
import { CurrentMembersComponent } from './pages/current-members/current-members.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PastMembersComponent } from './pages/past-members/past-members.component';
import { SocialsComponent } from './pages/socials/socials.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'members', redirectTo: 'current-members' },
  { path: 'current-members', component: CurrentMembersComponent },
  { path: 'past-members', component: PastMembersComponent },
  { path: 'socials', component: SocialsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
