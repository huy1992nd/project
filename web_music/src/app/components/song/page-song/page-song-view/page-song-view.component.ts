import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from 'src/app/services/notify.service';
import {TranslateService} from '@ngx-translate/core';
import { HelperService } from 'src/app/services/helper.service';
@Component({
  selector: 'app-page-song-view',
  templateUrl: './page-song-view.component.html',
  styleUrls: ['./page-song-view.component.css']
})
export class PageSongViewComponent implements OnInit {

  constructor(
    private postApiService: ApiService,
		private route: ActivatedRoute,
		public translate: TranslateService,
		public notify: NotifyService,
		private helper: HelperService
  ) { }

	currentPost = {
		post_title: '',
		post_slug: '',
		post_content: '',
		post_status:'',
		post_excerpt:'',
		post_author:'',
		publish_at:null,
	}

	ngOnInit() {
		this.route.params
    .subscribe((value) => {
      let id = this.route.snapshot.params.id;
      this.getEditPost({id: id});
    });
		let id = this.route.snapshot.params.id;
		
	}

	getEditPost = (postId: any) => {
		this.postApiService.getEditPost(postId).then(result => {
			this.currentPost = result.data;
		}).catch(error => {
			console.log('err: ', error);
		})
	}

}
