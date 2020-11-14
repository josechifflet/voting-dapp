import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { error } from 'protractor';
import { Candidate } from '../core/dtos';
import { VotingContractService } from '../services/voting-contract.service';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.css'],
})
export class ElectionComponent implements OnInit {
  candidates: Candidate[];
  hasVoted: boolean;

  constructor(private votingContractService: VotingContractService) {}

  ngOnInit(): void {
    this.getCandidates();
  }

  async getCandidates(): Promise<void> {
    try {
      this.candidates = await this.votingContractService.getCandidates();
    } catch (error) {
      console.log('Get candidates error,', error);
    }
  }

  async vote(candidate): Promise<void> {
    try {
      this.hasVoted = await this.votingContractService.hasAlreadyVoted();
      if (this.hasVoted) {
        console.log('ya votó, poner sweet alert');
        return;
      }
      this.votingContractService.vote(candidate.id);
    } catch (error) {
      console.log('Voting error,', error);
    }
  }
}
