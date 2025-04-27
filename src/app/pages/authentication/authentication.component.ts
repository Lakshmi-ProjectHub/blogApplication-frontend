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
  activeForm: string = 'signin';


  name: string = '';
  email: string = '';
  password: string = '';
  constructor(private userService: UserService,
     private router: Router,
     private snackBar: MatSnackBar

    ) {}

    showMessage(message: string, action: string = 'Close') {
      this.snackBar.open(message, action, {
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }

    toggleForm(form: string) {
    this.activeForm = form === 'signin' ? 'signin' : 'signup';
  }
  
  onSignUp() {
    if (!this.name || !this.email || !this.password) {
      this.showMessage("Please fill in all fields correctly.");
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
          this.resetForm();

        } else {
          this.showMessage('Registration failed: ' + response.message);
        }
      },
      (error: any) => {
        console.error('Error during registration', error);
        this.showMessage('Registration failed due to an error');
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
        console.log('Login response:', response);
        if (response.body && response.body.status === 200) {
          this.showMessage('Login successful!');
          this.resetForm();
          this.router.navigate(['/view-all']).then(() => {
            location.reload(); 
          });
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
    this.activeForm = 'signin';
  }

 isEmailValid(): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return this.email ? !emailRegex.test(this.email) : false;
}

}
