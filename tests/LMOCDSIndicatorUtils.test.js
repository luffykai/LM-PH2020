const LMOCDSIndicatorUtils = require('../app/src/javascripts/utils/LMOCDSIndicatorUtils') ;
// https://standard.open-contracting.org/infrastructure/latest/en/reference/package/
const oc4idsPackagingData = require('./example_oc4ids.json');

test("Make sure calculating bidders in tenders with LMOCDSIndicatorUtils works", () => {
    expect(oc4idsPackagingData).not.toBe(null);
    expect(oc4idsPackagingData.projects.length).toBe(1);
    const ret = {};
    const projects = oc4idsPackagingData.projects;
    for (project of projects) {
        // project is in oc4ids format here.
        const countObj = LMOCDSIndicatorUtils.getNumberOfBiddersAndTendersFromOC4IDs(project);
        ret[project.id] = countObj;
    }

    expect(ret.abc.bidderCount).toBe(5);
    expect(ret.abc.tenderCount).toBe(2);
});


test("Make sure calculating tender duration with LMOCDSIndicatorUtils works", () => {
    expect(oc4idsPackagingData).not.toBe(null);
    expect(oc4idsPackagingData.projects.length).toBe(1);
    const ret = {};
    const projects = oc4idsPackagingData.projects;
    for (project of projects) {
        // project is in oc4ids format here.
        const countObj = LMOCDSIndicatorUtils.getTenderDurationAndCompletedTenderCountFromOC4IDs(project);
        ret[project.id] = countObj;
    }

    expect(ret.abc.completedTenderCount).toBe(2);
    expect(ret.abc.durationCount).toBe(468);
});
