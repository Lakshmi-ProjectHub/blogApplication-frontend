import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const BASIC_URL ="http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  sessionUser: any;

  constructor( private http:HttpClient) {}

  createComment(postId: number, content: string,userId: number): Observable<any> {

    const params = {
      postId: postId.toString(),
      postedBy: userId.toString()
    };

    return this.http.post<any>(BASIC_URL + `api/comments/create`, content, { params });
  }

  getAllCommentsByPost(postId:number):Observable<any>{
    return this.http.get<any>(BASIC_URL + `api/comments/${postId}`);

  }



deleteComment(commentId: number): Observable<any> {
  return this.http.delete<any>( BASIC_URL + `api/comments/delete/${commentId}`);
}

updateComment(commentId: number, newContent: string): Observable<any> {
  const updatedComment = { content: newContent };
  return this.http.put<any>(`${BASIC_URL}api/comments/update/${commentId}`, updatedComment);
}

}
