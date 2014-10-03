#!/usr/bin/env node

'use strict';
var
  path = require('path'),
  settings = require('commander');

var pjson = require(__dirname+'/package.json'),
    cjson = (function(){
      try{
        if(env.configPath){
          console.log('Loading config from: ', env.configPath);
          process.chdir(env.configBase);
          return require(env.configPath);
        }else{
          return {};
        }
      }catch(e){
        return {};
      }
    })(),
    defaults = pjson.defaults||{};

var startup = function(){
  settings.parse(process.argv);

  var command = settings.rawArgs[2];
  if(!command){
    settings.help();
    process.exit(1);
  }
  if(!handlers[command]){
    console.error('Command not known: '+command);
    process.exit(1);
  }
  var handler = handlers[command];
  handler.apply(process, settings.rawArgs.slice(3));
};

settings
  .version('v'+pjson.version, '-v, --version')
  ;

var handlers = {};
var fs = require('fs');
var stat = fs.lstatSync(__dirname+'/commands');
if(!stat.isDirectory()){
  console.error('No commands registered!  Please reinstall prodio-cli.');
  process.exit(1);
}
fs.readdir(__dirname+'/commands', function(err, files){
  if(err){
    console.error(err);
    process.exit(1);
  }
  files.forEach(function(file){
    var handler = require(__dirname+'/commands/'+file);
    var name = handler.command||file.replace(/\.js$/, '');
    handlers[name]=handler;
    settings.option(name, handler.description);
  });

  startup();
});

settings.unknownOption = (function(){
  var cb = settings.unknownOption;
  return function(opt){
    switch(opt){
      case('-H'):
      case('-?'):
        settings.help();
        break;
      default:
        settings.outputHelp();
        cb(opt);
    }
  };
})();
