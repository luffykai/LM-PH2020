import unittest

from typing import Any
from tw_ocds_converter.utils.put import put


class TestPutUtil(unittest.TestCase):

  def setUp(self):
    self._r = {}

  def put_internal(self, path: str, value: Any):
    put(path, value, self._r)

  def test_simple_value(self):
    self.put_internal('a.b.c', 10)
    self.assertEqual(self._r['a']['b']['c'], 10)

  def test_simple_value_overwrite(self):
    self.put_internal('a.b.c', 10)
    self.put_internal('a.b.c', 20)
    self.assertEqual(self._r['a']['b']['c'], 20)

  def test_array_put_last(self):
    self.put_internal('a.b[].c', 10)
    self.assertEqual(self._r['a']['b'][0]['c'], 10)

  def test_array_put_last_twice(self):
    self.put_internal('a.b[].c', 10)
    self.put_internal('a.b[].c', 20)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 2)
    self.assertEqual(self._r['a']['b'][0]['c'], 10)
    self.assertEqual(self._r['a']['b'][1]['c'], 20)

  def test_overwrite_array(self):
    self.put_internal('a.b[].c', 10)
    self.put_internal('a.b[0].c', 20)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 1)
    self.assertEqual(self._r['a']['b'][0]['c'], 20)

  def test_preserve_array_size(self):
    self.put_internal('a.b[1].c', 10)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 2)
    self.assertEqual(self._r['a']['b'][0], None)
    self.assertEqual(self._r['a']['b'][1]['c'], 10)

  def test_preserve_and_overwrite_array(self):
    self.put_internal('a.b[1].c', 10)
    self.put_internal('a.b[0].c', 20)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 2)
    self.assertEqual(self._r['a']['b'][0]['c'], 20)
    self.assertEqual(self._r['a']['b'][1]['c'], 10)

  def test_extend_existing_array(self):
    self.put_internal('a.b[].c', 10)
    self.put_internal('a.b[5].c', 20)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 6)
    self.assertEqual(self._r['a']['b'][0]['c'], 10)
    self.assertEqual(self._r['a']['b'][1:5], [None] * 4)
    self.assertEqual(self._r['a']['b'][5]['c'], 20)
  
  def test_extend_existing_array_variant(self):
    self.put_internal('a.b[0].c', 10)
    self.put_internal('a.b[5].c', 20)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 6)
    self.assertEqual(self._r['a']['b'][0]['c'], 10)
    self.assertEqual(self._r['a']['b'][1:5], [None] * 4)
    self.assertEqual(self._r['a']['b'][5]['c'], 20)

  def test_overwrite_nested_arrays(self):
    self.put_internal('a.b[].c[].d', 10)
    self.put_internal('a.b[0].c[0].e', 20)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 1)
    self.assertTrue(isinstance(self._r['a']['b'][0]['c'], list))
    self.assertEqual(len(self._r['a']['b'][0]['c']), 1)
    self.assertEqual(self._r['a']['b'][0]['c'][0]['d'], 10)
    self.assertEqual(self._r['a']['b'][0]['c'][0]['e'], 20)

  def test_extend_nested_arrays(self):
    self.put_internal('a.b[].c[].d', 10)
    self.put_internal('a.b[0].c[].d', 20)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 1)
    self.assertTrue(isinstance(self._r['a']['b'][0]['c'], list))
    self.assertEqual(len(self._r['a']['b'][0]['c']), 2)
    self.assertEqual(self._r['a']['b'][0]['c'][0]['d'], 10)
    self.assertEqual(self._r['a']['b'][0]['c'][1]['d'], 20)

  def test_ended_with_arrays(self):
    self.put_internal('a.b[].c[]', 10)
    self.put_internal('a.b[0].c[]', 20)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 1)
    self.assertTrue(isinstance(self._r['a']['b'][0]['c'], list))
    self.assertEqual(len(self._r['a']['b'][0]['c']), 2)
    self.assertEqual(self._r['a']['b'][0]['c'][0], 10)
    self.assertEqual(self._r['a']['b'][0]['c'][1], 20)

  def test_ended_with_overwritten_extended_arrays(self):
    self.put_internal('a.b[].c[5]', 10)
    self.put_internal('a.b[0].c[0]', 20)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 1)
    self.assertTrue(isinstance(self._r['a']['b'][0]['c'], list))
    self.assertEqual(len(self._r['a']['b'][0]['c']), 6)
    self.assertEqual(self._r['a']['b'][0]['c'][0], 20)
    self.assertEqual(self._r['a']['b'][0]['c'][1:5], [None] * 4)
    self.assertEqual(self._r['a']['b'][0]['c'][5], 10)

  def test_ended_with_overwritten_extended_arrays_variant(self):
    self.put_internal('a.b[].c[5]', 10)
    self.put_internal('a.b[0].c[]', 20)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 1)
    self.assertTrue(isinstance(self._r['a']['b'][0]['c'], list))
    self.assertEqual(len(self._r['a']['b'][0]['c']), 7)
    self.assertEqual(self._r['a']['b'][0]['c'][0:5], [None] * 5)
    self.assertEqual(self._r['a']['b'][0]['c'][5], 10)
    self.assertEqual(self._r['a']['b'][0]['c'][6], 20)

  def test_extend_all_nested_arrays(self):
    self.put_internal('a.b[].c[]', 10)
    self.put_internal('a.b[].c[]', 20)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 2)
    self.assertTrue(isinstance(self._r['a']['b'][0]['c'], list))
    self.assertEqual(len(self._r['a']['b'][0]['c']), 1)
    self.assertTrue(isinstance(self._r['a']['b'][1]['c'], list))
    self.assertEqual(len(self._r['a']['b'][1]['c']), 1)
    self.assertEqual(self._r['a']['b'][0]['c'][0], 10)
    self.assertEqual(self._r['a']['b'][1]['c'][0], 20)

  def test_overwrite_value_with_array(self):
    self.put_internal('a.b.c', 10)
    self.assertEqual(self._r['a']['b']['c'], 10)
    self.put_internal('a.b.c[]', 10)
    self.assertTrue(isinstance(self._r['a']['b']['c'], list))
    self.assertEqual(len(self._r['a']['b']['c']), 1)
    self.assertEqual(self._r['a']['b']['c'][0], 10)

  def test_overwrite_value_with_array_variant(self):
    self.put_internal('a.b.c', 10)
    self.assertEqual(self._r['a']['b']['c'], 10)
    self.put_internal('a.b[].c', 10)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 1)
    self.assertEqual(self._r['a']['b'][0]['c'], 10)

  def test_overwrite_array_with_value(self):
    self.put_internal('a.b.c[]', 10)
    self.assertTrue(isinstance(self._r['a']['b']['c'], list))
    self.assertEqual(len(self._r['a']['b']['c']), 1)
    self.assertEqual(self._r['a']['b']['c'][0], 10)
    self.put_internal('a.b.c', 10)
    self.assertEqual(self._r['a']['b']['c'], 10)

  def test_overwrite_array_with_value_variant(self):
    self.put_internal('a.b[].c', 10)
    self.assertTrue(isinstance(self._r['a']['b'], list))
    self.assertEqual(len(self._r['a']['b']), 1)
    self.assertEqual(self._r['a']['b'][0]['c'], 10)
    self.put_internal('a.b.c', 10)
    self.assertEqual(self._r['a']['b']['c'], 10)

  def test_put_dict(self):
    self.put_internal('a.b.c', {'d': {'e': 10}})
    self.assertEqual(self._r['a']['b']['c'], {'d': {'e': 10}})
    self.put_internal('a.b.c.d.e', 20)
    self.assertEqual(self._r['a']['b']['c']['d']['e'], 20)

  def test_put_array(self):
    self.put_internal('a.b.c', [None, {'d': {'e': 10}}])
    self.assertTrue(isinstance(self._r['a']['b']['c'], list))
    self.assertEqual(len(self._r['a']['b']['c']), 2)
    self.assertEqual(self._r['a']['b']['c'][1], {'d': {'e': 10}})
    self.put_internal('a.b.c[1].d.e', 20)
    self.assertEqual(self._r['a']['b']['c'][1]['d']['e'], 20)
    self.put_internal('a.b.c[0]', 30)
    self.assertEqual(self._r['a']['b']['c'][0], 30)

  def test_whitespace_as_name(self):
    self.put_internal('a.b .c', 10)
    self.assertEqual(self._r['a']['b ']['c'], 10)

  def test_malformed_bracket_is_value(self):
    self.put_internal('a.b[.c', 10)
    self.put_internal('a.b].c', 10)
    self.put_internal('a.b][.c', 10)
    self.assertEqual(self._r['a']['b]']['c'], 10)
    self.assertEqual(self._r['a']['b[']['c'], 10)
    self.assertEqual(self._r['a']['b][']['c'], 10)

  def test_negative_index_raise_error(self):
    with self.assertRaises(AssertionError):
      self.put_internal('a.b[-1].c', 10)

if __name__ == '__main__':
  unittest.main()