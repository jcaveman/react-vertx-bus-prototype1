#!/bin/bash
verticalName=$1

vertx run "$verticalName".js -conf config/"$verticalName".conf -cluster