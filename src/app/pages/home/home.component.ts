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
    // preset: '../assets/cluster.png',
    preset: 'islands#blueClusterIcons',
    // iconLayout: 'default#image',
    // iconImageHref: '../assets/images/cluster.png',
    // iconColor: '#1E4BD2',
  };

  placemarks: Placemark[] = [];
  placemarkOptions: ymaps.IPlacemarkOptions = {
    iconLayout: 'default#image',
    iconImageHref: '../assets/images/map_logo.png',
    iconImageSize: [32, 32],
  };

  points: IPoint[] = [];
  // points = [
  //   [55.831903, 37.411961],
  //   [55.763338, 37.565466],
  //   [55.763338, 37.565466],
  //   [55.744522, 37.616378],
  //   [55.780898, 37.642889],
  //   [55.793559, 37.435983],
  //   [55.800584, 37.675638],
  //   [55.716733, 37.589988],
  //   [55.775724, 37.56084],
  //   [55.822144, 37.433781],
  //   [55.87417, 37.669838],
  //   [55.71677, 37.482338],
  //   [55.78085, 37.75021],
  //   [55.810906, 37.654142],
  //   [55.865386, 37.713329],
  //   [55.847121, 37.525797],
  //   [55.778655, 37.710743],
  //   [55.623415, 37.717934],
  //   [55.863193, 37.737],
  //   [55.86677, 37.760113],
  //   [55.698261, 37.730838],
  //   [55.6338, 37.564769],
  //   [55.639996, 37.5394],
  //   [55.69023, 37.405853],
  //   [55.77597, 37.5129],
  //   [55.775777, 37.44218],
  //   [55.811814, 37.440448],
  //   [55.751841, 37.404853],
  //   [55.627303, 37.728976],
  //   [55.816515, 37.597163],
  //   [55.664352, 37.689397],
  //   [55.679195, 37.600961],
  //   [55.673873, 37.658425],
  //   [55.681006, 37.605126],
  //   [55.876327, 37.431744],
  //   [55.843363, 37.778445],
  //   [55.875445, 37.549348],
  //   [55.662903, 37.702087],
  //   [55.746099, 37.434113],
  //   [55.83866, 37.712326],
  //   [55.774838, 37.415725],
  //   [55.871539, 37.630223],
  //   [55.657037, 37.571271],
  //   [55.691046, 37.711026],
  //   [55.803972, 37.65961],
  //   [55.616448, 37.452759],
  //   [55.781329, 37.442781],
  //   [55.844708, 37.74887],
  //   [55.723123, 37.406067],
  //   [55.858585, 37.48498],
  // ];

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

    // this.points.forEach((geometry, index) => {
    //   this.placemarks.push({
    //     geometry,
    //     properties: {
    //       hintContent: 'Содержание всплывающей подсказки',
    //       balloonContent: 'Содержание балуна',
    //     },
    //     options: {
    //       preset: 'islands#greenDotIcon',
    //     },
    //   });
    // });
  }
}
