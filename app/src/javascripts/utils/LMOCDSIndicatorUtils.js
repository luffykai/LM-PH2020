const moment = require("moment");
/*
    return an object so that we can sum up and do the calculation in the future.
    {
        bidderCount: number,
        tenderCount: number,
    }
*/
function getNumberOfBiddersAndTendersFromOC4IDs(oc4idsData) {
  let tenderCount = 0;
  let bidderCount = 0;
  // sanity check
  if (oc4idsData == null || oc4idsData.contractingProcesses == null) {
    return {
      bidderCount,
      tenderCount,
    };
  }

  const { contractingProcesses } = oc4idsData;
  // contracting process here maps to the multiple columns in one row
  // of our spreadsheet here.
  // E.G.
  // 1st process: Design,
  // 2nd process: Construction
  contractingProcesses.forEach((contractingProcess) => {
    // releases here maps to the multiple tabs in Ronny's data.
    const releases = contractingProcess.releases;
    if (releases == null) {
      return;
    }

    const bidderMap = new Map();
    releases.forEach((release) => {
      if (release.tag != null && release.tag.indexOf("award") === -1) {
        return;
      }

      tenderCount += 1;

      const parties = release.parties;
      if (parties == null) {
        throw "no parties in award release";
      }

      parties.forEach((party) => {
        if (party.roles != null && party.roles.indexOf("tenderer") >= 0) {
          bidderMap.set(party.name, true);
        }
      });
    });

    // console.log('====== one process ======');
    // console.log('tender', 1);
    // console.log('bidderCount', bidderMap.size);
    bidderCount += bidderMap.size;
  });

  //   console.log('>>>>>> one oc4ids results >>>>>>');
  //   console.log('total tender count', tenderCount);
  //   console.log('total bidder count', bidderCount);
  return {
    bidderCount,
    tenderCount,
  };
}

/*
    return an object so that we can sum up and do the calculation in the future.
    {
        durationCount: number,
        completedTenderCount: number,
    }
*/
function getTenderDurationAndCompletedTenderCountFromOC4IDs(oc4idsData) {
  let completedTenderCount = 0;
  let durationCount = 0;
  // sanity check
  if (oc4idsData == null || oc4idsData.contractingProcesses == null) {
    return {
      durationCount,
      tenderCount,
    };
  }

  const { contractingProcesses } = oc4idsData;
  // contracting process here maps to the multiple columns in one row
  // of our spreadsheet here.
  // E.G.
  // 1st process: Design,
  // 2nd process: Construction
  contractingProcesses.forEach((contractingProcess) => {
    //   console.log('contractingProcess', contractingProcess);
    if (contractingProcess.releases == null) {
      return;
    }

    // Find first tender start Date
    // Value: null or Date Object
    const tenderStartDate = contractingProcess.releases.reduce(
      (currentMinTenderDate, release) => {
        // console.log('release', release);
        if (
          release.tender == null ||
          release.tender.tenderPeriod == null ||
          release.tender.tenderPeriod.startDate == null
        ) {
          return currentMinTenderDate;
        }

        // console.log('release.tender.startDate', release.tender.tenderPeriod.startDate);
        const foundStartDate = new Date(release.tender.tenderPeriod.startDate);
        if (currentMinTenderDate == null) {
          return foundStartDate;
        }

        return foundStartDate < currentMinTenderDate
          ? foundStartDate
          : currentMinTenderDate;
      },
      null
    );

    // Find first award and its date
    // Value: null or Date Object
    const awardRelease = contractingProcess.releases.find(
      (release) => release.tag && release.tag.indexOf("award") >= 0
    );
    const awardDate =
      awardRelease != null &&
      awardRelease.awards != null &&
      awardRelease.awards[0] != null &&
      awardRelease.awards[0].date != null
        ? new Date(awardRelease.awards[0].date)
        : null;

    if (tenderStartDate == null || awardDate == null) {
      console.log(
        `At least one of tenderDate: ${
          tenderStartDate || "null"
        } or awardDate: ${awardDate || "null"} is null.`
      );
      return;
    }

    // use moment.js library to calculate days diff
    const startMoment = moment(tenderStartDate);
    const endMoment = moment(awardDate);
    const diffDays = endMoment.diff(startMoment, "days");

    // console.log("====== one process ======");
    // console.log("tender", 1);
    // console.log('startMoment', startMoment);
    // console.log('endMoment', endMoment);
    // console.log("duration", diffDays);

    completedTenderCount += 1;
    durationCount += diffDays;
  });

  //   console.log(">>>>>> one oc4ids results >>>>>>");
  //   console.log("total tender count  :", completedTenderCount);
  //   console.log("total duration count:", durationCount);
  return {
    completedTenderCount,
    durationCount,
  };
}

module.exports = {
  getNumberOfBiddersAndTendersFromOC4IDs,
  getTenderDurationAndCompletedTenderCountFromOC4IDs,
};
