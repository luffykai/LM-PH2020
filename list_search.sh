#!/bin/sh

INPUT='./data/all_projects.tsv'
GRN=$'\e[1;32m'
GRY=$'\e[1;37m'
NC=$'\e[0m'
OLDIFS=$IFS
IFS=$'\t'
[ ! -f $INPUT ] && { echo "${INPUT} file not found"; exit 99; }
[[ -d output/all ]] || mkdir output/all

while read name uid title regex_list latlng
do
  IFS=','
  regex=""
  for i in `echo "${regex_list}"`
  do
    regex="${regex}${i}.*"
  done
  regex="${regex}((安置)|(社會)|(公共)|(住宅))"
  command="node index.js search_with_unit --pid \"${name}\" --t \"${title}\" --uid ${uid} --r \"${regex}\""

  echo "${GRN}"
	echo "[ ${name} ]"
  echo "${GRY}"
  echo "  * Command: ${command}"
  echo "  * Title: ${title}"
	echo "  * UID: ${uid}"
  echo "  * Regex: ${regex}"
  echo "${NC}"

  eval ${command}
  IFS=$'\t'
done < $INPUT
IFS=$OLDIFS
