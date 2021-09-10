#!/bin/bash
 
# Set bash delimeter to be line break
IFS=$'\n'
export PATH="/usr/bin:/bin/:/usr/sbin/:/sbin"
export PATH="/usr/bin:/bin/:/usr/sbin/:/sbin:$PATH"
# # VPN DNS Server

MYDIR="$(dirname "$(which "$0")")"

source "$MYDIR/dns-settings"
echo $vpndns
echo $domain
# Get adapter list
adapters=`/Library/Application\ Support/rutokenvpnclient/networksetup -listallnetworkservices | grep -v denotes` 

for adapter in $adapters
do
        echo updating dns for $adapter
        if [ $vpndns != test ]; then
                "/Library/Application Support/rutokenvpnclient/networksetup" -setdnsservers $adapter $vpndns
        fi
        if [ $domain != test ]; then
                "/Library/Application Support/rutokenvpnclient/networksetup" -setsearchdomains $adapter $domain
        fi
done
