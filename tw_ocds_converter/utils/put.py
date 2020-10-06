import re

from collections.abc import MutableMapping
from collections.abc import MutableSequence
from typing import Any


def _has_array_matches(part: str) -> re.match:
  matches = re.findall(r'^([a-zA-Z0-9_]+)\[(-?\d*)\]$', part)
  if not matches or len(matches[0]) != 2:
    return None
  return matches

def _handle_array(matches: re.match, value: Any, last: bool, obj: dict) -> dict:
  name, index_str = matches[0]
  index = int(index_str) if index_str != '' else None
  assert index is None or index >= 0, 'Index to a list should be non-negative.'
  if name not in obj or not isinstance(obj[name], MutableSequence):
    # List hasn't been initialized yet.
    if index is None:
      index = 0
    obj[name] = [None] * (index + 1)
    obj[name][index] = value
    return obj[name][index]
  # List already exists.
  if index is None:
    index = len(obj[name])
  if index >= len(obj[name]):
    # Array is not large enough.
    obj[name].extend([None] * (index - len(obj[name]) + 1))
    obj[name][index] = value
    return obj[name][index]
  if not last and isinstance(obj[name][index], MutableMapping):
    return obj[name][index]
  obj[name][index] = value
  return obj[name][index]

def put(path: str, value: Any, release: dict) -> None:
  """Puts the |value| at the path in release.

  Args:
      path (str): A dotted path to the position in the dict.
                  'a.b.c' sets the value to: dict = {
                    'a': {
                      'b': {
                        'c': <here>
                      }
                    }
                  }
                  'a.b[]' sets the value in an array: dict = {
                    'a': {
                      'b': [
                        <here>,
                      ]
                    }
                  }
                  'a.b[1]' sets the value in an array at index 1: dict = {
                    'a': {
                      'b': [
                        None,  # the array extended with None
                        <1: here>
                      ]
                    }
                  }
      value (Any): The value to be set.
      release (dict): The mutable data container
  """
  *parts, last_part = path.split('.')
  obj = release
  for part in parts:
    matches = _has_array_matches(part)
    if matches is not None:
      obj = _handle_array(matches, {}, False, obj)
      continue
    if part not in obj or not isinstance(obj[part], MutableMapping):
      obj[part] = {}
    obj = obj[part]

  matches = _has_array_matches(last_part)
  if matches is not None:
    _ = _handle_array(matches, value, True, obj)
  else:
    obj[last_part] = value
