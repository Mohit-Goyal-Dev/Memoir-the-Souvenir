import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { AppRoutingModule } from '../app-routing.module';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './posts-create/posts-create.component';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    CommonModule,
    AppRoutingModule,
  ],
})
export class PostsModule {}
