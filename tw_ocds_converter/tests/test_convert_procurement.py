import json
import os
import unittest

from tw_ocds_converter.common.generic_release_builder import GenericReleaseBuilder
from tw_ocds_converter.utils.mapping import field_mapping

_TEST_SRC = os.path.dirname(os.path.realpath(__file__))
_PROCUREMENT_TESTDATA_FILENAME = _TEST_SRC + '/testdata/procurement_input.json'

class TestProcurementConversion(unittest.TestCase):

  @classmethod
  def setUpClass(self):
    with open(_PROCUREMENT_TESTDATA_FILENAME) as input_json:
      self._json = json.load(input_json)    

  def test_parse(self):
    for record in self._json['records']:
      r = GenericReleaseBuilder(record['detail'])
      r.build()
      print(r.oc_release)

if __name__ == '__main__':
  unittest.main()