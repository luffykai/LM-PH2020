# Style Guide
Google Python Style Guide: https://google.github.io/styleguide/pyguide.html

# Install

## Update `PYTHONPATH` to our package can be found

```shell
cd LM-PH2020
export PYTHONPATH=$PYTHONPATH:$PWD
```

Instead, we can set the current directory to `PYTHONPATH` in `~/.bashrc`.

## Run tests

```shell
python3 -m unittest discover tests "test_*.py"
```
