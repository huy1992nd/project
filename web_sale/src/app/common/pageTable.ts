/**
 * Created by Huy on 5/04/2020.
 */
export class PageTable {

  constructor() {
    this.itemsPerPage = 50;
    this.gap = 5;
    this.currentPage = 0;
  }
  public sort = {
    sortingOrder: 'id',
    reverse: false
  };

  public gap: Number;
  public filteredItems = [];
  public groupedItems = [];
  public itemsPerPage: Number;
  public pagedItems = [];
  public currentPage: Number;
  public items = [];
  public start = [];
  public end = [];


  // calculate page in place
  public groupToPages = function () {
    this.pagedItems = [];

    for (var i = 0; i < this.items.length; i++) {
      if (i % this.itemsPerPage === 0) {
        this.pagedItems[Math.floor(i / this.itemsPerPage)] = [this.items[i]];
      } else {
        this.pagedItems[Math.floor(i / this.itemsPerPage)].push(this.items[i]);
      }
    }
  };

  public range = function (size, start, end) {
    var ret = [];
    // console.log(size,start, end);

    if (size < end) {
      end = size;
      start = size - this.gap;
    }
    if (start < 0)
      start = 0;
    for (var i = start; i < end; i++) {
      ret.push(i);
    }
    //console.log(ret);
    this.start = start;
    this.end = end;
    return ret;
  };
  public prevPage = function () {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  };
  public prevPage2 = function () {
    if (this.start - this.gap >= 0) {
      this.currentPage-= this.gap;
    }else{
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    }
  };

  public nextPage = function () {
    if (this.currentPage < this.pagedItems.length - 1) {
      this.currentPage++;
    }
  };
  public nextPage2 = function () {
    if (this.end +this.gap <= this.pagedItems.length) {
      this.currentPage+= this.gap;
    }else{
      if (this.currentPage < this.pagedItems.length - 1) {
        this.currentPage++;
      }
    }
  };

  public setPage = function (n: String) {
    this.currentPage = n;
  };

}