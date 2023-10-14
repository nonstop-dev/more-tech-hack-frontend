import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { PointService } from 'src/app/services/point.service';
import { IPoint } from 'src/app/services/types';

interface Placemark {
  geometry: number[];
  properties: ymaps.IPlacemarkProperties;
  options: ymaps.IPlacemarkOptions;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly pointService: PointService,
    private cdr: ChangeDetectorRef
  ) {}

  public isLoading = new BehaviorSubject<boolean>(true);

  clustererOptions: ymaps.IClustererOptions = {
    gridSize: 36,
    clusterDisableClickZoom: true,
    preset: 'islands#blueClusterIcons',
  };

  placemarks: Placemark[] = [];
  placemarkOptions: ymaps.IPlacemarkOptions = {
    iconLayout: 'default#image',
    iconImageHref: '../assets/images/map_logo.png',
    iconImageSize: [32, 32],
  };

  points: IPoint[] = [];

  ngOnInit(): void {
    this.pointService
      .get()
      .pipe(
        tap((resp: IPoint[]) => {
          this.points = resp;
          this.points.forEach((point: IPoint) => {
            const geometry = [point.latitude, point.longitude];
            this.placemarks.push({
              geometry,
              properties: {
                hintContent: point.salePointName,
                balloonContent: 'Содержание балуна',
              },
              options: {
                iconLayout: 'default#image',
                iconImageHref: '../assets/images/map_logo.png',
                iconImageSize: [36, 36],
              },
            });
          });
        }),
        finalize(() => {
          this.isLoading.next(false);
        })
      )
      .subscribe();
  }
}
