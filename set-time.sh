#!/bin/bash

TM=$(curl -s http://www.timeapi.org/utc/now?format=%25Y-%25m-%25d%20%25H:%25M)
echo $TM
date --set="${TM}"