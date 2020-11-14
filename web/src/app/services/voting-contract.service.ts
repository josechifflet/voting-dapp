import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { Candidate } from '../core/dtos';
const contract = require('@truffle/contract');

declare let require: any;
declare let window: any;
const TOKEN_ABI = require('../../../../build/contracts/Election.json');

@Injectable({
  providedIn: 'root',
})
export class VotingContractService {
  private account: string = null;
  private enable: any;
  private readonly web3: any;
  private instance: any;

  constructor() {
    if (window.ethereum === undefined) {
      alert('Non-Ethereum browser detected. Install MetaMask');
    } else {
      if (typeof window.web3 !== 'undefined') {
        this.web3 = window.web3.currentProvider;
      } else {
        this.web3 = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      window.web3 = new Web3(window.ethereum);
      this.enable = this.enableMetaMaskAccount();
    }
  }

  private async deployContract(): Promise<any> {
    // generate contract instance connection
    const transferContract = contract(TOKEN_ABI);
    transferContract.setProvider(this.web3);
    const instance = await transferContract.deployed();
    this.instance = instance;
  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = (window as any).ethereum.enable();
    });
    return Promise.resolve(enable);
  }

  public async getAccount(): Promise<string> {
    if (this.account == null) {
      this.account = await new Promise((resolve, reject) => {
        window.web3.eth.getAccounts((err, retAccount) => {
          if (retAccount.length > 0) {
            this.account = retAccount[0];
            resolve(this.account);
          } else {
            alert('transfer.service :: getAccount :: no accounts found.');
            reject('No accounts found.');
          }
          if (err != null) {
            alert('transfer.service :: getAccount :: error retrieving account');
            reject('Error retrieving account');
          }
        });
      });
    }
    return Promise.resolve(this.account);
  }

  public async getUserBalance(): Promise<{ account: string; balance: number }> {
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {
      window.web3.eth.getBalance(account, (err, balance) => {
        if (!err) {
          resolve({ account, balance });
        } else {
          reject({ account: 'error', balance: 0 });
        }
      });
    });
  }

  public async getCandidates(): Promise<Candidate[]> {
    await this.deployContract();
    const candidatesCount = await this.instance.candidatesCount();
    const candidates = [];
    for (let i = 1; i <= candidatesCount; i++) {
      candidates.push(this.instance.candidates(i));
    }
    const candidatesFromContract = await Promise.all(candidates);
    return candidatesFromContract.map((candidate) => ({
      id: candidate[0].words[0],
      name: candidate[1],
      voteCount: candidate[2],
    }));
  }

  public async hasAlreadyVoted(): Promise<boolean> {
    await this.deployContract();
    const votantAccount = await this.getAccount();
    return this.instance.voters(votantAccount);
  }

  public async vote(candidateId: number): Promise<any> {
    await this.deployContract();
    const votantAccount = await this.getAccount();
    return this.instance.vote(candidateId, { from: votantAccount });
  }

  public async listenEvents(): Promise<any> {
    await this.deployContract();
    return this.instance
      .votedEvent({}, { fromBlock: 0, toBlock: 'latest' })
      .watch((error, event) => {
        console.log('event triggered', event);
      });
  }
}
