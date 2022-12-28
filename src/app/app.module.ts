import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArrivalComponent } from './arrival/arrival.component';
import { DepartureComponent } from './departure/departure.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HafasService } from './hafas.service';
import { TrainComponent } from './train/train.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingInterceptor } from './loading.interceptor';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    DepartureComponent,
    ArrivalComponent,
    TrainComponent,
    SpinnerComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [HafasService,
     {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
