import unittest

from tw_ocds_converter.common.release_builder import ReleaseBuilder
from tw_ocds_converter.common.field_handlers import ReleaseUpdate
from tw_ocds_converter.utils.mapping import field_mapping
from unittest.mock import MagicMock
from unittest.mock import patch


class TestFieldMapping(unittest.TestCase):

  @patch('tw_ocds_converter.utils.mapping.FieldHandler')
  def test_field_mapping_none(self, mock_field_handler: MagicMock):
    mock_field_handler.get.return_value = None
    self.assertEqual(field_mapping('k', 'v', ReleaseBuilder()), None)
    mock_field_handler.get.assert_called_once_with('k')

  @patch('tw_ocds_converter.utils.mapping.FieldHandler')
  def test_field_mapping(self, mock_field_handler: MagicMock):
    r = ReleaseBuilder()
    mock_field_handler.get.return_value = ReleaseUpdate(
        {'p': lambda v : int(v)})
    field_mapping('k', '10', r)
    mock_field_handler.get.assert_called_once_with('k')
    self.assertEqual(r.release['p'], 10)

if __name__ == '__main__':
  unittest.main()