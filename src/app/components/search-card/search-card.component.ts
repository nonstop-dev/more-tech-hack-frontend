import { Component } from '@angular/core';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
})
export class SearchCardComponent {
  public currentAccordeonTab = '';

  public handleAccordion(id: string) {
    if (id === this.currentAccordeonTab) {
      this.currentAccordeonTab = '';
      return;
    }
    this.currentAccordeonTab = id;
  }
}
