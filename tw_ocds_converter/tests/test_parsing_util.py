import unittest

from tw_ocds_converter.utils.parsing import parse_tw_address
from tw_ocds_converter.utils.parsing import parse_tw_amount
from tw_ocds_converter.utils.parsing import parse_tw_datetime


class TestParseTwAddress(unittest.TestCase):

  def test_parse_success(self):
    self.assertEqual(parse_tw_address('106台北市大安區仁愛路四段100號3-2'), {
        'countryName': '臺灣',
        'locality': '台北市',
        'postalCode': '106',
        'region': '大安區',
        'streetAddress': '仁愛路四段100號3-2'})

  def test_parse_without_postal_code(self):
    self.assertEqual(parse_tw_address('台北市大安區仁愛路四段100號3-2'), {
        'countryName': '臺灣',
        'locality': '台北市',
        'postalCode': '',
        'region': '大安區',
        'streetAddress': '仁愛路四段100號3-2'})

  def test_failed_missing_locality(self):
    with self.assertRaises(AssertionError):
      parse_tw_address('106大安區仁愛路4段100號3-2')

  def test_failed_missing_region(self):
    with self.assertRaises(AssertionError):
      parse_tw_address('106台北市仁愛路4段100號3-2')

class TestParseTwAmount(unittest.TestCase):

  def test_parse_success(self):
    self.assertEqual(parse_tw_amount('1,000,000'), 1000000)

  def test_parse_amount_variant(self):
    self.assertEqual(parse_tw_amount('1,000,000元'), 1000000)

  def test_parse_amount_with_spaces(self):
    self.assertEqual(parse_tw_amount('1,000,000 元'), 1000000)

  def test_failed_with_unrecognize_char(self):
    with self.assertRaises(ValueError):
      parse_tw_amount('1,000,000圓')

class TestParseTwDateTime(unittest.TestCase):

  def test_convert_success(self):
    self.assertEqual(parse_tw_datetime('102/01/23').isoformat(),
                      '2013-01-23T00:00:00+08:00')

  def test_convert_month_date_variant(self):
    self.assertEqual(parse_tw_datetime('102/1/2').isoformat(),
                      '2013-01-02T00:00:00+08:00')

  def test_failed_with_less_groups(self):
    with self.assertRaises(AssertionError):
      parse_tw_datetime('102/01')


if __name__ == '__main__':
  unittest.main()