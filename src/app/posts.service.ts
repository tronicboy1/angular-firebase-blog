import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type Post = {
  title: string;
  body: string;
  createdAt: number;
};

const DUMMY_POST = {
  title: 'Austin Mayer',
  body: 'Programmer, full-stack.',
  createdAt: Date.now(),
};

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor() {}

  public getPosts(pageNo = 1, limit = 5): Observable<Post[]> {
    return of([DUMMY_POST]);
  }

  public getPost(key: string): Observable<Post> {
    return of(DUMMY_POST);
  }
}
