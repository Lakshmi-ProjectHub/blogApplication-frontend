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

  showCommentForm: boolean = false;
  postData: any;
  postId: number = 0;
  isEditingPost = false;
  postForm!: FormGroup;
  selectedPost: any;
  postOwnerId: any;

  // lakshmi


  sessionUser: any;
  selectedImageFile: any;


  constructor(private PostService: PostService,
    private activatedRoute: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    private router: Router,
  // lakshmi
  private fb:FormBuilder,
  private commentService:CommentService,
  private http: HttpClient,

   ) { this.postId= this.activatedRoute.snapshot.params['id']; }

   onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImageFile = event.target.files[0];
    }
  }



  ngOnInit(){
    console.log(this.postId);
    this.viewPostById();
    this.getPostById();
    console.log(this.comments);


    this.postForm = new FormGroup({
      name: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      img: new FormControl('', Validators.required)
    });


  //lakshmi
  this.commentForm =this.fb.group({
    postedBy:[null,Validators.required],
    content:[null,Validators.required]
  })

  this.http.get('http://localhost:8080/api/user/session', { withCredentials: true }).subscribe({
        next: (data: any) => {
          this.sessionUser = data;
        },
        error: (err: any) => {
          console.error('Not logged in or session expired', err);
        }
      });

   }

  getPostById(){
    this.PostService.getPostById(this.postId).subscribe(res => {
      this.postData = res;
      this.postOwnerId = res.user.id;
      console.log(res);
      this.getCommentsByPost();
    }, (error:any) =>{
      this.matSnackBar.open('Error while fetching post details', 'OK');
    })
  }
  viewPostById(): void{
    const alreadyViewed = localStorage.getItem('viewed-'+ this.postId);
    if (!alreadyViewed) {
      localStorage.setItem('viewed-'+ this.postId, 'true');
      this.PostService.viewPostById(this.postId).subscribe(res => {
      this.postData = res;
      console.log(res);
    }, (error:any) =>{
      this.matSnackBar.open('Error while fetching post details', 'OK');
    })
    location.reload();
  }
  }
    likePost(){
       const AlreadyLiked = localStorage.getItem('liked-'+this.postId);
       if(AlreadyLiked){
         this.matSnackBar.open('You already liked this post', 'OK');
         return;
       }


      this.PostService.likePost(this.postId).subscribe(response => {
        localStorage.setItem('liked-'+this.postId, 'true');
        this.matSnackBar.open('Post liked successfully', 'OK', { duration: 2000 });
        this.getPostById();
      }, (error) =>{
        this.matSnackBar.open('Error while liking the post', 'OK');
      })
    }


    editPost() {
      this.isEditingPost = true;
      this.selectedPost = this.postData;

  this.postForm.patchValue({
    name: this.postData.name,
    //img: this.postData.img,
    content: this.postData.content
  });
    }


      updatePost() {

        const formValues = this.postForm.value;

        const formData = new FormData();
        formData.append("name", formValues.name);
        formData.append("content", formValues.content);
        formData.append("userId", formValues.user);
        formData.append("img", this.selectedImageFile);

        
        this.http.put(`http://localhost:8080/api/posts/${this.postData.id}`, formData).subscribe({
          next: (updatedPost) => {
            console.log('Post updated successfully', updatedPost);
            this.postData = updatedPost;
            this.matSnackBar.open('Post Updated sucessfully', 'OK');

          },
          error: (err) => {
            console.error('Error updating post:', err);
          },
          complete: () => {
            this.isEditingPost = false;
            //location.reload();
          }
        });
      }


      commentForm!:FormGroup;
      comments:any =[];
      deletePost() {
        if (confirm('Are you sure you want to delete this post?')) {
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
        } else {
          console.log('Post deletion cancelled');
        }
      }

    // lakshmi
    publishComment(){
      const content = this.commentForm.get('content')?.value;

      this.commentService.createComment(this.postId,content,this.sessionUser.id).subscribe(res=>{
        this.matSnackBar.open(" Comment Published Sucessfully!!!" ,"ok");
        this.getCommentsByPost();
        this.commentForm.reset();


      },error=>{
        this.matSnackBar.open("Something went wrong!!!" ,"ok")
      })
    }

  getCommentsByPost() {
    this.commentService.getAllCommentsByPost(this.postId).subscribe({
      next: (comments) => {
        console.log('Fetched comments:', comments);

        this.comments = comments.map((comment: { content: any; }) => ({
          ...comment,
          newContent: comment.content
        }));
      },
      error: (err) => {
        console.error('Error fetching comments:', err);
      }
    });
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe({
      next: (response) => {

        if (response.message === 'Comment deleted successfully') {
          this.comments = this.comments.filter((comment: { id: number; }) => comment.id !== commentId);
          this.matSnackBar.open('Comment deleted successfully!', 'OK', { duration: 2000 });
        } else {
          this.matSnackBar.open('Failed to delete comment', 'OK', { duration: 2000 });
        }
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
        this.matSnackBar.open('Failed to delete comment', 'OK', { duration: 2000 });
      }
    });
  }


  editComment(comment: any) {
    if (comment && typeof comment === 'object') {
      comment.isEditing = true;
      comment.newContent = comment.content;
      this.comments = [...this.comments];
    } else {
      console.error('Invalid comment object');
    }
  }

 updateComment(comment: any) {
  if (comment.newContent !== comment.content) {
    const updatedContent = comment.newContent.trim();

    this.commentService.updateComment(comment.id,updatedContent).subscribe({
      next: () => {
        comment.content =updatedContent;
        comment.isEditing = false;
        this.matSnackBar.open('Comment updated successfully!', 'OK', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error updating comment:', err);
        this.matSnackBar.open('Failed to update comment', 'OK', { duration: 2000 });
      }
    });
  } else {
    comment.isEditing = false;
  }
}
  }
