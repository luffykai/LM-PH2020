import unittest

from tw_ocds_converter.common.release_builder import ReleaseBuilder


class TestReleaseBuilder(unittest.TestCase):

  def test_simple_value(self):
    r = ReleaseBuilder()
    r.put('a.b.c', 10)
    self.assertEqual(r._release['a']['b']['c'], 10)

if __name__ == '__main__':
  unittest.main()