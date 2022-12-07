import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  @ViewChild("scroller") scroller: CdkVirtualScrollViewport;
  list: number[];
  index = 0;
  minBufferPx = window.innerHeight - 100;
  maxBufferPx = window.innerHeight + 100;
  cols = 1;
  itemsCount = 10;

  constructor() {
    this.fillItems();
  }

  fillItems() {
    this.list = [];

    for (let i = 0; i < this.itemsCount; i++) {
      this.list.push(150 + Math.floor(Math.random() * 100));
    }
  }

  scrollTo() {
    this.scroller.scrollToIndex(this.index);
  }
}
