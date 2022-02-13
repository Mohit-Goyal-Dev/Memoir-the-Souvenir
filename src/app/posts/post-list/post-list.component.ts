import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(
    public _postsService: PostsService,
    private authService: AuthService
  ) {}
  // posts = [
  //   { title: 'First Post', content: 'This is my very first post!' },
  //   { title: 'Second Post', content: 'This is my 2nd post!' },
  //   { title: 'Third Post', content: 'This is my 3rd post!' },
  // ];
  // @Input('posts') posts: Post[] = [];
  posts: Post[] = [];
  private postsSub: Subscription;
  private authListnerSub: Subscription;
  userId: string;
  userAuthenticated = false;
  isLoading = false;
  totalPostCount = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOption = [1, 2, 5, 10];
  ngOnInit() {
    this.isLoading = true;
    // this.posts = this._postsService.getPosts();
    this._postsService.getPosts(this.postsPerPage, 1);

    this.postsSub = this._postsService
      .getUpdatedPosts()
      .subscribe((postsData: { posts: Post[]; postsCount: number }) => {
        this.isLoading = false;
        this.posts = postsData.posts;
        this.totalPostCount = postsData.postsCount;
      });
    this.userId = this.authService.getUserId();
    this.userAuthenticated = this.authService.getUserAuthStatus();
    this.authListnerSub = this.authService
      .getAuthStatusListner()
      .subscribe((isAuthenticated) => {
        this.userAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this._postsService.deletePost(postId).subscribe(
      () => {
        this._postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authListnerSub.unsubscribe();
  }
  onPaginatorChange(pageEvent: PageEvent) {
    this.isLoading = true;
    this.postsPerPage = pageEvent.pageSize;
    this.currentPage = pageEvent.pageIndex + 1;
    this._postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
