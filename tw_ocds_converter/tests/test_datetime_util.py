import unittest

from tw_ocds_converter.utils.datetime import convert_raw_to_datetime


class TestConvertIsoDateTime(unittest.TestCase):

    def test_convert_success(self):
      self.assertEqual(convert_raw_to_datetime('102/01/23').isoformat(),
                       '2013-01-23T00:00:00+08:00')

    def test_convert_month_date_variant(self):
      self.assertEqual(convert_raw_to_datetime('102/1/2').isoformat(),
                       '2013-01-02T00:00:00+08:00')

    def test_failed_with_less_groups(self):
      with self.assertRaises(AssertionError):
        convert_raw_to_datetime('102/01')


if __name__ == '__main__':
  unittest.main()