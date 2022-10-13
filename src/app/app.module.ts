import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostComponent } from './post/post.component';

@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    PostComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
