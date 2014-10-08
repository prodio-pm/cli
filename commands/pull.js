var support = require('../lib/apisupport');
var Fetcher = support.Fetcher;
var fs = require('fs');

var pull = function(){
  var values = support.getRoot();
  var id = values._id;
  var project = false;
  var block = function(block){
    if(!project){
      project = block.root;
      project.children = block.nodes;
      return;
    }
    project.children = project.children.concat(block.nodes);
  };
  var error = function(err){
    console.error(err.error||err.stack||err);
    return process.exit(1);
  };
  var done = function(){
    fs.writeFileSync('./.prodio', JSON.stringify(project, null, '  '));
    console.log('Updated');
  };
  if(id){
    var fetcher = new Fetcher(values.host+'/api/v1/project/'+id+'/tree');
    fetcher.on('block', block);
    fetcher.on('error', error);
    fetcher.on('end', done);
    return;
  }
  console.log('No Project ID exists.  You must push or init the project first!');
  process.exit(1);
};

pull.name = 'pull';
pull.description = 'pull local changes from the project server to local';

module.exports = pull;
