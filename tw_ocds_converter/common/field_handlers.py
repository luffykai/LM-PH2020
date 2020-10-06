from tw_ocds_converter.common.release_builder import ReleaseBuilder
from tw_ocds_converter.utils.mutation import address_value
from tw_ocds_converter.utils.mutation import raw_value

_FIELD_HANDLERS = {
    '採購資料:標案案號': {'tender.id': raw_value},
    '採購資料:標案名稱': {'tender.title': raw_value},
    '機關資料:機關地址': {'parties[].address': address_value}
}

class ReleaseUpdate:
  """Defines mutations are applied to field values and written to updates. This
     can be extended for more customized use cases.
  """
  def __init__(self, updates: dict):
    self._updates = updates

  @property
  def updates(self) -> dict:
    return self._updates

  def update(self, value: str, mutable_release: ReleaseBuilder) -> None:
    """Populates the ReleaseBuilder by applying mutations to the value and
       writing the mutated value at path.

    Args:
        value (str): The value to be mutated.
        mutable_release (ReleaseBuilder): The release to be written.
    """
    for path, mutation_fn in self._updates.items():
      mutable_release.put(path, mutation_fn(value))

class FieldHandler:
  @classmethod
  def get(cls, key: str) -> ReleaseUpdate:
    """Builds the ReleaseUpdate for processing key from dict in the mutation
       mapping.

    Args:
        key (str): The key used to get from mutation mapping.

    Returns:
        ReleaseUpdate: Built with dict from mutation mapping.
    """
    updates = _FIELD_HANDLERS.get(key)
    if not updates:
      return None
    return ReleaseUpdate(updates)
