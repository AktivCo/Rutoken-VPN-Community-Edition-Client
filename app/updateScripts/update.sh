#!/bin/bash
updatepath=$1
filepath=$2
# Set bash delimeter to be line break
IFS=$'\n'
export PATH="/usr/bin:/bin/:/usr/sbin/:/sbin"
export PATH="/usr/bin:/bin/:/usr/sbin/:/sbin:$PATH"
# # VPN DNS Server

#echo $updatepath

# filepath=$2
# echo $updatepath
# cd /tmp
# rm -rf ./install
# cp -rf $updatepath /tmp/update.pkg
# mkdir install
# xar -xf ./update.pkg -C ./install
# cd install
# cat Payload | gunzip -dc | cpio -i
# sudo cp -rf ./Contents/ "$filepath"/Contents
#hdiutil detach /Volumes/Рутокен\ VPN\ клиент
#hdiutil attach -nobrowse $updatepath
#cp -rf "/Volumes/Рутокен VPN клиент/Рутокен VPN клиент.app/" "$filepath"
#hdiutil detach /Volumes/Рутокен\ VPN\ клиент

"/Library/Application Support/rutokenvpnclient/installer" -pkg $updatepath -target /
open "$filepath"
#rm -r "$0"