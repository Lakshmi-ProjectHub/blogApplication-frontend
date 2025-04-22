import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-authentication',
  standalone: true,  // Keep standalone flag
  imports: [
    // Import other necessary modules here like CommonModule, FormsModule, etc.
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent {
  activeForm: string = 'signin'; // Default to 'signin'


  name: string = '';
  email: string = '';
  password: string = '';
  constructor(private userService: UserService, private router: Router) {}


  toggleForm(form: string) {
    this.activeForm = form === 'signin' ? 'signin' : 'signup';
  }
  onSignUp() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.userService.registerUser(user).subscribe(
      (response: any) => {
        if (response.status === 201) {
          alert('User registered successfully!');
        } else {
          alert('Registration failed: ' + response.message);
        }
      },
      (error: any) => {
        console.error('Error during registration', error);
        alert('Registration failed due to an error');
      }
    );
  }



  onSignIn() {
    const user = {
      email: this.email,
      password: this.password
    };

    this.userService.loginUser(user).subscribe(
      (response: any) => {
        console.log('Login response:', response); // Log response for debugging
        if (response.status === 200) {
          // Successful login
          alert('Login successful!');
          this.router.navigateByUrl("/view-all"); // Redirect to view-all page
        } else {
          // Invalid credentials
          alert('Invalid credentials.');
        }
      },
      (error: any) => {
        // This part is triggered if the backend sends an error (e.g., 401 Unauthorized)
        console.error('Error during login', error);
        alert('Invalid credentials.');
      }
    );
  }



}
