#!/bin/bash
sleep 10
echo "Mongo Db Replica Set Up Started"

mongosh --host db:27017 <<EOF
  var cfg = {
    "_id": "myReplicaSet",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "localhost:27017",
        "priority": 2
      },
    ]
  };
  rs.initiate(cfg);
EOF
echo "Mongo Db Replica Set Up Successful"
