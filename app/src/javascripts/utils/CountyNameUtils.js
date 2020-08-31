function countyNameFormatter(countyNameRaw) {
  const countyNames = countyNameRaw
    .split("_")
    .map(
      (_namePartRaw) =>
        `${_namePartRaw.slice(0, 1).toUpperCase()}${_namePartRaw.slice(1)}`
    );
  return countyNames.join(" ");
}


module.exports = {
    countyNameFormatter
}
