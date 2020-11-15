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
  republicanCandidate: Candidate;
  democratCandidate: Candidate;

  hasVoted: boolean;
  votedEventSubscription: any;

  constructor(private votingContractService: VotingContractService) {}

  ngOnInit(): void {
    this.getCandidates();
    this.votedEventSubscription = this.votingContractService
      .getVotedEventEmitter()
      .subscribe((evnt) => this.onVotedEvent(evnt));
  }

  async onVotedEvent(event): Promise<void> {
    try {
      console.log(event);
    } catch (error) {
      console.log('Get candidates error,', error);
    }
  }

  async getCandidates(): Promise<void> {
    try {
      const candidates = await this.votingContractService.getCandidates();
      this.republicanCandidate = candidates.find((c) => c.id === 1);
      this.democratCandidate = candidates.find((c) => c.id === 2);
    } catch (error) {
      console.log('Get candidates error,', error);
    }
  }

  async vote(candidate: number): Promise<void> {
    try {
      this.hasVoted = await this.votingContractService.hasAlreadyVoted();
      if (this.hasVoted) {
        console.log('ya votó, poner sweet alert');
        return;
      }
      this.votingContractService.vote(candidate);
    } catch (error) {
      console.log('Voting error,', error);
    }
  }
}
