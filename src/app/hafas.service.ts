import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, map, catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HafasService {
  // Define API
  baseurl = 'https://v5.db.transport.rest';

  constructor(private http: HttpClient) { }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  fernverkehrTypen = ['ICE', 'IC', 'RJ', 'RJX', 'EC', 'ECE', 'NJ', 'TGV']

  // Get Departures from API
  getDepartures(eva_number: string, params: string): Observable<any> {
    return this.http.get(`${this.baseurl}/stops/${eva_number}/departures?language=de&${params}`, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
      map((results: Object) => {
        // loop through the results and parse the "when" key
        return (results as any[]).map(result => {
          // if result.when is not null, parse it to a Date object
          if (result.when)
            result.when = new Date(result.when);
          // if result.plannedWhen is not null, parse it to a Date object
          if (result.plannedWhen)
            result.plannedWhen = new Date(result.plannedWhen);
          // convert result.delay to minutes
          if (result.delay)
            result.delay = Math.round(result.delay / 60);
          // change the fahrtNr if it is not Fernverkehr
          if (!this.fernverkehrTypen.includes(result.line.productName)) {
            result.line.fahrtNr = result.line.name.split(' ')[1];
          }
          return result;
        });
      }),
      shareReplay(1),
    );
  }

  // Get Arrivals from API
  getArrivals(eva_number: string, params: string): Observable<any> {
    return this.http.get(`${this.baseurl}/stops/${eva_number}/arrivals?language=de&${params}`, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
      map((results: Object) => {
        // loop through the results and parse the "when" key
        return (results as any[]).map(result => {
          // if result.when is not null, parse it to a Date object
          if (result.when)
            result.when = new Date(result.when);
          // if result.plannedWhen is not null, parse it to a Date object
          if (result.plannedWhen)
            result.plannedWhen = new Date(result.plannedWhen);
          // convert result.delay to minutes
          if (result.delay)
            result.delay = Math.round(result.delay / 60);
          // change the fahrtNr if it is not Fernverkehr
          if (!this.fernverkehrTypen.includes(result.line.productName)) {
            result.line.fahrtNr = result.line.name.split(' ')[1];
          }
          return result;
        });
      }),
      shareReplay(1),
    );
  }
  // Get Stations from API
  getStations(query: string): Observable<any> {
    return this.http.get(`${this.baseurl}/stations?query=${encodeURIComponent(query)}`, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
      shareReplay(1),
    );
  }
  
  // Get Station from API
  getStation(eva_number: string): Observable<any> {
    return this.http.get(`${this.baseurl}/stations/${eva_number}`, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
      shareReplay(1),
    );
  }
  // Get Trip from API
  getTrip(tripID: string, params: string): Observable<any> {
    return this.http.get(`${this.baseurl}/trips/${encodeURIComponent(tripID)}?stopovers=true&remarks=true&polyline=false&language=de&lineName=${params}`, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl),
      shareReplay(1),
    );
  }


  // Error handling
  errorHandl(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}