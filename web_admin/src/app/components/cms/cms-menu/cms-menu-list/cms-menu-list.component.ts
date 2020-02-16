import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { NotifyService } from 'src/app/services/notify.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
	selector: 'app-cms-menu-list',
	templateUrl: './cms-menu-list.component.html',
	styleUrls: ['./cms-menu-list.component.css']
})
export class CmsMenuListComponent implements OnInit {
	
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	listMenu: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

	displayedColumns: string[] = ['id', 'name', 'position', 'status', 'thaotac'];
	dataSource = this.listMenu;

	constructor(
		private api: ApiService,
		public notify: NotifyService,
		public translate: TranslateService,
	) {
		let paginator = 10;
	}

	ngOnInit() {
		this.getlistMenu();
	}

	getlistMenu = () => {
		this.api.getListMenu({}).then(result => {
			this.listMenu.data = result.data;

		}).catch(error => {
			console.log('err: ', error);
		})
	}

}
