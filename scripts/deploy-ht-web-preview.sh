# Server Name / PEM: ht-prod-frontend
# Server Path: /home/ubuntu/ht-web-preview
# Branch: env-preview

source ./script-utils.sh

# rebuildService <site_key> <pm apps list>
attApps=("preview-att-1" "preview-att-2")
rebuildService att "${attApps[@]}"

byApps=("preview-by-1 preview-by-2")
rebuildService by "${byApps[@]}"

kgApps=("preview-kg-1 preview-kg-2")
rebuildService kg "${kgApps[@]}"

htApps=("preview-ht-1 preview-ht-2")
rebuildService ht "${htApps[@]}"

rlApps=("preview-rl-1 preview-rl-2")
rebuildService rl "${rlApps[@]}"

tlApps=("preview-tl-1 preview-tl-2")
rebuildService tl "${tlApps[@]}"
