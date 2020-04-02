import { Component, OnInit } from '@angular/core';

import { MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(
    private dialog: MatDialog
    ) { }

  ngOnInit() {
  }

}
