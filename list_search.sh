#!/bin/sh

INPUT='./data/test.tsv'
GRN=$'\e[1;32m'
GRY=$'\e[1;37m'
NC=$'\e[0m'
OLDIFS=$IFS
IFS=$'\t'
[ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }
[[ -d output/all ]] || mkdir output/all

while read name uid title regex latlng
do
  IFS=','
  r=""
  for i in `echo "$regex"`
  do
    r="$r$i.*"
  done
  r="$r((安置)|(社會)|(公共)|(住宅))"
  command="node index.js search_with_unit --pid \"$name\" --t \"$title\" --uid $uid --r \"$r\""

  echo ""
	printf "$GRN[ $name ]$GRY\n"
  echo "  * Command: $command"
  echo "  * Title: $title"
	echo "  * UID: $uid"
  echo "  * Regex: $r"
  echo "$NC"

  eval $command
  IFS=$'\t'
done < $INPUT
IFS=$OLDIFS
