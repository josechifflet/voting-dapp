import { ThrowStmt } from '@angular/compiler';
import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { error } from 'protractor';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Candidate } from '../core/dtos';
import { VotingContractService } from '../services/voting-contract.service';

@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.css'],
})
export class ElectionComponent implements OnInit, OnDestroy {
  republicanCandidate: Candidate;
  democratCandidate: Candidate;

  hasVoted: boolean;
  voteAllowed: boolean;
  votedEventSubscription: Subscription;

  constructor(private votingContractService: VotingContractService) {}

  ngOnDestroy(): void {
    this.votedEventSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getCandidates();
    this.votedEventSubscription = this.votingContractService
      .getVotedEventEmitter()
      .subscribe((event) => {
        this.onVotedEvent(event);
      });
  }

  onVotedEvent(event): void {
    try {
      this.getCandidates();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    }
  }

  async getCandidates(): Promise<void> {
    try {
      const candidates = await this.votingContractService.getCandidates();
      this.republicanCandidate = candidates.find((c) => c.id === 1);
      this.democratCandidate = candidates.find((c) => c.id === 2);
      console.log(candidates);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    }
  }

  async vote(candidate: number): Promise<void> {
    try {
      this.voteAllowed = await this.votingContractService.isAllowedToVote();
      if (!this.voteAllowed) {
        Swal.fire({
          icon: 'error',
          title: 'Vote not allowed!',
          text: 'This address is not allowed to vote.',
        });
        return;
      }

      this.hasVoted = await this.votingContractService.hasAlreadyVoted();
      if (this.hasVoted) {
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong!',
          text: 'A vote has already been registered by this address.',
        });
        return;
      }

      this.votingContractService.vote(candidate);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    }
  }
}
