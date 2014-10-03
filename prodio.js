#!/usr/bin/env node

var
  Liftoff = require('liftoff'),
  Prodio = new Liftoff({
    name: 'Prodio',
    configName: '.prodio',
    cwdFlag: 'cwd',
    configPathFlag: 'config',
    preloadFlag: 'require'
  }),
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

console.log(settings.args);
