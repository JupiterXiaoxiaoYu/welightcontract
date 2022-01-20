import React from 'react';
import AppViews from './views/AppViews';
import DeployerViews from './views/DeployerViews';
import AttacherViews from './views/AttacherViews';
import {renderDOM, renderView} from './views/render';
import './index.css';
import * as backend from './build/index.main.mjs';
import {loadStdlib} from '@reach-sh/stdlib';
import MyAlgoConnect from '@reach-sh/stdlib/ALGO_MyAlgoConnect';
const reach = loadStdlib(process.env);
reach.setWalletFallback(reach.walletFallback({
  providerEnv: 'TestNet', MyAlgoConnect }));

const {standardUnit} = reach;
const defaults = {defaultFundAmt: '10', defaultWager: '3', standardUnit};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: 'ConnectAccount', ...defaults};
  }
  async componentDidMount() {
    const acc = await reach.getDefaultAccount();
    const balAtomic = await reach.balanceOf(acc);
    const bal = reach.formatCurrency(balAtomic, 4);
    this.setState({acc, bal});
    if (await reach.canFundFromFaucet()) {
      this.setState({view: 'FundAccount'});
    } else {
      this.setState({view: 'DeployerOrAttacher'});
    }
    //----------------------------------------
    const nowTime = Date.parse(new Date())/1000
    console.log(`nowTime:${nowTime}`)
    //----------------------------------------
  }
  async fundAccount(fundAmount) {
    await reach.fundFromFaucet(this.state.acc, reach.parseCurrency(fundAmount));
    this.setState({view: 'DeployerOrAttacher'});
  }
  async skipFundAccount() { this.setState({view: 'DeployerOrAttacher'}); }
  selectAttacher() { this.setState({view: 'Wrapper', ContentView: Attacher}); }
  selectDeployer() { this.setState({view: 'Wrapper', ContentView: Deployer}); }
  render() { return renderView(this, AppViews); }
}

class Shared extends React.Component {
  async showToken(_tok) { // Fun([], UInt)
    await this.props.acc.tokenAccept(_tok);
    const acceptOrNot = await this.props.acc.tokenAccepted(_tok)
    this.setState({view: 'WaitingForResults', acceptOrNot});
  }

  async getNowTime() {
        const nowTime = Date.parse(new Date())/1000
        console.log(nowTime)
        return nowTime
    }
  // seeOutcome(i) { this.setState({view: 'Done', outcome: intToOutcome[i]}); }
  // informTimeout() { this.setState({view: 'Timeout'}); }
  // playHand(hand) { this.state.resolveHandP(hand); }
}

class Deployer extends Shared {
  constructor(props) {
    super(props);
    this.state = {view: 'Deploy'};
  }
  async deploy() {
    const ctc = this.props.acc.contract(backend);
    this.setState({view: 'Deploying', ctc});
    this.deadline = {ETH: 10, ALGO: 100, CFX: 1000}[reach.connector]; // UInt
    backend.Deployer(ctc, this);
    const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2); //fetch
    this.setState({view: 'WaitingForAttacher', ctcInfoStr});
  }
  

   async nftAmount() {
        const NFTamt = await new Promise(resolveAmount => {
            this.setState({ view: 'getNftAmount', resolveAmount })
        });

        return NFTamt
    }
    setNFTamt(NFTamt) { console.log(NFTamt); this.state.resolveAmount(NFTamt); }

    async nft() {
        const NFTid = await new Promise(resolveID => {
            this.setState({ view: 'getNftId', resolveID })
        });
        return NFTid
    }
    setNFTid(NFTid) { console.log(NFTid); this.state.resolveID(NFTid); }

    async getStartTime() {
        const startTime = await new Promise(resolveStartTime => {
            this.setState({ view: 'getStartTime', resolveStartTime })
        });
        return startTime
    }
    setStartTime(startTime) { console.log(startTime); this.state.resolveStartTime(startTime); }

  async getEndTime() {
        const endTime = await new Promise(resolveEndTime => {
            this.setState({ view: 'getEndTime', resolveEndTime })
        });
        return endTime
    }
  setEndTime(endTime) { console.log(endTime); this.state.resolveEndTime(endTime); }

  async getClose() {
        await new Promise(resolve => setTimeout(resolve, 300000))
        return true
    }
  // setClose(close) { console.log(close); this.state.resolveClose(close); }


  render() { return renderView(this, DeployerViews); }
}


class Attacher extends Shared {
  constructor(props) {
    super(props);
    this.state = {view: 'Attach'};
  }
  attach(ctcInfoStr) {
    const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
    this.setState({view: 'Attaching'});
    backend.Receiver(ctc, this);
  }
  async showReceived(){
    this.setState({view: 'showReceived'})
  }
  async showHave(){
    this.setState({view: 'showHave'})
  }
  render() { return renderView(this, AttacherViews); }
}

renderDOM(<App />);
