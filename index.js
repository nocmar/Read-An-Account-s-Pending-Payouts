const request = require('request');
const readline = require('readline');

const APIUrl = "http://127.0.0.1:8080";
// const acc = "DfiSM1qqP11ECaekbA64L2ENcsWEpGk8df8wf1LAfV2sBd4"; -- timeout?
// const acc = "FFdDXFK1VKG5QgjvqwxdVjo8hGrBveaBFfHnWyz1MAmLL82";
// const depth = 3;

const main = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('Provide valid Kusama account ', (account) => {
        rl.question('Set the depth ', (depth) => {
            callAPI(account, depth);
            rl.close();
        });

      });

  
};

const callAPI = (account, depth) => {
    request(
        `${APIUrl}/accounts/${account}/staking-payouts?depth=${depth}&unclaimedOnly=true`,
        (err, _, body) => {
          if (err) {
            return console.log(err);
          }
    
          const data = JSON.parse(body);
          const { erasPayouts } = data;
          const total = erasPayouts.reduce(
            (erasPayoutAccumulator, erasPayoutCurrent) =>
              erasPayoutAccumulator +
              erasPayoutCurrent.payouts.reduce(
                (payoutAcc, currentPayout) =>
                  payoutAcc + parseFloat(currentPayout.nominatorStakingPayout),
                0
              ),
            0
          );
          console.log("============== Pending payouts ==========");
          console.log(total / 1e12);
        }
      );
}
main();
