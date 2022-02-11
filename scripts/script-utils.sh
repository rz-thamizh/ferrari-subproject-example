# rebuildService <site_key> <pm apps list>

rebuildService () {
  local siteKey="$1"
  shift
  local arr=("$@")
  yarn build:$siteKey
  if [ $? -eq 0 ]; then
    restartApp ${arr[@]}
    echo "$(tput setaf 2)$siteKey Build Success"
  else
    echo "$(tput setaf 1)$siteKey Build Failed"
  fi
}


restartApp () {
  local arr=("$@")
  for i in ${arr[@]}
  do
    pm2 restart $i
    echo "Restarted $i ✨"
  done
}