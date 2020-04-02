import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { NotifyService } from 'src/app/services/notify.service';
import {TranslateService} from '@ngx-translate/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';

@Component({
	selector: 'app-cms-taxonomy-list',
	templateUrl: './cms-taxonomy-list.component.html',
	styleUrls: ['./cms-taxonomy-list.component.css']
})
export class CmsTaxonomyListComponent implements OnInit {
	public defaultParent:any;
	public defaultStatus:any;
  	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	listTaxonomy: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

	displayedColumns: string[] = ['id', 'name', 'parent', 'status', 'thaotac'];
	dataSource = this.listTaxonomy;
	  
	create_taxonomy_validation_messages = {
		'name': [
			{ type: 'required', message: 'Tiêu đề chuyên mục không được bỏ trống' },
			{ type: 'minlength', message: 'Tiêu đề chuyên mục không được dưới 3 ký tự' }
		],
		'slug': [
			{ type: 'required', message: 'Slug chuyên mục không được bỏ trống' },
			{ type: 'minlength', message: 'Slug chuyên mục không được dưới 3 ký tự' }
		],
  	};

  	createTaxonomy: FormGroup;
	
	constructor(
		private api: ApiService,
		public notify: NotifyService,
		public translate: TranslateService,
		private helper: HelperService
	) {
		let paginator = 10;
	}

	ngOnInit() {
		this.createTaxonomy = new FormGroup({
			name: new FormControl('', [Validators.required, Validators.minLength(3)]),
			slug: new FormControl('', [Validators.required, Validators.minLength(3)]),
			parent: new FormControl(),
			status: new FormControl(),
		});

		this.createTaxonomy.get('parent').setValue('0');
		this.createTaxonomy.get('status').setValue('active');

		this.getListTaxonomy();
	}

	name_change (event: any) {
		let name = event.target.value;
		let slug = this.helper.convertToSlug(name);
		this.createTaxonomy.get('slug').setValue(slug)
	}

	getListTaxonomy() {
		this.api.getListTaxonomy({}).then(result => {
			//console.log('data: ', result.data);
			this.listTaxonomy.data = result.data;
		}).catch(error => {
			console.log('err: ', error);
		})
	}

	/**
	 * 
	 */
	deleteTaxonomy (id) {
		var r = confirm("Chắc chắn xóa nội dung này!");
		if (r == true) {
			this.api.getDeleteTaxonomy({id}).then(
				result => {
					if (result.result_code == 0) {
						this.notify.success('Xóa chuyên mục thành công');
						this.getListTaxonomy();
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

	/**
	 * 
	 */
	submit() {
		if (this.createTaxonomy.valid) {
			let data = this.createTaxonomy.value;
			this.api.postCreateTaxonomy(data).then(result => {
				if (result.result_code === 0) {
					this.getListTaxonomy();
					this.notify.success('Tạo chuyên mục thành công');
				} else {
					this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
				}
			}).catch(error => {
			})
		}
	}

}
