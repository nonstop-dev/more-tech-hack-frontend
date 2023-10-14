import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-point-card',
  templateUrl: './point-card.component.html',
  styleUrls: ['./point-card.component.scss'],
})
export class PointCardComponent {
  @Output() buildRouteEvent = new EventEmitter();

  buildRoute() {
    this.buildRouteEvent.emit();
  }
}
