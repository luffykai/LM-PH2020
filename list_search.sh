# node index.js search_with_unit --pid "舊宗社會住宅" --t "舊宗" --uid 3.79 3.79.56 --r "((安置)|(社會)|(公共)|(住宅))"

INPUT='./data/name_query_list.tsv'
OLDIFS=$IFS
IFS=$'\t'
[ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }
while read name uid query latlng
do
  IFS=','
  index=0
  r=""
  for i in `echo "$query"`
  do
    if [ $index == 0 ]
    then
      t=$i
    else
      r="$r$i.*"
    fi
    index=$index+1 
  done
  r="$r((安置)|(社會)|(公共)|(住宅))"
  command="node index.js search_with_unit --pid \"$name\" --t \"$t\" --uid $uid --r \"$r\""

	echo "Name : $name"
  echo "Title : $t"
	echo "UID : $uid"
  echo "Regex : $r"
  echo "Replay : $command"

  eval $command
  IFS=$'\t'
done < $INPUT
IFS=$OLDIFS
