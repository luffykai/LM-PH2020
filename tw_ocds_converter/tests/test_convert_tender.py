import json
import os
import unittest

_TEST_SRC = os.path.dirname(os.path.realpath(__file__))
_TENDER_TESTDATA_FILENAME = _TEST_SRC + '/testdata/tender_input.json'

class TestTenderConversion(unittest.TestCase):

    @classmethod
    def setUpClass(self):
      with open(_TENDER_TESTDATA_FILENAME) as input_json:
        self._json = json.load(input_json)
  
    def test_parse(self):
      print(self._json)
      # self.assertEqual('foo'.upper(), 'FOO')

if __name__ == '__main__':
  unittest.main()