from typing import Any

from tw_ocds_converter.utils.put import put

class ReleaseBuilder:
  """A container for building and accessing OCDS release data.
  """
  def __init__(self):
    self._release = {}

  @property
  def release(self):
    return self._release

  def put(self, path: str, value: Any) -> None:
    """Puts the value in path of release

    Args:
        path (str): The path to put the value.
        value (Any): The value to be put.
    """
    put(path, value, self._release)
