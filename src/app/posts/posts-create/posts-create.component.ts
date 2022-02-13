import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  constructor(
    public _postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  private modeType = 'create';
  private postId: string;
  form: FormGroup;
  imagePrev = '';
  editPost: Post;
  isLoading = false;
  authStatusSubscription: Subscription;

  ngOnInit() {
    this.authStatusSubscription = this.authService
      .getAuthStatusListner()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)],
        updateOn: 'blur',
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('postId')) {
        this.modeType = 'edit';
        this.postId = param.get('postId');
        this.isLoading = true;
        this._postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          if (postData.message === 'Fetched Post Successfully!') {
            this.editPost = {
              id: postData.post._id,
              title: postData.post.title,
              content: postData.post.content,
              imagePath: postData.post.imagePath,
              creator: null,
            };
            this.form.setValue({
              title: this.editPost.title,
              content: this.editPost.content,
              image: this.editPost.imagePath,
            });
          }
        });
      } else {
        this.modeType = 'create';
        this.postId = null;
      }
    });
  }

  onImgSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePrev = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.modeType === 'create') {
      this._postsService.addNewPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else if (this.modeType === 'edit') {
      this._postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}
