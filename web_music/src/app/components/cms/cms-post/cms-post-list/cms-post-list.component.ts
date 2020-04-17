import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { NotifyService } from 'src/app/services/notify.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-cms-post-list',
  templateUrl: './cms-post-list.component.html',
  styleUrls: ['./cms-post-list.component.css']
})

export class CmsPostListComponent implements OnInit {

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	listPost: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

	displayedColumns: string[] = ['id', 'thumbnail', 'post_title', 'post_author', 'post_status', 'create_date', 'thaotac'];
	dataSource = this.listPost;
	
	constructor(
		private postApiService: ApiService,
		public notify: NotifyService,
		public translate: TranslateService,
	) {
		let paginator = 10;
	}

	ngOnInit() {
		this.listPost.data = [];
		this.getListPost();
	}

	getListPost = () => {
		this.postApiService.listPost({post_type: 'post'}).then(result => {
			this.listPost.data = result.data;

		}).catch(error => {
			console.log('err: ', error);
		})
	}

	deletePost = (id) => {
		var r = confirm("Chắc chắn xóa nội dung này!");
		if (r == true) {
			this.postApiService.getDeletePost({id}).then(
				result => {
					if (result.result_code == 0) {
						this.notify.success('Xóa bài viết thành công');
						this.getListPost();
					} else {
						this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
					}
				}
			)
			.catch(err => {
				console.log('err: ', err);
			})
		} else {
			
		}
	}

}
