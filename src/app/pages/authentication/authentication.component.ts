import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,

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
  constructor(private userService: UserService,
     private router: Router,
     private snackBar: MatSnackBar

    ) {}

    showMessage(message: string, action: string = 'Close') {
      this.snackBar.open(message, action, {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }

    toggleForm(form: string) {
    this.activeForm = form === 'signin' ? 'signin' : 'signup';
  }
  // onSignUp() {
  //   const user = {
  //     name: this.name,
  //     email: this.email,
  //     password: this.password
  //   };

  //   this.userService.registerUser(user).subscribe(
  //     (response: any) => {
  //       if (response.status === 201) {
  //         alert('User registered successfully!');
  //       } else {
  //         alert('Registration failed: ' + response.message);
  //       }
  //     },
  //     (error: any) => {
  //       console.error('Error during registration', error);
  //       alert('Registration failed due to an error');
  //     }
  //   );
  // }



  // onSignIn() {
  //   const user = {
  //     email: this.email,
  //     password: this.password
  //   };

  //   this.userService.loginUser(user).subscribe(
  //     (response: any) => {
  //       console.log('Login response:', response); // Log response for debugging
  //       if (response.status === 200) {
  //         // Successful login
  //         alert('Login successful!');
  //         this.router.navigateByUrl("/view-all"); // Redirect to view-all page
  //       } else {
  //         // Invalid credentials
  //         alert('Invalid credentials.');
  //       }
  //     },
  //     (error: any) => {
  //       // This part is triggered if the backend sends an error (e.g., 401 Unauthorized)
  //       console.error('Error during login', error);
  //       alert('Invalid credentials.');
  //     }
  //   );
  // }

  onSignUp() {
    if (!this.name || !this.email || !this.password) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.userService.registerUser(user).subscribe(
      (response: any) => {
        if (response.status === 201) {
          this.showMessage('User registered successfully!');
          this.resetForm(); // Reset form fields after successful login

        } else {
          this.showMessage('Registration failed: ' + response.message);
        }
      },
      (error: any) => {
        console.error('Error during registration', error);
        alert('Registration failed due to an error');
      }
    );
  }

  onSignIn() {
    if (!this.email || !this.password) {
      this.showMessage("Please fill in all fields correctly.");
      return;
    }

    const user = {
      email: this.email,
      password: this.password
    };

    this.userService.loginUser(user).subscribe(
      (response: any) => {
        console.log('Login response:', response); // Log response for debugging
        if (response.body && response.body.status === 200) {
          this.showMessage('Login successful!');
          this.router.navigateByUrl("/view-all"); // Redirect to view-all page
          this.resetForm(); // Reset form fields after successful login

        } else {
          alert('Invalid credentials.');
        }
      },
      (error: any) => {
        console.error('Error during login', error);
        this.showMessage('Invalid credentials.');
      }
    );
  }
  resetForm() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.activeForm = 'signin'; // Optionally, you can redirect to signin after signup
  }



 // Method to validate email using regex
 isEmailValid(): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Ensure that the return value is always a boolean
  return this.email ? !emailRegex.test(this.email) : false;
}

}
