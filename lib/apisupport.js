var request = require('request');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Fetcher = function(options){
  var self = this;
  var hasOptions = typeof(options)!=='string';
  var endpoint = self.endpoint = hasOptions?options.uri||options.url:options;
  if(!hasOptions){
    options = {};
  }
  self.options = options;
  self.currentBlock = 0;
  self.suspended = !!self.options.suspended;
  self.complete = false;
  if(!self.suspended){
    process.nextTick(function(){
      return self.fetchNextBlock();
    });
  }
};
util.inherits(Fetcher, EventEmitter);

Fetcher.prototype.fetchNextBlock = function(){
  var self = this;
  var block = self.currentBlock;
  request({
    uri: self.endpoint,
    qs: {
      offset: block,
      limit: self.options.limit||100,
      q: self.options.q
    }
  }, function(err, response, body){
    if(err){
      self.suspend();
      return self.emit('error', err);
    }
    var pkt = JSON.parse(body);
    var isBlock = typeof(pkt.length)!=='undefined';
    var data = pkt[pkt.root];
    if(isBlock){
      self.emit('block', data, pkt);
      self.currentBlock = pkt.offset+pkt.count;
      if(self.currentBlock>=pkt.length){
        self.complete = true;
        return self.emit('end', self.currentBlock);
      }
      return process.nextTick(function(){
        return self.fetchNextBlock();
      });
    }
    self.complete = true;
    self.emit('response', data);
    return self.emit('end', self.currentBlock);
  });
};

Fetcher.prototype.resume = function(){
  var self = this;
  if(self.suspended){
    self.fetchNextBlock();
  }
};

Fetcher.prototype.suspend = function(){
  var self = this;
  if(!self.suspended){
    self.suspended = true;
  }
};

module.exports = {
  Fetcher: Fetcher
};
