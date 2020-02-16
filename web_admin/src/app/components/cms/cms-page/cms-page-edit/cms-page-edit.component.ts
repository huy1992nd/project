import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from 'src/app/services/notify.service';
import {TranslateService} from '@ngx-translate/core';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-cms-page-edit',
  templateUrl: './cms-page-edit.component.html',
  styleUrls: ['./cms-page-edit.component.css']
})
export class CmsPageEditComponent implements OnInit {
	public config:any;
  constructor(
		private postApiService: ApiService,
		private route: ActivatedRoute,
		public translate: TranslateService,
		public notify: NotifyService,
		private helper: HelperService
	) { }

	edit_post_validation_messages = {
		'post_title': [
			{ type: 'required', message: 'Tiêu đề bài viết không được bỏ trống' },
			{ type: 'minlength', message: 'Tiêu đề bài viết không được dưới 3 ký tự' }
		],
		'post_slug': [
			{ type: 'required', message: 'Tiêu đề bài viết không được bỏ trống' },
			{ type: 'minlength', message: 'Tiêu đề bài viết không được dưới 3 ký tự' }
		],
	};

	editPost: FormGroup;

	currentPost = {
		post_title: '',
		post_slug: '',
		post_content: '',
		post_status:'',
		post_excerpt:''
	}

	ngOnInit() {
		let id = this.route.snapshot.params.id;
		this.getEditPost({id: id});
		this.editPost = new FormGroup({
			post_title: new FormControl(this.currentPost.post_title, [Validators.required, Validators.minLength(3)]),
			post_slug: new FormControl(this.currentPost.post_slug, [Validators.required, Validators.minLength(3)]),
			post_excerpt: new FormControl(),
			post_status: new FormControl(),
			publish_at: new FormControl(),
			post_content: new FormControl(this.currentPost.post_content),
		});
	}

	getEditPost = (postId: any) => {
		this.postApiService.getEditPost(postId).then(result => {
			//console.log(result)
			this.currentPost = result.data;
			this.editPost.get('post_title').setValue(result.data.post_title);
			this.editPost.get('post_slug').setValue(result.data.post_slug);
			this.editPost.get('post_content').setValue(result.data.post_content);

		}).catch(error => {
			console.log('err: ', error);
		})
	}

	post_title_change = (event: any) => {
		let post_title = event.target.value;
		let post_slug = this.helper.convertToSlug(post_title);
		this.editPost.get('post_slug').setValue(post_slug)
	}

	submit = () => {
		if (this.editPost.valid) {
		  let data = this.editPost.value;
		  data.id = this.route.snapshot.params.id;
		  this.postApiService.postEditPost(data).then(result => {
			if (result.result_code == 0) {
			  this.notify.success('Sửa bài viết thành công');
			
			} else {
			  this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
			}
		  }).catch(error => {
		  })
		}
	}

}
