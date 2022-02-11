# Server Name / PEM: ht-prod-frontend
# Server Path: /home/ubuntu/ht-web-live
# Branch: prod

source ./script-utils.sh

# rebuildService <site_key> <pm apps list>
attApps=("live-att-1" "live-att-2")
rebuildService att "${attApps[@]}"

byApps=("live-by-1 live-by-2")
rebuildService by "${byApps[@]}"

kgApps=("live-kg-1 live-kg-2")
rebuildService kg "${kgApps[@]}"

htApps=("live-ht-1 live-ht-2 live-ht-3 live-ht-4 live-ht-5")
rebuildService ht "${htApps[@]}"

# rlApps=("live-rl-1 live-rl-2")
# rebuildService rl "${rlApps[@]}"

# tlApps=("live-tl-1 live-tl-2")
# rebuildService tl "${tlApps[@]}"
