import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernaemeMessage;


  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private router: Router

  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.formbuilder.group({
      // email: ['',Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ])],
      confirm: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirm') })
  }

  matchingPasswords(password, confirm) {//pass match
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null
      } else {
        return { 'matchingPasswords': true }
      }
    }
  }


  disableForm() {
    this.form.controls['email'].disable()
    this.form.controls['username'].disable()
    this.form.controls['password'].disable()
    this.form.controls['confirm'].disable()
  }

  enableForm() {

    this.form.controls['email'].enable()
    this.form.controls['username'].enable()
    this.form.controls['password'].enable()
    this.form.controls['confirm'].enable()
  }


  ///form submited
  onRegisterSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }
    this.authService.registerUser(user).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm()
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        console.log(data);
        setTimeout(() => {
          this.router.navigate(['/login'])
        }, 2000)

      }

    });
  }

  checkEmail() {
    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      if (!data.success) {
        this.emailValid = false;
        this.emailMessage = data.message
      }
      else {
        this.emailValid = true;
        this.emailMessage = data.message
      }
    })
  }

  checkUsername() {
    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      if (!data.success) {
        this.usernameValid = false;
        this.usernaemeMessage = data.message
      }
      else {
        this.usernameValid = true;
        this.usernaemeMessage = data.message
      }
    })
  }


  ngOnInit() {
  }

}
