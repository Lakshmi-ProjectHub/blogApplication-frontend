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

@Component({
  selector: 'app-view-all',
  standalone: true,
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.scss',
  imports: [
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterModule
  ]
})
export class ViewAllComponent {

  allPosts: any;

  constructor(private postService: PostService,private MatsnackBar: MatSnackBar) { }

ngOnInit() {
    this.getAllPost();
  }

  getAllPost() {
    this.postService.getAllPost().subscribe(res => {
      console.log(res);
      this.allPosts = res;
      
    }, error => {
      this.MatsnackBar.open("Something Went Wrong!!!!", "Ok")
      })
    
  }
    showMessage() {
      this.MatsnackBar.open("To like visit post", "Close", {
        duration: 3000, 
      });
    }
    
}