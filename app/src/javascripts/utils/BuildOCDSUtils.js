const crypto = require("crypto");

Object.defineProperty(String.prototype, "hash", {
  value: function() {
    return crypto.createHash('md5').update(this.toString()).digest('hex');
  }
});

const buildImplDocuments = function(docs, datePublished) {
  let implDocs = [];
  for (let doc of docs) {
    implDocs.push({
      id: doc.fileName.hash(),
      documentType: "physicalProgressReport",
      title: doc.fileName,
      url: doc.url,
      datePublished: datePublished,
      format: doc.type,
      language: "zh"
    });
  }
  return implDocs;
};

const buildOCDSImplUpdateRelease = function(ocid, awardId, docs) {
  const isoNow = new Date().toISOString();
  const currRelease = {
    ocid: ocid,
    id: isoNow.hash(),
    date: isoNow,
    language: "zh",
    initiationType: "tender",
    tag: ["implementationUpdate"],
    contracts: []
  };
  currRelease.contracts.push({
    id: `${awardId}-contract`,
    awardID: awardId,
    status: "active",
    implementation: {
      documents: buildImplDocuments(docs, isoNow)
    }
  });
  return currRelease;
};

module.exports = buildOCDSImplUpdateRelease;
