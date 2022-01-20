import React from 'react';
import PlayerViews from './PlayerViews';

const exports = {...PlayerViews};

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Deployer">
        <h2>Deployer (Alice)</h2>
        {content}
      </div>
    );
  }
}

exports.SetWager = class extends React.Component {
  render() {
    const {parent, defaultWager, standardUnit} = this.props;
    const wager = (this.state || {}).wager || defaultWager;
    return (
      <div>
        <input
          type='number'
          placeholder={defaultWager}
          onChange={(e) => this.setState({wager: e.currentTarget.value})}
        /> {standardUnit}
        <br />
        <button
          onClick={() => parent.setWager(wager)}
        >Set wager</button>
      </div>
    );
  }
}

exports.getNftId = class extends React.Component {
  render() {
    const {parent} = this.props;
    const {NFTid} = this.state || {};
    // const {love,career,fortune} = this.state
    return (
      <div>
        <br />
        Asset ID：<input
          type='number'
          onChange={(e) => this.setState({NFTid:e.currentTarget.value})}
        /> <button 
        disabled={!NFTid}
        onClick={() => parent.setNFTid(this.state.NFTid)}>确认</button>
        <br />
      </div>
    );
  }
}

exports.getNftAmount = class extends React.Component {
  render() {
    const {parent} = this.props;
    const {NFTamt} = this.state || {};
    // const {love,career,fortune} = this.state
    return (
      <div>
        <br />
        Amount：<input
          type='number'
          onChange={(e) => this.setState({NFTamt:e.currentTarget.value})}
        /> <button 
        disabled={!NFTamt}
        onClick={() => parent.setNFTamt(this.state.NFTamt)}>确认</button>
        <br />
      </div>
    );
  }
}

exports.Deploy = class extends React.Component {
  render() {
    const {parent} = this.props;
    return (
      <div>
        请问您要部署合约吗？
        <br />
        <br />
        <button
          onClick={() => parent.deploy()}
        >
        部署</button>
      </div>
    );
  }
}

exports.Deploying = class extends React.Component {
  render() {
    return (
      <div>Deploying... please wait.</div>
    );
  }
}

exports.WaitingForAttacher = class extends React.Component {
  async copyToClipborad(button) {
    const {ctcInfoStr} = this.props;
    navigator.clipboard.writeText(ctcInfoStr);
    const origInnerHTML = button.innerHTML;
    button.innerHTML = 'Copied!';
    button.disabled = true;
    await sleep(1000);
    button.innerHTML = origInnerHTML;
    button.disabled = false;
  }

  render() {
    const {ctcInfoStr} = this.props;
    return (
      <div>
        Waiting for Attacher to join...
        <br /> Please give them this contract info:
        <pre className='ContractInfo'>
          {ctcInfoStr}
        </pre>
        <button
          onClick={(e) => this.copyToClipborad(e.currentTarget)}
        >Copy to clipboard</button>
      </div>
    )
  }
}

exports.getStartTime = class extends React.Component {
  render() {
    const {parent} = this.props;
    const {startTime} = this.state || {};
    // const {love,career,fortune} = this.state
    return (
      <div>
        <br />
        StartTime：<input
          type='number'
          onChange={(e) => this.setState({startTime:e.currentTarget.value})}
        /> <button 
        disabled={!startTime}
        onClick={() => parent.setStartTime(this.state.startTime)}>确认</button>
        <br />
      </div>
    );
  }
}

exports.getEndTime = class extends React.Component {
  render() {
    const {parent} = this.props;
    const {endTime} = this.state || {};
    // const {love,career,fortune} = this.state
    return (
      <div>
        <br />
        EndTime：<input
          type='number'
          onChange={(e) => this.setState({endTime:e.currentTarget.value})}
        /> <button 
        disabled={!endTime}
        onClick={() => parent.setEndTime(this.state.endTime)}>确认</button>
        <br />
      </div>
    );
  }
}

// exports.getClose = class extends React.Component {
//   render() {
//     const {parent} = this.props;
//     const {close} = this.state || {};
//     // const {love,career,fortune} = this.state
//     return (
//       <div>
//         <button 
//         disabled={!true}
//         onClick={() => parent.setClose(true)}>确认关闭</button>
//         <br />
//       </div>
//     );
//   }
// }

export default exports;
