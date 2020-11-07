import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import Web3 from 'web3';
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

  private async getAccount(): Promise<string> {
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

  public async getCandidates(): Promise<any> {
    await this.deployContract();
    const candidatesCount = await this.instance.candidatesCount();
    const candidatesArray = new Array<number>(candidatesCount);
    const candidates = candidatesArray.map((i) => this.instance.candidates(i));
    return Promise.all(candidates);
  }

  public async hasAlreadyVoted(account: string): Promise<boolean> {
    await this.deployContract();
    return this.instance.voters(account);
  }

  public async vote(candidateId: number, account: string): Promise<any> {
    await this.deployContract();
    return this.instance.vote(candidateId, { from: account });
  }
}
