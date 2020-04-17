import { Component, OnInit } from '@angular/core';
import { LazyLoadScriptService } from './../../common/lazyLoadScript';
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  constructor(
    private lazyLoadService: LazyLoadScriptService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('aaa')
    this.lazyLoadService.loadScript('./assets/js/new.js').subscribe(_ => { });
      
	}

}
