import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VotingContractService } from './services/voting-contract.service';
import { ElectionComponent } from './election/election.component';

@NgModule({
  declarations: [AppComponent, ElectionComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [VotingContractService],
  bootstrap: [AppComponent],
})
export class AppModule {}
