var MongoClient = require('mongodb').MongoClient;
mongo_username = encodeURIComponent('realsyncchat');
mongo_password = process.env.PASSWORD;
url = "mongodb://" + mongo_username + ":" + mongo_password + "@cluster0-shard-00-00-rkcea.mongodb.net:27017,cluster0-shard-00-01-rkcea.mongodb.net:27017,cluster0-shard-00-02-rkcea.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  console.log('Connecting to database');
  const db = client.db('');
  if(err) throw err;
  console.log('Successfully connected');
  db.listCollections().toArray(function(err, collInfos) {
    if (err){throw err;}
    console.log('found following collections:');
    console.log(collInfos);
    console.log('-----------------');
    if (collInfos.length == 0){
      console.log('no collections to delete.');
      process.exit();
    }
    else{
      var idx = 1;
      collInfos.forEach(function(collection){
        db.collection(collection.name.toString()).drop(function(err, delOK){
          if (err){throw err;}
          if(delOK){
            console.log('Deleted collection: ' + collection.name);
            if (idx == collInfos.length){
              console.log('Program exiting.');
              client.close();
              process.exit();
            }
            idx++;
          }
          else {
            if (idx == collInfos.length){
              console.log('Program exiting.');
              client.close();
              process.exit();
            }
            idx++;
          }
        });
      });
    }
  });
});
