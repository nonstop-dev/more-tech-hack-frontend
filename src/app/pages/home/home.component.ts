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

  clustererOptions: ymaps.IClustererOptions = {
    gridSize: 36,
    clusterDisableClickZoom: true,
    preset: 'islands#blueClusterIcons',
  };

  placemarks: Placemark[] = [];
  selectedPlacemark: Placemark | null = null;
  selectedTransport: string = 'taxi';
  placemarkOptions: ymaps.IPlacemarkOptions = {
    iconLayout: 'default#image',
    iconImageHref: '../assets/images/map_logo.png',
    iconImageSize: [32, 32],
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
            balloonContent: 'Содержание балуна',
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

  selectPlacemark(placemark: Placemark): void {
    this.parameters = null;
    this.selectedPlacemark = placemark;
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
