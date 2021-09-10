#!/bin/bash
 
# Set bash delimeter to be line break
IFS=$'\n'
export PATH="/usr/bin:/bin/:/usr/sbin/:/sbin"
export PATH="/usr/bin:/bin/:/usr/sbin/:/sbin:$PATH"
# # VPN DNS Server

# Get adapter list
adapters=`/Library/Application\ Support/rutokenvpnclient/networksetup -listallnetworkservices | grep -v denotes` 

for adapter in $adapters
do
        echo updating dns for $adapter
        
        # dnssvr=(`Library/Application Support/rutokenvpnclient/networksetup -getdnsservers $adapter`)
        # dnsdomain=(`Library/Application Support/rutokenvpnclient/networksetup  -getsearchdomains $adapter`)
        "/Library/Application Support/rutokenvpnclient/networksetup" -setdnsservers $adapter empty
        "/Library/Application Support/rutokenvpnclient/networksetup" -setsearchdomains $adapter empty
        
done
