import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HafasService } from '../hafas.service';

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.css']
})
export class TrainComponent {
  tripId: string = '';
  lineName: string = '';
  trip: any;

  constructor(private hafasService: HafasService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tripId = params['id'];
    });
    this.route.queryParams.subscribe(params => {
      this.lineName = params['lineName'];
    });
    this.getTrain();

  }

  // Get Train from API
  getTrain() {
    if (this.lineName != null && this.tripId != null) {
      let params = this.lineName
      this.hafasService.getTrip(this.tripId, params).subscribe((data: any) => {
        const result = data;
        // if result.arrival is not null, parse it to a Date object
        if (result.arrival)
          result.arrival = new Date(result.arrival);
        // if result.plannedArrival is not null, parse it to a Date object
        if (result.plannedArrival)
          result.plannedArrival = new Date(result.plannedArrival);
        // if result.departure is not null, parse it to a Date object
        if (result.departure)
          result.departure = new Date(result.departure);
        // if result.plannedDeparture is not null, parse it to a Date object
        if (result.plannedDeparture)
          result.plannedDeparture = new Date(result.plannedDeparture);
        // convert result.delay to minutes
        if (result.arrivalDelay)
          result.arrivalDelay = Math.round(result.arrivalDelay / 60);
        // change the fahrtNr if it is not Fernverkehr
        // if there are stopovers, parse the "dates" to Date objects
        if (result.stopovers) {
          result.stopovers.map((stopover: { arrival: string | number | Date; plannedArrival: string | number | Date; departure: string | number | Date; plannedDeparture: string | number | Date; arrivalDelay: number; departureDelay: number; }) => {
            if (stopover.arrival)
              stopover.arrival = new Date(stopover.arrival);
            if (stopover.plannedArrival)
              stopover.plannedArrival = new Date(stopover.plannedArrival);
            if (stopover.departure)
              stopover.departure = new Date(stopover.departure);
            if (stopover.plannedDeparture)
              stopover.plannedDeparture = new Date(stopover.plannedDeparture);
            if (stopover.arrivalDelay)
              stopover.arrivalDelay = Math.round(stopover.arrivalDelay / 60);
            if (stopover.departureDelay)
              stopover.departureDelay = Math.round(stopover.departureDelay / 60);
          });
        }
        console.log('result: ', result);
        this.trip = result;
      });
    }
  }
}
