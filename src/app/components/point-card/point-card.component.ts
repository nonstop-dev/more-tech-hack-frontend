import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { PointService } from 'src/app/services/point.service';
import { IPoint } from 'src/app/services/types';

@Component({
  selector: 'app-point-card',
  templateUrl: './point-card.component.html',
  styleUrls: ['./point-card.component.scss'],
})
export class PointCardComponent implements OnInit, OnDestroy {
  constructor(private readonly pointService: PointService) {}

  public currentPoint: IPoint | null = null;
  private $unsubscribe: Subject<void> = new Subject<void>();
  get workOnHolidays(): string {
    if (this.currentPoint?.openHours.length == 1) {
      return '<div class="days"><span class="text-sm">Не обслуживает ЮЛ</span></div>';
    }
    return this.currentPoint?.openHours.filter((elem) => elem.hours == 'выходной').length === 1
      ? `<div class="days"><span class="text-sm">понедельник — пятница</span><span class="text-sm">${this.currentPoint?.openHours[0].hours}</span></div><div class="days"><span class="text-sm">суббота</span><span class="text-sm">${this.currentPoint?.openHours[5].hours}</span></div>`
      : `<div class="days"><span class="text-sm">понедельник — пятница</span><span class="text-sm">${this.currentPoint?.openHours[0].hours}</span></div>`;
  }
  get workOnHolidaysIndividual(): string {
    return this.currentPoint?.openHoursIndividual.filter((elem) => elem.hours == 'выходной').length === 1
      ? `<div class="days"><span class="text-sm">понедельник — пятница</span><span class="text-sm">${this.currentPoint?.openHoursIndividual[0].hours}</span></div><div class="days"><span class="text-sm">суббота</span><span class="text-sm">${this.currentPoint?.openHoursIndividual[5].hours}</span></div>`
      : `<div class="days"><span class="text-sm">понедельник — пятница</span><span class="text-sm">${this.currentPoint?.openHoursIndividual[0].hours}</span></div>`;
  }

  @Output() buildRouteEvent = new EventEmitter();

  ngOnInit(): void {
    this.pointService.currentPoint
      .pipe(
        takeUntil(this.$unsubscribe),
        tap((value: IPoint | null) => {
          this.currentPoint = value;
        })
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  buildRoute() {
    this.buildRouteEvent.emit();
  }

  public closePointTab(): void {
    this.pointService.currentTemplate.next('search');
    this.pointService.currentPoint.next(null);
  }
}
