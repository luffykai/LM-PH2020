from abc import ABC, abstractmethod
from typing import Any

from tw_ocds_converter.utils.put import put

class ReleaseBuilder(ABC):
  """Abstract interface for building and accessing OCDS release data.
  """
  def __init__(self, raw_release):
    self._oc_release = {}
    self._raw_release = raw_release

  @property
  def oc_release(self):
    return self._oc_release

  @property
  def raw_release(self):
    return self._raw_release

  @abstractmethod
  def _field_mapping(self):
    pass

  def _post_processing(self):
    pass

  def build(self):
    self._field_mapping()
    self._post_processing()

  def put(self, path: str, value: Any) -> None:
    """Puts the value in path of release

    Args:
        path (str): The path to put the value.
        value (Any): The value to be put.
    """
    put(path, value, self._oc_release)
