import { CreatePostComponent } from './pages/create-post/create-post.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewAllComponent } from './pages/view-all/view-all.component';
import { HeaderComponent } from './pages/header/header.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { ViewPostComponent } from './pages/view-post/view-post.component';

const routes: Routes = [
{path:'create-post', component: CreatePostComponent},
{path:'view-all', component: ViewAllComponent},
{path:'view-post/:id', component: ViewPostComponent},
{path:'auth',component: AuthenticationComponent},
{path:'',component: ViewAllComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
