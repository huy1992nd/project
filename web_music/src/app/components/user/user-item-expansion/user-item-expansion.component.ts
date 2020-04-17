import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-user-item-expansion',
  templateUrl: './user-item-expansion.component.html',
  styleUrls: ['./user-item-expansion.component.css']
})
export class UserItemExpansionComponent implements OnInit {
  @Input() selectedUser: any;
  dataSource: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  tableColumns: string[] = [
    'icon',
    'product_name',
    'campaign_id',
    'price',
    'deposit',
    'quantity',
    'product_type',
    // 'type',
    'customer_code'
  ];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {

  }


}
