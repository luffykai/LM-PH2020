from typing import Any
from tw_ocds_converter.common.field_handlers import FieldHandler
from tw_ocds_converter.common.release_builder import ReleaseBuilder

def field_mapping(
    key: str, value: str, mutable_release: ReleaseBuilder) -> None:
  """Calss FieldHandler to apply mutations and map field values.

  Args:
      key (str): The key to the field.
      value (str): The value of the field.
      mutable_release (ReleaseBuilder): The release to be written.
  """    
  updates = FieldHandler.get(key)
  if not updates:
    return
  updates.update(value, mutable_release)
  