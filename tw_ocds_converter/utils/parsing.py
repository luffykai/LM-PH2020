import re

from datetime import datetime
from datetime import timedelta
from datetime import timezone


_TW_ADDRESS_REGEX = r'^([0-9]{3,5})?(\w{2}[市縣]{1})(\w{1,2}[區市]{1})(.+)$'
_TW_DATE_STRING_REGEX = r'^([0-9]{1,3})/([0-9]{1,2})/([0-9]{1,2})$'
_TW_TIMEZONE = 8
_TW_YEAR_OFFSET = 1911

def parse_tw_address(raw_address: str) -> dict:
  """Converts TW address into OCDS address JSON structure

  Args:
      raw_address (str): A raw address string, e.g. '106台北市大安區仁愛路'

  Returns:
      dict: A dict representing OCDS address JSON structure: countryName,
            postalCode, locality, region, streetAddress
  """  
  p = re.compile(_TW_ADDRESS_REGEX)
  matches = p.findall(raw_address)
  assert matches, "Couldn't parse address string with regex."
  assert len(matches[0]) == 4, "Doesn't match to 4 groups."
  postal, locality, region, street = matches[0]
  return {
    'countryName': '臺灣',
    'postalCode': postal,
    'locality': locality,
    'region': region,
    'streetAddress': street,
  }

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
