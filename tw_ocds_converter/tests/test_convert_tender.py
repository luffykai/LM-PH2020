import json
import os
import unittest

from tw_ocds_converter.common.release_builder import ReleaseBuilder
from tw_ocds_converter.utils.mapping import field_mapping

_TEST_SRC = os.path.dirname(os.path.realpath(__file__))
_TENDER_TESTDATA_FILENAME = _TEST_SRC + '/testdata/tender_input.json'

class TestTenderConversion(unittest.TestCase):

  @classmethod
  def setUpClass(self):
    with open(_TENDER_TESTDATA_FILENAME) as input_json:
      self._json = json.load(input_json)

  def test_parse(self):
    for record in self._json['records']:
      r = ReleaseBuilder()
      for key, value in record['detail'].items():
        field_mapping(key, value, r)
      print(r.release)

if __name__ == '__main__':
  unittest.main()