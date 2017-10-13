import { Component, OnInit } from '@angular/core';
import {BlogService} from '../../../services/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {
message;
messageClass;
foundBlog=false;
blog;
currentUrl;
processing=false;
  constructor(
    private blogService:BlogService,
    private activatedRoute:ActivatedRoute,
    private router:Router
  ) { }

  deleteBlog(){
    this.processing = true
    this.blogService.deleteBlog(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.message = data.message;
        this.messageClass = "alert alert-danger";
        this.processing = false;
      } else {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        setTimeout (()=>{
          this.router.navigate(['/blog'])
        },2000)
      }
    })

  }
  ngOnInit() {

    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = "Blog not Found"
      } else {

        this.blog ={
          title:data.blog.title,
          body:data.blog.body,
          createdBy:data.blog.createdBy,
          createAt:data.blog.createAt
        }
        this.foundBlog=true
       
      }
    })


  }

}
