import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit as limitBy,
  startAfter,
  onSnapshot,
  startAt,
} from 'firebase/firestore';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { firebaseApp } from '@firebase/index';

export type Post = {
  title: string;
  body: string;
  createdAt: number;
};

type DocumentObservable = Observable<QueryDocumentSnapshot<DocumentData>[]>;

const DUMMY_POST: Post = {
  title: 'Austin Mayer',
  body: 'Programmer, full-stack.',
  createdAt: Date.now(),
};

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private db: Firestore;
  private collectionRoot = 'posts';

  constructor() {
    this.db = getFirestore(firebaseApp);
  }

  public getPosts(
    lastDoc: QueryDocumentSnapshot | undefined,
    limit = 5
  ): DocumentObservable {
    return new Observable((observer) => {
      const ref = collection(this.db, this.collectionRoot);
      const constraints = [orderBy('createdAt', 'desc'), limitBy(limit)];
      lastDoc && constraints.push(startAfter(lastDoc));
      const q = query(ref, ...constraints);
      getDocs(q)
        .then((result) => {
          const { docs } = result;
          observer.next(docs);
        })
        .catch((error) => observer.error(error))
        .finally(() => observer.complete());
    });
  }

  public getPost(key: string): Observable<Post> {
    return of(DUMMY_POST).pipe(delay(1000));
  }

  public watchForNewPosts(): DocumentObservable {
    return new Observable((observer) => {
      let unsubscribe: ReturnType<typeof onSnapshot> = () => 0;
      const listenForNewestPosts = () => {
        const ref = collection(this.db, this.collectionRoot);
        const currentTime = Date.now();
        const q = query(ref, orderBy('createdAt'), startAt(currentTime));
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const { docs } = snapshot;
            if (!docs.length) return;
            observer.next(docs);
            unsubscribe();
            listenForNewestPosts(); // 回帰的なのです
          },
          (error) => observer.error(error),
          () => observer.complete()
        );
      };
      listenForNewestPosts();
      return () => unsubscribe();
    });
  }

  public createPost(post: Post) {
    const ref = collection(this.db, this.collectionRoot);
    return addDoc(ref, post);
  }

  public updatePost(key: string, post: Post): Promise<void> {
    return Promise.resolve();
  }

  public deletePost(key: string, post: Post): Promise<void> {
    return Promise.resolve();
  }
}
