#!/bin/bash
/usr/bin/clashx-service-uninstall

. /etc/os-release

if [ "$ID" = "deepin" ]; then
    if [ -f "/usr/share/applications/clashx.desktop" ]; then
        echo "Removing deepin desktop file"
        rm -vf "/usr/share/applications/clashx.desktop"
    fi
fi

