import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PostService } from '../../service/post.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../service/comment.service';
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
    MatInputModule,
    FormsModule,

  ]
})
export class ViewPostComponent{

  postData: any;
  postId: number = 0;
  isEditingPost = false;
  postForm!: FormGroup;

  // lakshmi
  commentForm!:FormGroup;
  comments:any;

  sessionUser: any; // To store session user data
  

  constructor(private PostService: PostService,
    private activatedRoute: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    private router: Router,
  // lakshmi
  private fb:FormBuilder,
  private commentService:CommentService,
  private http: HttpClient,
  
   ) { this.postId= this.activatedRoute.snapshot.params['id']; }
   


  ngOnInit(){
    console.log(this.postId);
    this.getPostById();

    this.postForm = new FormGroup({
      name: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      img: new FormControl('', Validators.required)
      // Add other form controls as needed
    });

    
  //lakshmi
  this.commentForm =this.fb.group({
    postedBy:[null,Validators.required],
    content:[null,Validators.required]
  })

  this.http.get('http://localhost:8080/api/user/session', { withCredentials: true }).subscribe({
        next: (data: any) => {
          this.sessionUser = data;  // Assuming the backend returns user data
        },
        error: (err: any) => {
          console.error('Not logged in or session expired', err);
        }
      });

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


    editPost() {
      // Enable editing mode
      this.isEditingPost = true;
    }

   
      updatePost() {
        const updatedPostData = this.postForm.value; // Get the updated post data from the form
        
        // Send the updated post to the backend
        this.http.put(`http://localhost:8080/api/posts/${this.postData.id}`, updatedPostData).subscribe({
          next: (updatedPost) => {
            console.log('Post updated successfully', updatedPost);
            this.postData = updatedPost; // Update the postData with the updated post
            // Add any logic here to handle success, such as redirecting or refreshing the post list
          },
          error: (err) => {
            console.error('Error updating post:', err);
          },
          complete: () => {
            this.isEditingPost = false; // Exit the edit mode
            //location.reload(); // Reload the page to reflect changes
          }
        });
      }
      
  
      deletePost() {
        console.log('Post ID:', this.postData.id);
        if (this.postData && this.postData.id) {
          this.http.delete(`http://localhost:8080/api/posts/${this.postData.id}`).subscribe({
            next: () => {
              console.log('Post deleted successfully');
              this.router.navigateByUrl("/");
            },
            error: (err) => {
              console.error('Error deleting post:', err);
            }
          });
        } else {
          console.error('Invalid post ID');
          alert('Invalid post ID');
        }
      }

    // lakshmi
    publishComment(){
      //const postedBy = this.commentForm.get('postedBy')?.value;
      const content = this.commentForm.get('content')?.value;
      
      this.commentService.createComment(this.postId,content,this.sessionUser.id).subscribe(res=>{
        this.matSnackBar.open(" Comment Published Sucessfully!!!" ,"ok");
        this.getCommentsByPost();
        this.commentForm.reset(); 


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


