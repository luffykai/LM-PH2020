import re

from datetime import datetime
from datetime import timedelta
from datetime import timezone


_TW_DATE_STRING_REGEX = r'^([0-9]{1,3})/([0-9]{1,2})/([0-9]{1,2})$'
_TW_TIMEZONE = 8
_TW_YEAR_OFFSET = 1911

def convert_raw_to_datetime(raw_date: str) -> datetime:
  """Converts Taiwanese datetime string into datetime object

  Args:
      raw_date (str): A raw datetime string in TW format, e.g. '102/02/15'

  Returns:
      datetime: A standardized datetime object applied with TW year offset.
  """
  p = re.compile(_TW_DATE_STRING_REGEX)
  matches = p.findall(raw_date)
  assert matches, "Couldn't parse datetime string with regex."
  assert len(matches[0]) == 3, "Doesn't match to 3 groups."
  year, month, date = (int(x) for x in matches[0])
  return datetime(year + _TW_YEAR_OFFSET,
                  month, date, tzinfo=timezone(timedelta(hours=_TW_TIMEZONE)))
