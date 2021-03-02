#!/bin/bash

BASE_PATH="/smart-living-lab/"

if [[ -z "$1" ]] ; then
    rm -rf build/
    BASE=$BASE_PATH yarn build
    if [[ -d "gh-pages/next" ]] ; then
        mv gh-pages/next next-backup
    fi
    rm -rf gh-pages/* 
    cp -r build/* gh-pages/ 
    if [[ -d "next-backup" ]] ; then
        mv next-backup gh-pages/next
    fi
    cd gh-pages/
    git add . 
    git commit -m "Publish smart living lab website"
    git push
else
    if [[ "$1" == "next" ]] ; then
        rm -rf build/ 
        BASE=$BASE_PATH"next/" yarn build 
        rm -rf gh-pages/next
        cp -r build gh-pages/next
        cd gh-pages/next
        git add . 
        git commit -m "Publish smart living lab website prerelease (next)" 
        git push
    fi
fi