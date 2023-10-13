import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchCardComponent } from './components/search-card/search-card.component';
import { PointCardComponent } from './components/point-card/point-card.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, SearchCardComponent, PointCardComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
