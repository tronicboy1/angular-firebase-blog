import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, map, mergeMap, Subscription } from 'rxjs';
import type { QueryDocumentSnapshot } from 'firebase/firestore';
import { Post } from '@custom-types/posts';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  public posts: Post[] = [];
  @ViewChild('listEnd')
  private listEnd: ElementRef<HTMLElement> | undefined = undefined;
  private subscriptions: Subscription[] = [];
  private lastDocument?: QueryDocumentSnapshot;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    const newPostsSubscription = this.postsService
      .watchForNewPosts()
      .subscribe((docs) => {
        const posts = docs.map(doc => doc.data() as Post);
        this.posts = [...posts, ...this.posts];
      });
    this.subscriptions.push(newPostsSubscription);
  }

  ngAfterViewInit(): void {
    if (!this.listEnd) throw Error('List end Div not found.');
    const intersectionObserverEntries$ = this.createPageNoObservable(
      this.listEnd.nativeElement
    );
    const posts$ = intersectionObserverEntries$.pipe(
      mergeMap(() => this.postsService.getPosts(this.lastDocument, 5)),
      map((docs) => {
        const hasDocs = Boolean(docs.length)
        if (!hasDocs) return [];
        this.lastDocument = docs[docs.length - 1];
        return docs.map((doc) => doc.data() as Post);
      })
    );
    const postsSubscription = posts$.subscribe((newPosts) => {
      this.posts = [...this.posts, ...newPosts];
    });
    this.subscriptions.push(postsSubscription);
  }

  ngOnDestroy(): void {
    // MPAなどで部品が消えたら、IntersectionObserverのSubscription登録を解除しないといけない！
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private createPageNoObservable(target: HTMLElement) {
    return new Observable<IntersectionObserverEntry>((observer) => {
      const options: IntersectionObserverInit = {
        root: null,
        rootMargin: '24px',
        threshold: 0.1,
      };
      const callback: IntersectionObserverCallback = ([entry]) => {
        if (entry.isIntersecting) {
          observer.next(entry);
        }
      };
      const intersectionObserver = new IntersectionObserver(callback, options);
      intersectionObserver.observe(target);

      return () => intersectionObserver.disconnect(); // unsubcsribeを実行した時にIntersectionObserverを消すため
    });
  }
}
