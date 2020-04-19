import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from './../../../../services/data.service';
import { ApiService } from 'src/app/services/api.service';
import { NotifyService } from 'src/app/services/notify.service';
import {TranslateService} from '@ngx-translate/core';
import  {PageTable} from '../../../../common/pageTable';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListPostSongComponent implements OnInit {
  listPost: any =[];
  currentUser: any;
  public subPost:any;
  public  pageTable = new  PageTable();
  constructor(
    private postApiService: ApiService,
    private dataService: DataService,
		public notify: NotifyService,
		public translate: TranslateService,
  ) { }

  ngOnInit() {
    // this.getListPost();
    this.currentUser = this.dataService.currentUser.getValue();
    this.subPost = this.dataService.listPost.subscribe(data=>{
      if(!data)
          return;
      this.listPost = data;
      this.paginate();
    });
    
  }


  
  getListPost() {
    let list = this.dataService.listPost.getValue();
    if (list) {
      this.listPost = list;
    } else {
      this.postApiService.listPost({}).then(data => {});
    }
  }

  // getListPost = () => {
	// 	this.postApiService.listPost({post_type: 'post'}).then(result => {
  //     this.listPost = result.data;
  //     this.paginate();

	// 	}).catch(error => {
	// 		console.log('err: ', error);
	// 	})
  // }
  
  paginate(){
    // this.pageTable.currentPage = this.page-1;
    this.pageTable.itemsPerPage= 12;
    this.pageTable.items = this.listPost;
    this.pageTable.groupToPages();
  }

	deletePost = (id) => {
		var r = confirm("Chắc chắn xóa nội dung này!");
		if (r == true) {
			this.postApiService.getDeletePost({id}).then(
				result => {
					if (result.result_code == 0) {
						this.notify.success('Xóa bài viết thành công');
            this.postApiService.listPost({}).then(data => {});
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
  
  ngOnDestroy() {
    this.subPost.unsubscribe();
  }

}
