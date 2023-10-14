import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
})
export class SearchCardComponent {
  public currentAccordeonTab = '';
  @Output() changeTransportEvent = new EventEmitter<string>();

  public handleAccordion(id: string) {
    if (id === this.currentAccordeonTab) {
      this.currentAccordeonTab = '';
      return;
    }
    this.currentAccordeonTab = id;
  }

  changeTransport(type: string): void {
    this.changeTransportEvent.emit(type);
  }
}
