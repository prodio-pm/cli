var request = require('request');
var fs = require('fs');

var find = function(){
  var args = Array.prototype.slice.call(arguments);
  if(!args.length){
    console.error('Must supply a query!');
    return process.exit(1);
  }
  var query = args.join(' ');
  var values = JSON.parse(fs.readFileSync('./.prodio'));
  var id = values._id;
  if(id){
    return request({
      method: 'GET',
      body: JSON.stringify(values),
      uri: values.host+'/api/v1/project/'+id+'/items?q='+query
    }, function(err, request, body){
      var items = JSON.parse(body);
      var logif = function(prefix, value){
        if(typeof(value) !== 'undefined'){
          console.log(prefix, value);
        }
      };
      items = items[items.root];
      items.forEach(function(item){
        console.log('Name: ', item.name);
        logif('  ID: ', item._id);
        logif('  Version: ', item.version);
        logif('  Type: ', item.type);
        logif('  Description: ', item.description);
        logif('  Status: ', item.status);
      });
    });
  }
  console.log('No Project ID exists.  You must push or init the project first!');
  process.exit(1);
};

find.name = 'find';
find.description = 'Find an item in the tree maching the query';

module.exports = find;
