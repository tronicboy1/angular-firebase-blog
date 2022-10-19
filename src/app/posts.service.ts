import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit as limitBy,
  startAfter,
  onSnapshot,
  startAt,
} from "firebase/firestore";
import type { QueryDocumentSnapshot, DocumentData, DocumentSnapshot } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { firebaseApp } from "@firebase/index";
import { Post, PostWithoutTimestamps } from "@custom-types/posts";

type DocumentsObservable = Observable<QueryDocumentSnapshot<DocumentData>[]>;

@Injectable({
  providedIn: "root",
})
export class PostsService {
  private db: Firestore;
  private collectionRoot = "posts";

  constructor() {
    this.db = getFirestore(firebaseApp);
  }

  public getPosts(lastDoc: QueryDocumentSnapshot | undefined, limit = 5): DocumentsObservable {
    return new Observable((observer) => {
      const ref = collection(this.db, this.collectionRoot);
      const constraints = [orderBy("createdAt", "desc"), limitBy(limit)];
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

  public getPost(key: string): Observable<DocumentSnapshot<DocumentData>> {
    return new Observable((observer) => {
      const ref = doc(this.db, `${this.collectionRoot}/${key}`);
      getDoc(ref)
        .then((doc) => observer.next(doc))
        .catch((error) => observer.error(error))
        .finally(() => observer.complete());
    });
  }

  public watchForNewPosts(): DocumentsObservable {
    return new Observable((observer) => {
      let unsubscribe: ReturnType<typeof onSnapshot> = () => 0;
      const listenForNewestPosts = () => {
        const ref = collection(this.db, this.collectionRoot);
        const currentTime = Date.now();
        const q = query(ref, orderBy("createdAt"), startAt(currentTime));
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
          () => observer.complete(),
        );
      };
      listenForNewestPosts();
      return () => unsubscribe();
    });
  }

  public createPost(postWithoutTimestamps: PostWithoutTimestamps) {
    const ref = collection(this.db, this.collectionRoot);
    const postWithDates: Post = {
      ...postWithoutTimestamps,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return addDoc(ref, postWithDates);
  }

  public updatePost(key: string, postWithoutTimestamps: PostWithoutTimestamps): Promise<void> {
    const ref = doc(this.db, `${this.collectionRoot}/${key}`);
    return getDoc(ref).then((result) => {
      const originalPost = result.data() as Post | undefined;
      if (!originalPost) throw Error("Cannot update a non existant post.");
      const modifiedPost: Post = {
        ...originalPost,
        ...postWithoutTimestamps,
        updatedAt: Date.now(),
      };
      return updateDoc(ref, modifiedPost);
    });
  }

  public deletePost(key: string): Promise<void> {
    const ref = doc(this.db, `${this.collectionRoot}/${key}`);
    return deleteDoc(ref);
  }
}
