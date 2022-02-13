import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './auth/auth.guard';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/posts-create/posts-create.component';

const routes: Routes = [
  { path: '', redirectTo: 'posts-list', pathMatch: 'full' },
  { path: 'posts-list', component: PostListComponent },
  {
    path: 'create',
    component: PostCreateComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    canActivate: [AuthGuardService],
  },
  // { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService],
})
export class AppRoutingModule {}
