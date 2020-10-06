from typing import Any
from tw_ocds_converter.common.field_handlers import field_handlers
from tw_ocds_converter.common.release_builder import ReleaseBuilder

def field_mapping(
    key: str, value: str, mutable_release: ReleaseBuilder) -> None:
  updates = field_handlers.get(key)
  if not updates:
    return
  for path, mutation_fn in updates.items():
    mutable_release.put(path, mutation_fn(value))
