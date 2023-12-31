import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { PointService } from 'src/app/services/point.service';
import { IPoint, ResponseModel } from 'src/app/services/types';

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
  public currTemplate = this.pointService.currentTemplate;

  clustererOptions: ymaps.IClustererOptions = {
    gridSize: 36,
    clusterDisableClickZoom: true,
    preset: 'islands#blueClusterIcons',
    hasBalloon: false,
  };

  placemarks: Placemark[] = [];
  selectedPlacemark: Placemark | null = null;
  selectedTransport: string = 'taxi';
  placemarkOptions: ymaps.IPlacemarkOptions = {
    iconLayout: 'default#image',
    iconImageHref: '../assets/images/map_logo.png',
    iconImageSize: [32, 32],
    balloon: false,
  };

  points: IPoint[] = [];

  parameters: ymaps.control.IRoutePanelParameters | null = null;

  ngOnInit(): void {
    this.pointService
      .get()
      .pipe(
        tap((resp: ResponseModel<IPoint[]>) => {
          this.points = resp.result;
          this.points.forEach((point: IPoint) => {
            const geometry = [point.latitude, point.longitude];
            this.placemarks.push({
              geometry,
              properties: {
                hintContent: point.salePointName,
                balloon: false,
                iconCaption: point.id,
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

  public onSearchChanged(value: string): void {
    const placemarks: Placemark[] = [];
    this.points
      .filter((point: IPoint) => point.address.includes(value))
      .forEach((point: IPoint) => {
        const geometry = [point.latitude, point.longitude];
        placemarks.push({
          geometry,
          properties: {
            hintContent: point.salePointName,
            balloon: false,
            iconCaption: point.id,
          },
          options: {
            iconLayout: 'default#image',
            iconImageHref: '../assets/images/map_logo.png',
            iconImageSize: [36, 36],
          },
        });
      });

    this.placemarks = placemarks;
  }

  public onRecommendChecked(value: boolean): void {
    if (value) {
      const placemarks: Placemark[] = [];
      this.points
        .map((point: IPoint) => {
          const scheduledlDate = new Date(point.scheduledTime);
          const scheduledlDateLocal = new Date(scheduledlDate.toLocaleString());
          const currentDate = new Date();
          scheduledlDateLocal.setTime(scheduledlDateLocal.getTime() - 2 * 60 * 60 * 1000);
          point.scheduledTime = currentDate <= scheduledlDateLocal ? point.scheduledTime : '';
          return point;
        })
        .filter((point: IPoint) => point.scheduledTime !== '')
        .forEach((point: IPoint) => {
          const geometry = [point.latitude, point.longitude];
          placemarks.push({
            geometry,
            properties: {
              hintContent: point.salePointName,
              balloon: false,
              iconCaption: point.id,
            },
            options: {
              iconLayout: 'default#image',
              iconImageHref: '../assets/images/map_logo.png',
              iconImageSize: [36, 36],
            },
          });
        });
    }
    // this.placemarks = placemarks;
  }

  selectPlacemark(placemark: Placemark): void {
    this.parameters = null;
    this.selectedPlacemark = placemark;
    const currentPoint = this.points.find((point: IPoint) => point.id == placemark.properties.iconCaption) || null;
    this.pointService.currentPoint.next(currentPoint);
    if (currentPoint) {
      this.pointService.currentTemplate.next('pointCard');
    }
  }

  buildRoute(): void {
    if (!this.selectedPlacemark) {
      return;
    }

    const to = `${this.selectedPlacemark.geometry[0]},${this.selectedPlacemark.geometry[1]}`;
    this.parameters = {
      state: {
        type: this.selectedTransport,
        from: 'Москва, Льва Толстого 16',
        to,
      },
      options: {
        visible: false,
      },
    };
  }

  changeTransport(type: string) {
    this.parameters = null;
    this.selectedTransport = type;
    this.cdr.detectChanges();
    this.buildRoute();
  }
}
