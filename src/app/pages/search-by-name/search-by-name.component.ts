import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from '../../service/post.service';
import { CommonModule } from '@angular/common'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-search-by-name',
  templateUrl: './search-by-name.component.html',
  standalone: true,
  styleUrls: ['./search-by-name.component.scss'],
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
export class SearchByNameComponent {

  result: any = [];
  name: any = "";

  constructor(private postService: PostService,
              private snackBar: MatSnackBar) {}

  searchByName() {
    this.postService.searchByName(this.name).subscribe(res => {
      this.result = res;
      console.log(this.result);
    }, error => {
      this.snackBar.open("Enter something to search!!!!", "Ok");
    });
  }

}
