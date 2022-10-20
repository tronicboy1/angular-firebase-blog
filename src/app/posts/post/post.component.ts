import { Component, Input, OnInit } from '@angular/core';
import { Post } from '@custom-types/posts';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input()
  public post?: Post;

  constructor() {}

  ngOnInit(): void {}
}
