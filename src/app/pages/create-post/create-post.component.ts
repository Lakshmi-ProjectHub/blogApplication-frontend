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
    MatInputModule
  ]
})
export class CreatePostComponent implements OnInit {
  postForm!: FormGroup;
  tags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private postService: PostService, 
  ) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      name: [null, Validators.required],
      content: [null, [Validators.required, Validators.maxLength(5000)]],
      img: [null, Validators.required],
      user: [null, Validators.required]
    });
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
  const data = this.postForm.value;
  data.user = { id: data.user};
  data.tags = this.tags;

  this.postService.createNewPost(data).subscribe({
    next: res => {
      this.snackBar.open("Post Created Successfully!", "Close");
      this.router.navigateByUrl("/");
    },
    error: err => {
      console.error("Error",err);
      this.snackBar.open("Something Went Wrong!", "Ok");
    }
  });
}
}