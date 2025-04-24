import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, userData, { withCredentials: true });
  }

  loginUser(user: any) {
    return this.http.post<any>('http://localhost:8080/api/user/signin', user, { observe: 'response'  , withCredentials: true});
  }

}
