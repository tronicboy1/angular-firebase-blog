import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostComponent } from "./posts/post/post.component";
import { NewPostComponent } from "./posts/new-post/new-post.component";
import { AppRoutingModule } from "./app-routing.module";
import { MarkdownPipe } from "./pipes/markdown.pipe";

@NgModule({
  declarations: [AppComponent, PostListComponent, PostComponent, NewPostComponent, MarkdownPipe],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
