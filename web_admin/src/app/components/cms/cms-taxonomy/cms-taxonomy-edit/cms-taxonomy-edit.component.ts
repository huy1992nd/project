import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from 'src/app/services/notify.service';
import {TranslateService} from '@ngx-translate/core';
import { HelperService } from 'src/app/services/helper.service';

@Component({
	selector: 'app-cms-taxonomy-edit',
	templateUrl: './cms-taxonomy-edit.component.html',
	styleUrls: ['./cms-taxonomy-edit.component.css']
})
export class CmsTaxonomyEditComponent implements OnInit {
	public defaultStatus:any;
  	constructor(
		private api: ApiService,
		private route: ActivatedRoute,
		public translate: TranslateService,
		public notify: NotifyService,
		private helper: HelperService
  	) { }

  	edit_taxonomy_validation_messages = {
		'name': [
			{ type: 'required', message: 'Tiêu đề bài viết không được bỏ trống' },
			{ type: 'minlength', message: 'Tiêu đề bài viết không được dưới 3 ký tự' }
		],
		'slug': [
			{ type: 'required', message: 'Tiêu đề bài viết không được bỏ trống' },
			{ type: 'minlength', message: 'Tiêu đề bài viết không được dưới 3 ký tự' }
		],
	};

	editTaxonomy: FormGroup;

	currentTaxonomy = {
		name: '',
		slug: '',
		parent: 0,
		status: 'active',
	}

	listTaxonomy = {data: []}

  	ngOnInit() {
		let id = this.route.snapshot.params.id;
		this.getEditTaxonomy({id: id}); //get current taxonomy
		this.getListTaxonomy(); //get list taxonomy
		this.editTaxonomy = new FormGroup({
			name: new FormControl(this.currentTaxonomy.name, [Validators.required, Validators.minLength(3)]),
			slug: new FormControl(this.currentTaxonomy.slug, [Validators.required, Validators.minLength(3)]),
			parent: new FormControl(),
			status: new FormControl(),
		});
	}

	/**
	 * 
	 */
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
	getEditTaxonomy(id: any) {
		this.api.getEditTaxonomy(id).then(result => {
			//console.log(result)
			this.currentTaxonomy = result.data;
			this.editTaxonomy.get('name').setValue(result.data.name);
			this.editTaxonomy.get('slug').setValue(result.data.slug);
			this.editTaxonomy.get('parent').setValue(result.data.parent);
			this.editTaxonomy.get('status').setValue(result.data.status);
			console.log(this.currentTaxonomy);
		}).catch(error => {
			console.log('err: ', error);
		})
	}

	name_change(event: any) {
		let name = event.target.value;
		let slug = this.helper.convertToSlug(name);
		this.editTaxonomy.get('slug').setValue(slug)
	}

	submit() {
		if (this.editTaxonomy.valid) {
		  let data = this.editTaxonomy.value;
		  data.id = this.route.snapshot.params.id;
		  this.api.postEditTaxonomy(data).then(result => {
			if (result.result_code == 0) {
			  this.notify.success('Sửa chuyên mục thành công');
			
			} else {
			  this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
			}
		  }).catch(error => {
		  })
		}
	}

}
