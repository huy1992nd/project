import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { NotifyService } from 'src/app/services/notify.service';
import {TranslateService} from '@ngx-translate/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-cms-menu-node-list',
    templateUrl: './cms-menu-node-list.component.html',
    styleUrls: ['./cms-menu-node-list.component.css']
})
export class CmsMenuNodeListComponent implements OnInit {
    public selectedPage:any;
    public selectedTaxonomy:any;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    listMenuNode: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

    displayedColumns: string[] = ['id', 'name', 'slug', 'parent', 'status', 'thaotac'];
    dataSource = this.listMenuNode;

    menuId = 0;
    defaultParent = 0;
    defaultStatus = 'active';
    defaultType = 'page';
    setHome = 0;
    listPage = [];
    listTaxonomy = [];

    createMenuNodeValidateMessage = {
        name: [
            { type: 'required', message: 'Tiêu đề không được bỏ trống' },
            { type: 'minlength', message: 'Tiêu đề không được dưới 3 ký tự' }
        ],
    };

    createMenuNode: FormGroup;

    constructor(
        private api: ApiService,
        public notify: NotifyService,
        public translate: TranslateService,
        private helper: HelperService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.menuId = this.route.snapshot.params.id;
        this.getListMenuNode(this.menuId);
        this.getListPost();
        this.getListTaxonomy();

        this.createMenuNode = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(3)]),
            slug: new FormControl('', [Validators.required, Validators.minLength(3)]),
            parent: new FormControl(),
            status: new FormControl(),
            menu_type: new FormControl(),
            is_home: new FormControl(),
            menu_page: new FormControl(),
            menu_taxonomy: new FormControl()
        });

        this.createMenuNode.get('parent').setValue('0');
        this.createMenuNode.get('status').setValue('active');
        this.createMenuNode.get('is_home').setValue('0');
        this.createMenuNode.get('menu_type').setValue('page');
    }

    getListMenuNode(id) {
        this.api.getListMenuNode({menu_id: id}).then(result => {
            // console.log('data: ', result.data);
            this.listMenuNode.data = result.data;
        }).catch(error => {
            console.log('err: ', error);
        });
    }

    getListPost = () => {
        this.api.listPost({post_type: 'post'}).then(result => {
            this.listPage = result.data;

        }).catch(error => {
            console.log('err: ', error);
        });
    }

    getListTaxonomy = () => {
        this.api.getListTaxonomy({}).then(result => {
            this.listTaxonomy = result.data;
        }).catch(error => {
            console.log('err: ', error);
        });
    }

    submit = () => {
        if (this.createMenuNode.valid) {
            const data = this.createMenuNode.value;
            data.menu_id = this.menuId;
            this.api.postCreateMenuNode(data).then(result => {
                if (result.result_code === 0) {
                    this.getListMenuNode(this.menuId);
                    this.notify.success('Tạo Menu node thành công');
                } else {
                    this.notify.error(this.translate.instant(`error_code.${result.result_code}`));
                }
            }).catch(error => {
            });
        }
    }

    deleteMenu = (id) => {

    }
}

