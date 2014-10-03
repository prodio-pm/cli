#!/usr/bin/env node

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

settings
  .version('v'+pjson.version, '-v, --version')
  ;

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

settings.parse(process.argv);

var command = settings.args[0];

console.log(settings, command);
