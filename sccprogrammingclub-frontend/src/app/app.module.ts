import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// ROUTING
import { AppRoutingModule } from './app-routing.module';

// MODULES
import { MatIconModule } from '@angular/material/icon';

// SERVICES
import { MemberService } from './services/member/member.service';
import { CommentService } from './services/comment/comment.service';

// COMPONENTS
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { SocialsComponent } from './pages/socials/socials.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { FranciscoFComponent } from './pages/profiles/francisco-f/francisco-f.component';
import { DanielJComponent } from './pages/profiles/daniel-j/daniel-j.component';
import { StephenCComponent } from './pages/profiles/stephen-c/stephen-c.component';
import { TedMComponent } from './pages/profiles/ted-m/ted-m.component';
import { MihoSComponent } from './pages/profiles/miho-s/miho-s.component';
import { NhiNComponent } from './pages/profiles/nhi-n/nhi-n.component';
import { SaraLComponent } from './pages/profiles/sara-l/sara-l.component';
import { EmilyBComponent } from './pages/profiles/emily-b/emily-b.component';
import { EvelynHComponent } from './pages/profiles/evelyn-h/evelyn-h.component';
import { RisaOComponent } from './pages/profiles/risa-o/risa-o.component';
import { NoaSComponent } from './pages/profiles/noa-s/noa-s.component';
import { CardComponent } from './components/card/card.component';
import { CurrentMembersComponent } from './pages/current-members/current-members.component';
import { PastMembersComponent } from './pages/past-members/past-members.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SocialsComponent,
    ContactComponent,
    FooterComponent,
    HomeComponent,
    FranciscoFComponent,
    DanielJComponent,
    StephenCComponent,
    TedMComponent,
    MihoSComponent,
    NhiNComponent,
    SaraLComponent,
    EmilyBComponent,
    EvelynHComponent,
    RisaOComponent,
    NoaSComponent,
    CardComponent,
    CurrentMembersComponent,
    PastMembersComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule
  ],
  providers: [
    MemberService,
    CommentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
