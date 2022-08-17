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
import { ContactComponent } from './pages/contact/contact.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { FranciscoFComponent } from './pages/custom-member-pages/francisco-f/francisco-f.component';
import { DanielJComponent } from './pages/custom-member-pages/daniel-j/daniel-j.component';
import { StephenCComponent } from './pages/custom-member-pages/stephen-c/stephen-c.component';
import { TedMComponent } from './pages/custom-member-pages/ted-m/ted-m.component';
import { MihoSComponent } from './pages/custom-member-pages/miho-s/miho-s.component';
import { NhiNComponent } from './pages/custom-member-pages/nhi-n/nhi-n.component';
import { SaraLComponent } from './pages/custom-member-pages/sara-l/sara-l.component';
import { EmilyBComponent } from './pages/custom-member-pages/emily-b/emily-b.component';
import { EvelynHComponent } from './pages/custom-member-pages/evelyn-h/evelyn-h.component';
import { RisaOComponent } from './pages/custom-member-pages/risa-o/risa-o.component';
import { NoaSComponent } from './pages/custom-member-pages/noa-s/noa-s.component';
import { CardComponent } from './components/card/card.component';
import { CurrentMembersComponent } from './pages/current-members/current-members.component';
import { PastMembersComponent } from './pages/past-members/past-members.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MemberComponent } from './pages/member/member.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
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
    NotFoundComponent,
    MemberComponent
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
