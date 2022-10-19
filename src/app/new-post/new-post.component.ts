import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  public show = false;
  private loading = false;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {}

  public handleShowButtonClick: EventListener = () => {
    this.show = true;
  };

  public handleFormSubmission: EventListener = (event) => {
    event.preventDefault();
    if (this.loading) return;
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) throw TypeError();
    const formData = new FormData(form);
    const title = formData.get('title')!.toString().trim();
    const body = formData.get('body')!.toString().trim();
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
