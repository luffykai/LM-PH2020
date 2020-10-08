from tw_ocds_converter.common.release_builder import ReleaseBuilder
from tw_ocds_converter.utils.mapping import field_mapping

class GenericReleaseBuilder(ReleaseBuilder):
  def __init__(self, raw_release = {}):
    super(GenericReleaseBuilder, self).__init__(raw_release)

  def _field_mapping(self):
    for key, value in self._raw_release.items():
      field_mapping(key, value, self)
