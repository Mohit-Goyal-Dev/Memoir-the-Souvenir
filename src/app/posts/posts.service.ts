import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postsCount: number }>();
  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts(postsPerPage, currentPageSel) {
    const queryParams = `?pageSize=${postsPerPage}&currentPageSel=${currentPageSel}`;
    this.httpClient
      .get<{ message: string; posts: any; totalPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postsData) => {
          //using map to transform data into our front-end model having id field instead of _id
          return {
            posts: postsData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postsData.totalPosts,
          };
        })
      )
      .subscribe((mappedPostsData) => {
        this.posts = mappedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postsCount: mappedPostsData.maxPosts,
        });
      });
  }
  getPost(postId: string) {
    return this.httpClient.get<{
      message: string;
      post: {
        _id: string;
        title: string;
        content: string;
        imagePath: string;
        creator: string;
      };
    }>(`${BACKEND_URL}/${postId}`);
  }
  getUpdatedPosts() {
    return this.postsUpdated.asObservable();
  }
  addNewPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.httpClient
      .post<{ message: string; postObj: Post }>(BACKEND_URL, postData)
      .subscribe((postRes) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.httpClient.delete(`${BACKEND_URL}/${postId}`);
  }

  updatePost(
    postId: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: postId,
        title,
        content,
        imagePath: image,
        creator: null,
      };
    }
    this.httpClient
      .put(`${BACKEND_URL}/${postId}`, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }
}
