#!/bin/bash

# loop for n sensor and register

echo "registering 10 sensors..."

for i in {1..10}
do
  echo "Registering sensor: $i"
  echo -n '{ "s": "temp-sensor-'$i'", "t": "float", "u": "Celsius" }' | nc 127.0.0.1 7070
  sleep 2
done


echo "sending data..."

while [ true ]; do

  # loop for n sensor and send data
  for i in {1..10}
  do
    val=$(shuf -i 0-40 -n 1)
    data='{"s": "temp-sensor-'$i'", v": '$val'.2 }'
    echo -n $data | nc 127.0.0.1 7070
  done
  echo -n "."
  sleep 5

done