import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from '../../service/post.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-user-post',
  standalone: true,
  templateUrl: './view-user-post.component.html',
  styleUrl: './view-user-post.component.scss',
  imports: [
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterModule,
    FormsModule,
  ]
})
export class ViewUserPostComponent {

  allPosts: any;
  userId: number = 0;
  sessionUser: any;

  constructor(private postService: PostService,private snackBar: MatSnackBar,private http: HttpClient,private activatedRoute: ActivatedRoute) { this.userId = Number(this.activatedRoute.snapshot.paramMap.get('userId'));}

ngOnInit() {
  
    this.getAllPost();
    console.log("Extracted userId from URL:", this.userId);
  }

  getAllPost() {
    this.postService.getPostByUserId(this.userId).subscribe(res => {
      console.log(res);
      this.allPosts = res;
      
    }, error => {
      this.snackBar.open("You didn't post anything!!!!", "Ok")
      })
    
  }
}
