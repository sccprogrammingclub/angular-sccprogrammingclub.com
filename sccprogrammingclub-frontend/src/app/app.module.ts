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
import { EmilyBComponent } from './pages/custom-member-pages/emily-b/emily-b.component';
import { EvelynHComponent } from './pages/custom-member-pages/evelyn-h/evelyn-h.component';
import { CardComponent } from './components/card/card.component';
import { CurrentMembersComponent } from './pages/current-members/current-members.component';
import { PastMembersComponent } from './pages/past-members/past-members.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MemberComponent } from './pages/member/member.component';
import { JayDfComponent } from './pages/custom-member-pages/jay-df/jay-df.component';
import { SiddharthMComponent } from './pages/custom-member-pages/siddharth-m/siddharth-m.component';
import { LuisSComponent } from './pages/custom-member-pages/luis-s/luis-s.component';
import { SaraLComponent } from './pages/custom-member-pages/sara-l/sara-l.component';
import { FranciscoFComponent } from './pages/custom-member-pages/francisco-f/francisco-f.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ExampleProjectComponent } from './pages/project/example-project/example-project.component';
import { ProjectComponent } from './pages/project/project.component';
import { PowdertoyCloneComponent } from './pages/project/powdertoy-clone/powdertoy-clone.component';
import { SnakeProjectComponent } from './pages/project/snake-project/snake-project.component';
import { ChatgptTicTacToeComponent } from './pages/project/chatgpt-tic-tac-toe/chatgpt-tic-tac-toe.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ContactComponent,
    FooterComponent,
    HomeComponent,
    EmilyBComponent,
    EvelynHComponent,
    CardComponent,
    CurrentMembersComponent,
    PastMembersComponent,
    NotFoundComponent,
    MemberComponent,
    JayDfComponent,
    SiddharthMComponent,
    LuisSComponent,
    SaraLComponent,
    FranciscoFComponent,
    ProjectsComponent,
    ExampleProjectComponent,
    ProjectComponent,
    PowdertoyCloneComponent,
    SnakeProjectComponent,
    ChatgptTicTacToeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, MatIconModule],
  providers: [MemberService, CommentService],
  bootstrap: [AppComponent],
})
export class AppModule {}
