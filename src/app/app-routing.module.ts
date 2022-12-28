import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArrivalComponent } from './arrival/arrival.component';
import { DepartureComponent } from './departure/departure.component';
import { TrainComponent } from './train/train.component';

const routes: Routes = [
  { path: '', redirectTo: '/departure', pathMatch: 'full' },
  { path: 'departure', redirectTo: '/departure/8000163', pathMatch: 'full' },
  { path: 'arrival', redirectTo: '/arrival/8000163', pathMatch: 'full' },
  { path: 'departure/:station', component: DepartureComponent },
  { path: 'arrival/:station', component: ArrivalComponent },
  { path: 'train/:id', component: TrainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
