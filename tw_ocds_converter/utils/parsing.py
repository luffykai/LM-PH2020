import re

from datetime import datetime
from datetime import timedelta
from datetime import timezone


_TW_DATE_STRING_REGEX = r'^([0-9]{1,3})/([0-9]{1,2})/([0-9]{1,2})$'
_TW_TIMEZONE = 8
_TW_YEAR_OFFSET = 1911

def parse_tw_amount(raw_amount: str) -> int:
  """Converts TW amount for price to integer by removing spaces, ',' and
     '\u5143'('元').

  Args:
      raw_amount (str): A raw amount with ',' and '元', e.g. '3,000,000元'

  Returns:
      int: The amount in integer
  """  
  return int(re.sub(r'[,\u5143\s]', '', raw_amount))

def parse_tw_datetime(raw_date: str) -> datetime:
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
