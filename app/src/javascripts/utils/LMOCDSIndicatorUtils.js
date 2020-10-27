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
            completedTenderCount,
            durationCount,
        };
    }

    const { contractingProcesses } = oc4idsData;
    // contracting process here maps to the multiple columns in one row
    // of our spreadsheet here.
    // E.G.
    // 1st process: Design,
    // 2nd process: Construction
    contractingProcesses.forEach((contractingProcess) => {
        if (contractingProcess.releases == null) {
            return;
        }

        // Find first tender start Date
        // Value: null or Date Object
        const tenderStartDate = getContractingProcessEarliestTenderStartDate(
            contractingProcess
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
            awardRelease.awards[0].date != null ?
            new Date(awardRelease.awards[0].date) :
            null;

        if (tenderStartDate == null || awardDate == null) {
            // console.log(
            //   `At least one of tenderDate: ${
            //     tenderStartDate || "null"
            //   } or awardDate: ${awardDate || "null"} is null.`
            // );
            return;
        }

        // use moment.js library to calculate days diff
        const startMoment = moment(tenderStartDate);
        const endMoment = moment(awardDate);
        const diffDays = endMoment.diff(startMoment, "days");

        // console.log("====== one completed tender found ======");
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

function getTenderStartToAwardDurationFromContractingProcess(
    contractingProcess
) {
    if (contractingProcess.releases == null) {
        return null;
    }

    // Find first tender start Date
    // Value: null or Date Object
    const tenderStartDate = getContractingProcessEarliestTenderStartDate(
        contractingProcess
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
        awardRelease.awards[0].date != null ?
        new Date(awardRelease.awards[0].date) :
        null;

    if (tenderStartDate == null || awardDate == null) {
        // console.log(
        //   `At least one of tenderDate: ${
        //     tenderStartDate || "null"
        //   } or awardDate: ${awardDate || "null"} is null.`
        // );
        return null;
    }

    // use moment.js library to calculate days diff
    const startMoment = moment(tenderStartDate);
    const endMoment = moment(awardDate);
    const diffDays = endMoment.diff(startMoment, "days");

    return diffDays;
}

function getNumberOfShortTitleTenderAndTotalTenderCount(
    oc4idsData,
    // threshold 10 is the recommended value, but I think Taiwan/ Mandarin
    // might be able to use another value.
    threshold = 10
) {
    let shortTitleTenderCount = 0;
    let tenderCount = 0;
    // sanity check
    if (oc4idsData == null || oc4idsData.contractingProcesses == null) {
        return {
            shortTitleTenderCount,
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
        if (contractingProcess.releases == null) {
            return;
        }

        // Find first tender start Date
        // Value: null or string
        const minLengthTitle = contractingProcess.releases.reduce(
            (currentMinLengthTitle, release) => {
                if (release.tender == null || release.tender.title == null) {
                    return currentMinLengthTitle;
                }

                const foundTenderTitle = release.tender.title;
                if (currentMinLengthTitle == null) {
                    return foundTenderTitle;
                }

                return foundTenderTitle.length < currentMinLengthTitle.length ?
                    foundTenderTitle :
                    currentMinLengthTitle;
            },
            null
        );

        if (minLengthTitle == null) {
            // console.log("minLengthTitle is null");
            return;
        }

        if (minLengthTitle.length < threshold) {
            shortTitleTenderCount += 1;
        }
        tenderCount += 1;
    });

    return {
        shortTitleTenderCount,
        tenderCount,
    };
}

/*
 Return: array of number
*/
function getBidderCountArrayFromOC4IDs(oc4idsData) {
    const bidderCount = [];

    // sanity check
    if (oc4idsData == null || oc4idsData.contractingProcesses == null) {
        return [];
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

        bidderCount.push(bidderMap.size);
    });

    return bidderCount;
}

/*
{
  2012: [1,4,5,6,7],
  2013: [5,6,7,7],
}
*/

function getBidderCountArrayInMapFromOC4IDs(oc4idsData) {
    const bidderCount = [];

    // sanity check
    if (oc4idsData == null || oc4idsData.contractingProcesses == null) {
        return [];
    }

    const { contractingProcesses } = oc4idsData;
    // contracting process here maps to the multiple columns in one row
    // of our spreadsheet here.
    // E.G.
    // 1st process: Design,
    // 2nd process: Construction

    /* {
            2007: [4,5,6],
          } */
    const yearToBidderCountArrayMap = Object.create(null);
    contractingProcesses.forEach((contractingProcess) => {
        // releases here maps to the multiple tabs in Ronny's data.
        const releases = contractingProcess.releases;
        if (releases == null) {
            return;
        }

        const bidderSet = new Set();

        releases.forEach((release) => {
            if (release.tag != null && release.tag.indexOf("award") === -1) {
                return;
            }

            const parties = release.parties;
            if (parties == null) {
                throw "no parties in award release";
            }

            parties.forEach((party) => {
                if (party.roles != null && party.roles.indexOf("tenderer") >= 0) {
                    bidderSet.add(party.name);
                }
            });
        });

        const tenderStartDateFromTenderData = getContractingProcessEarliestTenderStartDate(
            contractingProcess
        );

        // Some of the data does not have tender data, but has award data, I guess
        // for the ones that tenderStartDateFromTenderData is null, we'll just fallback
        // to awards date to count as the year
        const _tenderDate =
            tenderStartDateFromTenderData != null ?
            tenderStartDateFromTenderData :
            getContractingProcessAwardDate(contractingProcess);
        const startMoment = moment(_tenderDate);
        const startYear = startMoment.year();

        if (startYear in yearToBidderCountArrayMap) {
            yearToBidderCountArrayMap[startYear].push(bidderSet.size);
        } else {
            yearToBidderCountArrayMap[startYear] = [bidderSet.size];
        }
    });

    return yearToBidderCountArrayMap;
}

function getContractingProcessEarliestTenderStartDate(contractingProcess) {
    if (contractingProcess == null || contractingProcess.releases == null) {
        console.error("contractingProcess or contractingProcess.releases is null");
        return null;
    }

    return contractingProcess.releases.reduce((currentMinTenderDate, release) => {
        if (
            release.tender == null ||
            release.tender.tenderPeriod == null ||
            release.tender.tenderPeriod.startDate == null
        ) {
            return currentMinTenderDate;
        }

        const foundStartDate = new Date(release.tender.tenderPeriod.startDate);
        if (currentMinTenderDate == null) {
            return foundStartDate;
        }

        return foundStartDate < currentMinTenderDate ?
            foundStartDate :
            currentMinTenderDate;
    }, null);
}

function getContractingProcessAwardDate(contractingProcess) {
    if (contractingProcess == null || contractingProcess.releases == null) {
        console.error("contractingProcess or contractingProcess.releases is null");
        return null;
    }

    return contractingProcess.releases.reduce((currentMinAwardDate, release) => {
        if (
            release.awards == null ||
            release.awards[0] == null ||
            release.awards[0].date == null
        ) {
            return currentMinAwardDate;
        }

        const foundAwardDate = new Date(release.awards[0].date);
        if (currentMinAwardDate == null) {
            return foundAwardDate;
        }

        return foundAwardDate < currentMinAwardDate ?
            foundAwardDate :
            currentMinAwardDate;
    }, null);
}

function getMedianFromArray(numbers) {
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const lowerMedian = sortedNumbers[Math.floor(sortedNumbers.length / 2)];
    const upperMedian = sortedNumbers[Math.ceil(sortedNumbers.length / 2)];

    if (isNaN(lowerMedian) || isNaN(upperMedian)) {
        console.error(
            `lowerMedian: ${lowerMedian} or upperMedian: ${upperMedian} is NaN`
        );
        return 0;
    }

    return parseFloat((lowerMedian + upperMedian) / 2).toFixed(2);
}

module.exports = {
    getBidderCountArrayFromOC4IDs,
    getBidderCountArrayInMapFromOC4IDs,
    getContractingProcessEarliestTenderStartDate,
    getMedianFromArray,
    getNumberOfBiddersAndTendersFromOC4IDs,
    getNumberOfShortTitleTenderAndTotalTenderCount,
    getTenderDurationAndCompletedTenderCountFromOC4IDs,
    getTenderStartToAwardDurationFromContractingProcess,
};