import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ElectionComponent } from './election/election.component';

const routes: Routes = [
  { path: '', redirectTo: 'election', pathMatch: 'full' },
  { path: 'election', component: ElectionComponent },
  { path: '**', redirectTo: '/election', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
