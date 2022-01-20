if(ReceivedList.member(this)){
    Receiver.interact.showReceived()
    commit()
    exit()
  }else{
    if(nowTime+startTime>endTime){
      Receiver.interact.showReceived()
      commit()
    }else{
      if(balance(NFT)<=1000000 && balance(NFT)>=0){
        Receiver.interact.showReceived()
        commit()
        exit()
      }else{
        transfer(1000000,NFT).to(this)
        ReceivedList.insert(this)
        commit()
        exit()
      }
    }
  }
  Receiver.publish()
  transfer(balance(NFT)).to(Deployer)
  commit()
  exit()











    // if(balance(nft)>0 && !ReceivedList.member(this)){
  //   transfer(1,nft).to(this)
  //   ReceivedList.insert(this)
  // }else{
  //   Receiver.interact.showReceived()
  // }


  // var now = nowTime;
  // invariant(balance(NFT)>=0);
  // while(now+startTime<=endTime || balance(NFT)>=0){
  //   commit()
  // }





