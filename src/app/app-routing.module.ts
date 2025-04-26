import { CreatePostComponent } from './pages/create-post/create-post.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewAllComponent } from './pages/view-all/view-all.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { ViewPostComponent } from './pages/view-post/view-post.component';
import { SearchByNameComponent } from './pages/search-by-name/search-by-name.component';
import { ViewUserPostComponent } from './pages/view-user-post/view-user-post.component';


const routes: Routes = [
{path:'create-post', component: CreatePostComponent},
{path:'view-all', component: ViewAllComponent},
{path:'view-post/:id', component: ViewPostComponent},
{path:'auth',component: AuthenticationComponent},
{path:'search-by-name',component: SearchByNameComponent},
{path: 'view-user-post/:userId', component: ViewUserPostComponent},
{path:'',component: ViewAllComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
