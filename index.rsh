'reach 0.1';

export const main = Reach.App(() => {
  const shared = {
    showToken: Fun(true, Null),
    getNowTime: Fun([],UInt),
    // ...hasConsoleLogger
  };
  const Deployer = Participant('Deployer', {
    nftAmount: Fun([],UInt),
    nft: Fun([],Token),
    getStartTime: Fun([],UInt),
    getEndTime: Fun([],UInt),
    getClose: Fun([],Bool),
    ...shared,
  });
  const Receiver = ParticipantClass('Receiver', {
    ...shared,
    showReceived:Fun([],Null),
    showHave:Fun([],Null)
  });

  // const GetNFT = API({
  //   receiveNFT:Fun([],Bool)
  // })

  init();
  
  Deployer.only(() => {
    const NFT = declassify(interact.nft());
    const NFTAmount = declassify(interact.nftAmount());
    const startTime = declassify(interact.getStartTime());
    const endTime = declassify(interact.getEndTime());
    assume(NFTAmount>=1)
    assume(NFTAmount<= UInt.max)
    assume(startTime>0)
    assume(startTime<= UInt.max)
    assume(endTime>0)
    assume(endTime<= UInt.max)
  });
  Deployer.publish(NFT,NFTAmount,startTime,endTime);
  const ReceivedList = new Set()
  require(NFTAmount>=1)
  require(NFTAmount<= UInt.max)
  commit();
  Deployer.only(()=>{})
  Deployer.publish().pay([[NFTAmount,NFT]])
  commit()
  
  Receiver.only(()=>{
    interact.showToken(NFT)
    const nowTime = declassify(interact.getNowTime())
    assume(nowTime>=startTime)
    assume(nowTime<=endTime)
  })
  
  Receiver.publish(nowTime)
  require(nowTime>=startTime)
  require(nowTime<=endTime)

  // var participated = ReceivedList.member(this)
  // invariant(true)
  // while(nowTime<=endTime && balance(NFT)>=1){
      
  //     commit()
  //     Receiver.publish()
  //     const parti = ReceivedList.member(this)
  //     commit()
      
  //   // var participated = ReceivedList.member(this)
  //   // (() => ({
  //   // when:!ReceivedList.member(this) })),
  //     Receiver.publish().pay(10000).when(!parti).timeout(false)
  //     transfer(1,NFT).to(this)
  //     ReceivedList.insert(this)
  //     Receiver.interact.showReceived();
  //   // while(!participated){
  //   //   commit()
  //   //   Receiver.publish().pay(10000)
  //   //   transfer(1,NFT).to(this)
  //   //   ReceivedList.insert(this)
  //   //   Receiver.interact.showReceived()
  //   //   continue;
  //   // }
  //   // Receiver.interact.showHave()
  //   continue;
  // }
  // commit()

  // Deployer.only(() => {
  //   const CloseOrNot = declassify(interact.getClose())
  // });
  // Deployer.publish(CloseOrNot)
    

  // require(!(balance(NFT)>=0 && balance(NFT)<=1000000))

  // const [keepGoing] = parallelReduce([nowTime<=endTime])
  // .invariant(true)
  // .while(nowTime<=endTime)
  // .case(Deployer, 
  //  (() => ({
  //   when: !ReceivedList.member(this),
    
  //    })),
  //   (_) => {
  //     // nowTime = declassify(Receiver.interact.getNowTime())
  //     ,
  //     Receiver.publish().pay(10000),
  //     transfer(1,NFT).to(this),
  //     ReceivedList.insert(this),
  //     Receiver.interact.showReceived();
  //   return [nowTime<=endTime]; })
  //   .timeout(relativeSecs(1024), () => {
  //   Receiver.publish(nowTime);
  //   return [nowTime<=endTime]; })


    const gasPrice = 10000
    const [ keepGoing, NFTsent ] =
      parallelReduce([ true, 0 ])
        .invariant(balance() == NFTsent * gasPrice)
        .while(keepGoing && balance(NFT)>=1)
        .case(
          Receiver,
          () => ({
            when: !ReceivedList.member(this),
          }),
          (_) => gasPrice,
          (_) => {
            const receiver = this;
            transfer(1,NFT).to(receiver)
            ReceivedList.insert(receiver)
            Receiver.only(() => interact.showReceived());
            return [ true, NFTsent + 1 ];
          }
        )
        .timeout(relativeTime(40000), () => {
          Anybody.publish();
          return [ false, NFTsent ]; });



  transfer(balance()).to(Deployer)
  transfer(balance(NFT),NFT).to(Deployer)
  commit();
  exit()
  
})