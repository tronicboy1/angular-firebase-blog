import { Component, OnInit } from "@angular/core";
import { filter, fromEvent, Subscription } from "rxjs";
import { PostsService } from "src/app/services/posts.service";
import "lit-markdown-editor";

@Component({
  selector: "app-new-post",
  templateUrl: "./new-post.component.html",
  styleUrls: ["./new-post.component.css"],
})
export class NewPostComponent implements OnInit {
  public show = false;
  private loading = false;
  private subscriptions: Subscription[] = [];

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    const click$ = fromEvent(document, "clickdown");
    const escKeydown$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
      filter((event) => !event.isComposing && event.key === "Escape"),
    );
    this.subscriptions.push(
      click$.subscribe(this.handleDocumentClick),
      escKeydown$.subscribe(this.handleDocumentClick),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private handleDocumentClick: EventListener = (event) => {
    this.show = false;
  };

  public handleShowButtonClick: EventListener = (event) => {
    event.stopPropagation();
    this.show = true;
  };

  public handleFormSubmission: EventListener = (event) => {
    event.preventDefault();
    if (this.loading) return;
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) throw TypeError();
    const formData = new FormData(form);
    const title = formData.get("title")!.toString().trim();
    const body = formData.get("body")!.toString().trim();
    if (title.length > 0 && body.length > 0) {
      this.loading = true;
      this.postsService
        .createPost({ title, body })
        .then(() => {
          form.reset();
          this.show = false;
        })
        .finally(() => (this.loading = false));
    }
  };
}
