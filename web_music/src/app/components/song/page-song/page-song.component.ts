import { Component, OnInit } from '@angular/core';
import { DataService } from './../../../services/data.service';
@Component({
  selector: 'app-page-song',
  templateUrl: './page-song.component.html',
  styleUrls: ['./page-song.component.css']
})
export class PageSongComponent implements OnInit {

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.currentMode.next('notification');
  }

}
