import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { CommunityComponent } from './community/community.component';
import { RegisterComponent } from './register/register.component';
import { NewPostComponent } from './new-post/new-post.component';
import { ProfileComponent } from './profile/profile.component';
import { NewCommunityComponent } from './new-community/new-community.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { PostListComponent } from './post-list/post-list.component';
import { authGuard } from './auth.guard';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  },
  {
    path: 'login',
    component: LoginpageComponent,
    title: 'Login page',
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'community/:name',
    component: CommunityComponent,
    canActivate: [authGuard],
    title: 'Community',
    children: [
      { path: '', component: PostListComponent },
      {
        path: 'new-post',
        component: NewPostComponent,
      },
      {
        path: 'post/:id',
        component: PostDetailsComponent,
      },
    ],
  },
  {
    path: 'new-community',
    canActivate: [authGuard],
    component: NewCommunityComponent,
  },
  {
    path: 'user/:name',
    component: ProfileComponent,
  },
];

export default routeConfig;
