import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { PostService } from '../../service/post.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule
  ]
})
export class CreatePostComponent implements OnInit {
  postForm!: FormGroup;
  tags: string[] = [];
  userId: number = 0;
  sessionUser: any;
  selectedImageFile: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private postService: PostService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute) { this.userId = Number(this.activatedRoute.snapshot.paramMap.get('userId'));}

    onFileSelected(event: any) {
      if (event.target.files.length > 0) {
        this.selectedImageFile = event.target.files[0];
      }
    }



  ngOnInit() {
    this.postForm = this.fb.group({
      name: [null, Validators.required],
      content: [null, [Validators.required, Validators.maxLength(5000)]],
      img: [null, Validators.required],
      user: [null, Validators.required]
    });
    this.http.get('http://localhost:8080/api/user/session', { withCredentials: true })
        .subscribe({
          next: (data: any) => {
            this.sessionUser = data;
            if (this.sessionUser && this.sessionUser.id) {
              this.postForm.patchValue({
                user: this.sessionUser.id
              });
            }
          },
          error: (err: any)=> {
            console.error('Not logged in or session expired', err);
          }
        })

  }

  add(event: any) {
    const value = (event.value||'').trim();
    if (value) {
      this.tags.push(value);
    }

    event.chipInput!.clear();
  }

  remove(tag:any) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  
  createPost() {
    const formValues = this.postForm.value;

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("content", formValues.content);
    formData.append("userId", formValues.user);
    formData.append("img", this.selectedImageFile);

    this.postService.createNewPost(formData).subscribe({
      next: res => {
        this.snackBar.open("Post Created Successfully!", "Close", {
          duration: 2000
        });
        this.router.navigateByUrl("/");
      },
      error: err => {
        console.error("Error creating post", err);
        this.snackBar.open("Something Went Wrong!", "Ok", {
          duration: 2000
        });
      }
    });
  }

}
