from typing import Any
from tw_ocds_converter.utils.parsing import parse_tw_address
from tw_ocds_converter.utils.parsing import parse_tw_amount
from tw_ocds_converter.utils.parsing import parse_tw_datetime

def raw_value(value: str) -> Any:
  return value

def address_value(value: str) -> Any:
  return parse_tw_address(value)

def datetime_value(value: str) -> Any:
  return parse_tw_datetime(value)