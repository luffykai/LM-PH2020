# Install

## Update `PYTHONPATH` to our package can be found

```shell
cd LM-PH2020
export PYTHONPATH=$PYTHONPATH:$PWD
```

Instead, we can set the current directory to `PYTHONPATH` in `~/.bashrc`.

## Run tests

```shell
python3 -m unittest tests/test_datetime_util.py
```
