# Server Name / PEM: ht-dev
# Server Path: /home/ubuntu/tl-web
# Branch: env-dev-v1-1

source ./script-utils.sh

# rebuildService <site_key> <pm apps list>
attApps=("attweb")
rebuildService att "${attApps[@]}"

byApps=("byweb")
rebuildService by "${byApps[@]}"

kgApps=("kgweb-new")
rebuildService kg "${kgApps[@]}"

rlApps=("rlweb")
rebuildService rl "${rlApps[@]}"

tlApps=("tlweb")
rebuildService tl "${tlApps[@]}"

htApps=("ht-web-20" "ht-web-21" "ht-web-22" "ht-web-23" "ht-web-24")
rebuildService ht "${htApps[@]}"
