import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { HeaderComponent } from './pages/header/header.component';

const routes: Routes = [
  { path: '', component: HeaderComponent, children: [
    { path: 'auth', component: AuthenticationComponent } // Child route for Authentication
  ]},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
