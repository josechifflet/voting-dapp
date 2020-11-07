import { Component, OnInit } from '@angular/core';
import { VotingContractService } from './services/voting-contract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'voting-dapp';
  constructor() {}
}
