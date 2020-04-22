import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { NotifyService } from 'src/app/services/notify.service';
import { HelperService } from 'src/app/services/helper.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreatePostSongComponent implements OnInit {
  public Editor = ClassicEditor;
  public publish: any;
  public config = {
    language: 'vi',
  }

  createPost: FormGroup;
  constructor(
    public translate: TranslateService,
    private postApiService: ApiService,
    public notify: NotifyService,
    private helper: HelperService
  ) { }
  create_post_validation_messages = {
    'post_title': [
      { type: 'required', message: 'Tiêu đề bài viết không được bỏ trống' },
      { type: 'minlength', message: 'Tiêu đề bài viết không được dưới 3 ký tự' }
    ],
    'post_slug': [
      { type: 'required', message: 'Tiêu đề bài viết không được bỏ trống' },
      { type: 'minlength', message: 'Tiêu đề bài viết không được dưới 3 ký tự' }
    ],
  };
  ngOnInit() {
    this.createPost = new FormGroup({
      post_title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      post_slug: new FormControl('', [Validators.required, Validators.minLength(3)]),
      post_excerpt: new FormControl(),
      post_status: new FormControl(),
      publish_at: new FormControl(),
      post_content: new FormControl(),
    });
  }
  post_title_change = (event: any) => {
    let post_title = event.target.value;
    let post_slug = this.helper.convertToSlug(post_title);
    this.createPost.get('post_slug').setValue(post_slug)
  }


  submit = () => {
    if (this.createPost.valid) {
      let data = this.createPost.value;
      this.postApiService.createPost(data).then(result => {
        if (result.result_code == 0) {
          this.notify.success('Tạo bài viết thành công');
          this.postApiService.listPost({}).then(data => {});
        } else {
          this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
        }
      }).catch(error => {
      })
    }
  }

}
