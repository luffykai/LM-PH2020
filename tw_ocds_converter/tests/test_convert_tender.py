import json
import os
import unittest

class TestTenderConversion(unittest.TestCase):

    @classmethod
    def setUpClass(self):
      test_src = os.path.dirname(os.path.realpath(__file__))
      with open(test_src + '/testdata/tender_input.json') as input_json:
        self._json = json.load(input_json)
  
    def test_parse(self):
      print(self._json)
      # self.assertEqual('foo'.upper(), 'FOO')

if __name__ == '__main__':
  unittest.main()