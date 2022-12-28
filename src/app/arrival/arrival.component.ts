import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { HafasService } from '../hafas.service';

@Component({
  selector: 'app-arrival',
  templateUrl: './arrival.component.html',
  styleUrls: ['./arrival.component.css']
})
export class ArrivalComponent {
  arrivals: any;
  station: any;
  directionStation: any;
  station_name: string = 'Tuttlingen';

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getStationFromId(params['station']);
    });
  }

  onFormSubmit() {
    this.getStationFromName();
  }
  

  public readonly queryForm: FormGroup;


  constructor(private hafasService: HafasService, private route: ActivatedRoute, private router: Router, private readonly formBuilder: FormBuilder) { 

    this.queryForm = this.formBuilder.group({
      stationName: ['Tuttlingen', Validators.required],
      directionName: [''],
      profile: ['FV', Validators.required],
      duration: ['60', Validators.required],
    });
  }

  // Get Station 
  getStationFromName() {
    if (this.queryForm.getRawValue().stationName != null) {
      this.hafasService.getStations(this.queryForm.getRawValue().stationName).subscribe((data: any) => {
        const sortedKeys = Object.keys(data).sort((a, b) => data[b].score - data[a].score);
        const firstKey = sortedKeys[0];
        this.station = data[firstKey];
        if (this.station != null) {
          this.queryForm.controls['stationName'].setValue(this.station.name);
          this.station_name = this.station.name;
          this.navigate();
          this.getArrivals();
        }
      })
    }
    if (this.queryForm.getRawValue().directionName != null) {
      this.hafasService.getStations(this.queryForm.getRawValue().directionName).subscribe((data: any) => {
        const sortedKeys = Object.keys(data).sort((a, b) => data[b].score - data[a].score);
        const firstKey = sortedKeys[0];
        this.directionStation = data[firstKey];
        if (this.directionStation != null) {
          this.queryForm.controls['directionName'].setValue(this.directionStation.name);
          this.getArrivals();
        }
      })
    }
  }
  getStationFromId(eva_number: string) {
      this.hafasService.getStation(eva_number).subscribe((data: any) => {
        this.station = data;
        if (this.station != null) {
          this.queryForm.controls['stationName'].setValue(this.station.name);
          this.station_name = this.station.name;
          this.navigate();
          this.getArrivals();
        }
      })
    }

  // arrivals
  getArrivals() {
    let params = 'duration=' + this.queryForm.getRawValue().duration + '&linesOfStops=true&remarks=true'
    console.log('Params: ', params)
    if (this.directionStation != null) {
      params += '&direction=' + this.directionStation.id
    }
    console.log('Params: ', params)
    if (this.queryForm.getRawValue().profile == 'FV') {
      params += '&taxi=false&bus=false&tram=false&suburban=false&regional=false&ferry=false&express=false&subway=false'
    }
    console.log('Params: ', params)
    this.hafasService.getArrivals(this.station.id, params).subscribe((data: any) => {
      console.log('arrivals: ', data)
      this.arrivals = data;
    })
  }

  navigate() {
    this.router.navigate(['/arrival', this.station.id]);
  }
}
