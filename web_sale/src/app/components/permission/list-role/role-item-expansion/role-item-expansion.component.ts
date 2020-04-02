import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-role-item-expansion',
  templateUrl: './role-item-expansion.component.html',
  styleUrls: ['./role-item-expansion.component.css']
})
export class RoleItemExpansionComponent implements OnInit {
  @Input() Role: any;
  constructor() { }

  ngOnInit() {
  }

}
