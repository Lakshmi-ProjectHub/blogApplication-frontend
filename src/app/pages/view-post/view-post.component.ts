import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../service/post.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../service/comment.service';
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-view-post',
  standalone: true,
  templateUrl: './view-post.component.html',
  styleUrl: './view-post.component.scss',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    MatChipsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ]
})
export class ViewPostComponent{

  postData: any;
  postId: number = 0;

  // lakshmi
  commentForm!:FormGroup;
  comments:any;

  constructor(private PostService: PostService,
    private activatedRoute: ActivatedRoute,
    private matSnackBar: MatSnackBar,
  // lakshmi
  private fb:FormBuilder,
  private commentService:CommentService
   ) { this.postId= this.activatedRoute.snapshot.params['id']; }


  ngOnInit(){
    console.log(this.postId);
    this.getPostById();
  //lakshmi
  this.commentForm =this.fb.group({
    postedBy:[null,Validators.required],
    content:[null,Validators.required]
  })

   }
  getPostById(){
    this.PostService.getPostById(this.postId).subscribe(res => {
      this.postData = res;
      console.log(res);
      this.getCommentsByPost(); //get comments for post

    }, (error:any) =>{
      this.matSnackBar.open('Error while fetching post details', 'OK');
    })
  }

    likePost(){
      this.PostService.likePost(this.postId).subscribe(response => {
        this.matSnackBar.open('Post liked successfully', 'OK', { duration: 2000 });
        this.getPostById();
      }, (error) =>{
        this.matSnackBar.open('Error while liking the post', 'OK');
      })
    }


    // lakshmi
    publishComment(){
      const postedBy = this.commentForm.get('postedBy')?.value;
      const content = this.commentForm.get('content')?.value;

      this.commentService.createComment(this.postId,postedBy,content).subscribe(res=>{
        this.matSnackBar.open(" Comment Published Sucessfully!!!" ,"ok");
        this.getCommentsByPost(); //for one particualr post
        this.commentForm.reset(); // Resets the form


      },error=>{
        this.matSnackBar.open("Something went wrong!!!" ,"ok")
      })
    }
    getCommentsByPost(){
      this.commentService.getAllCommentsByPost(this.postId).subscribe(res=>{
        this.comments=res;
      },error=>{
        this.matSnackBar.open("Something went wrong!!!" ,"ok")
      })
    }

}


