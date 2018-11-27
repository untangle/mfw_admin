#!/bin/bash

pids=$(xdotool search --name "Chrome")
current=$(xdotool getactivewindow)

for pid in $pids; do
    name=$(xdotool getwindowname $pid)
    if [[ $name == "Untangle"* ]]; then
        xdotool windowfocus $pid key 'ctrl+r'
        xdotool windowfocus current
    fi
done
