var Fetcher = require('../lib/apisupport').Fetcher;
var request = require('request');
var fs = require('fs');

var list = function(under){
  var args = Array.prototype.slice.call(arguments);
  var values = JSON.parse(fs.readFileSync('./.prodio'));
  var id = values._id;
  var tree = false;
  var children = [];
  var displayItem = function(item, level, visited){
    var prefix = new Array(level).join('  ');
    console.log(prefix+item._id+') '+item.name);
    if(item.description){
      console.log(prefix+'  '+item.description);
    }
    (item.children||[]).forEach(function(child){
      displayItem(child, level+1);
    });
  };
  var block = function(block, pkt){
    if(!tree){
      tree = block.root;
      tree.children = [];
      children[tree._id] = tree;
    }
    block.nodes.forEach(function(node){
      if(!children[node._id]){
        node.children = [];
        children[node._id]=node;
        return;
      }
      var child = children[node._id];
      var keys = Object.keys(node);
      keys.forEach(function(key){
        child[key]=node[key];
      });
      child.children=child.children||[];
    });
    block.edges.forEach(function(edge){
      var source = children[edge.from];
      if(!source){
        source = children[edge.from] = {
          children: []
        };
      }
      source.children.push(children[edge.to]);
    });
  };
  var done = function(count){
    displayItem(under?children[under]:tree, 1, [under||tree._id]);
  };
  var error = function(err){
    console.error(err.error||err.stack||err);
    return process.exit(1);
  };
  if(id){
    var fetcher = new Fetcher(values.host+'/api/v1/project/'+id+'/tree');
    fetcher.on('end', done);
    fetcher.on('block', block);
    fetcher.on('error', error);
    return;
  }
  console.log('No Project ID exists.  You must push or init the project first!');
  process.exit(1);
};

list.name = 'list';
list.description = 'list an item in the tree maching the query';

module.exports = list;
