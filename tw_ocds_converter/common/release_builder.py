from typing import Any

from tw_ocds_converter.utils.put import put

class ReleaseBuilder:
  def __init__(self):
    self._release = {}

  def put(self, path: str, value: Any) -> None:
    put(path, value, self._release)

