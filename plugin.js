const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const chalk = require('chalk');
const s3EasyDeploy = require('s3-easy-deploy');

module.exports = {
  apply(){
    cogear.on('deploy',()=>{
      try {
        this.config = cogear.config.deploy || require(path.join(process.cwd(),'deploy'));
      }	catch (e) {public-read
        process.exit();			
      }
      if(!fs.existsSync(path.join(cogear.options.output,'index.html'))){
        cogear.on('build.done',()=>{
          this.deploy();
        });
      } else {
        this.deploy();
      }
    });
  },
  deploy(){
    performance.mark('deployStart');
    let presets = Object.keys(this.config);
    let preset = presets.shift();
    if(presets.includes(cogear.options._[1])){
      preset = cogear.options._[1];
    }
    let defaults = {};
    cogear.loader.start('Deploying…');
    let options = merge(defaults,this.config[preset]);
    if ("dev" in options){
      var new_options = options["dev"];
    }else{
      cogear.loader.fail(`No deploy ${chalk.bold.whiteBright('dev')} config found.\nLearn more:\n${chalk.bold.whiteBright('https://cogearjs.org/docs/deploy')}`);    
    }
    if(cogear.options._.includes("prod")){
      if ("prod" in options){
        new_options = options["prod"]
      }else{
        cogear.loader.fail(`No deploy ${chalk.bold.whiteBright('prod')} config found.\nLearn more:\n${chalk.bold.whiteBright('https://cogearjs.org/docs/deploy')}`);    
      }
    }
    new_options["type"] = options["type"];
	  if(new_options.type == 's3'){ 
        s3EasyDeploy.deploy({
          publicRoot: './public',
          bucket: new_options.bucket,
          region: new_options.region,
          cloudFrontId: new_options.cloudFrontId
        }).then(function(result) {
          cogear.loader.succeed(`Deployed.`);
        }, function(err) {
          cogear.loader.fail('Deploy failed.');
          console.error(err);
        });
    }
  }
};