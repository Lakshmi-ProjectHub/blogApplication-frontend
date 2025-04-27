import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedInSubject = new BehaviorSubject<boolean>(true);
  loggedIn$ = this.loggedInSubject.asObservable();
  private user: any = null;

  private baseUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient, private router: Router) {}

logout() {
  this.http.post('http://localhost:8080/api/user/logout', {}, { withCredentials: true }).subscribe({
    next: () => {
      this.user = null;
      this.loggedInSubject.next(false);
      console.log("Logged out and session cleared");
      
      this.router.navigate(['/auth']).then(() => {
        location.reload();
      });
    },
    error: (err) => {
      console.error('Logout failed', err);
    }
  });
}


  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, userData, { withCredentials: true });
  }

  loginUser(user: any) {
    return this.http.post<any>('http://localhost:8080/api/user/signin', user, { observe: 'response'  , withCredentials: true});
  }
  getUser() {
    return this.user;
  }
  


}
