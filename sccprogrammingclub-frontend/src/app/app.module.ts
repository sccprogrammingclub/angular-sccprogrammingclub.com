import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// ROUTING
import { AppRoutingModule } from './app-routing.module';

// MODULES
import { MatIconModule } from '@angular/material/icon';

// SERVICES
import { MemberService } from './services/member.service';
import { CommentService } from './services/comment.service';

// COMPONENTS
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { MembersComponent } from './pages/members/members.component';
import { SocialsComponent } from './pages/socials/socials.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MembersComponent,
    SocialsComponent,
    ContactComponent,
    FooterComponent,
    HomeComponent
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
