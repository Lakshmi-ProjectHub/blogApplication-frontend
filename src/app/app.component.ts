import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'blogWeb';
  sessionUser: any;
  isLoggedIn = false;
  user = null;
  router: any;

  constructor(
    
    private http: HttpClient,
    public userService: UserService,
    public authService: UserService,
  ) {}

  ngOnInit(): void{
      this.http.get('http://localhost:8080/api/user/session', { withCredentials: true })
        .subscribe({
          next: (data: any) => {
            this.sessionUser = data;
          },
          error: (err: any)=> {
            console.error('Not logged in or session expired', err);
          }
        })

}
}