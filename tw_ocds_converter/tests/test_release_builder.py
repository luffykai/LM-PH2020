import unittest

from tw_ocds_converter.common.generic_release_builder import GenericReleaseBuilder


class TestGenericReleaseBuilder(unittest.TestCase):

  def test_simple_value(self):
    r = GenericReleaseBuilder()
    r.put('a.b.c', 10)
    self.assertEqual(r.oc_release['a']['b']['c'], 10)

if __name__ == '__main__':
  unittest.main()