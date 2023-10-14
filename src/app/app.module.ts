import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchCardComponent } from './components/search-card/search-card.component';
import { PointCardComponent } from './components/point-card/point-card.component';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';
import { PointService } from './services/point.service';
import { HttpClientModule } from '@angular/common/http';

const mapConfig: YaConfig = {
  apikey: '9899ecd3-56df-43c6-bf59-54fd17eb8b6b',
  lang: 'ru_RU',
};

@NgModule({
  declarations: [AppComponent, HomeComponent, SearchCardComponent, PointCardComponent],
  imports: [BrowserModule, AppRoutingModule, AngularYandexMapsModule.forRoot(mapConfig), HttpClientModule],
  providers: [PointService],
  bootstrap: [AppComponent],
})
export class AppModule {}
