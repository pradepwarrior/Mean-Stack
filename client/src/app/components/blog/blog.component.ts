import { Component, OnInit } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {BlogService} from '../../services/blog.service';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  messageClass;
  message;
  newPost = false
  loadingBlogs = false
  form;
  processing=false;
  username;
  blogPosts;

  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private blogService:BlogService
  ) {
    this.createNewBlogForm()
   }


  createNewBlogForm(){
    this.form = this.formBuilder.group({
      title:['',Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
 
      ])],
     body:['',Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    })
  }


  enableformNewblog(){
    this.form.get('title').enable();
    this.form.get('body').enable();

  }

  disableformNewblog(){

    this.form.get('title').disable();
    this.form.get('body').disable();

  }
 
  newBlogForm() {
    this.newPost = true
  }

  reloadBlogForm() {
    this.loadingBlogs = true;
    this.getAllBlogs();
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 3000)
  }


  drftComment() {

  }


  onBlogSubmit(){

    this.processing=true
    this.disableformNewblog();
    const blog={
      title:this.form.get('title').value,
      body:this.form.get('body').value,
      createdBy:this.username
    }

    this.blogService.newBlog(blog).subscribe(data=>{
      if(!data.success){
        this.messageClass='alert alert-danger';
        this.message=data.message;
        this.processing=false;
        this.enableformNewblog()
      }else{
        this.messageClass='alert alert-success';
        this.message=data.message;
        this.getAllBlogs();
        setTimeout(() => {
          this.newPost=false;
          this.processing=false;
          this.message=false;
          this.form.reset();
          this.enableformNewblog()
        }, 2000)
      }
    })

  }

goBack(){
  window.location.reload();
}

getAllBlogs(){
  this.blogService.getAllBlogs().subscribe(data=>{
    this.blogPosts=data.blogs
  })
}

  ngOnInit() {
    this.authService.getProfile().subscribe(profile=>{
      this.username=profile.user.username
    })
this.getAllBlogs()
  }

}
