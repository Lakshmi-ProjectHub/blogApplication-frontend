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
    MatChipsModule
  ]
})
export class ViewPostComponent{
 
  postData: any;
  postId: number = 0;
  
  constructor(private PostService: PostService,private activatedRoute: ActivatedRoute,private matSnackBar: MatSnackBar) { this.postId= this.activatedRoute.snapshot.params['id']; }
  

  ngOnInit(){
    console.log(this.postId);
    this.getPostById();
    // Initialization logic here
  }
  getPostById(){
    this.PostService.getPostById(this.postId).subscribe(res => {
      this.postData = res;
      console.log(res);
    }, (error:any) =>{
      this.matSnackBar.open('Error while fetching post details', 'OK');
    })

  // Add any additional methods or properties as needed


}}
