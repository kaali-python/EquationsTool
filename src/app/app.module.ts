import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { UrlResolver } from '@angular/compiler';
import { SideBarComponent } from './home/side-bar/side-bar.component';
import { NavBarComponent } from './home/nav-bar/nav-bar.component';
import { EditorComponent } from './home/side-bar/editor/editor.component';
import { UsersComponent } from './home/side-bar/users/users.component';
import { QuestionsComponent } from './home/side-bar/questions/questions.component';
import { MaterializeModule } from 'angular2-materialize';
import { OntologyComponent } from './home/side-bar/ontology/ontology.component';

const routes: Routes = 
[
{ path: 'home', component: HomeComponent, 
children: [
{ path: 'editor', component: EditorComponent},
{ path: 'users', component: UsersComponent},
{ path: 'questions', component: QuestionsComponent},
{ path: 'ontology', component: OntologyComponent},

]}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SideBarComponent,
    NavBarComponent,
    EditorComponent,
    UsersComponent,
    QuestionsComponent,
    OntologyComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule,
    HttpModule,
    MaterializeModule,
          RouterModule.forRoot(routes, { useHash: true })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }