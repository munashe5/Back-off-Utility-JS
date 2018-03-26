var gs = {backOffController: new (function()
  {
    this.instances = [];
    console.log("new backOffController");

    //Factory method for the backoff object
    this.makeBackOffObject = function(isReady,thenDo, timeLimit, errorCallback)
    { console.log("makeBackOff");
      var boInstance = new this.BackOff(
             isReady,
             thenDo,
             timeLimit,
             errorCallback,
             this.destroyInstance.bind(this)
        );
      this.instances.push(boInstance);
    };

    this.destroyInstance = function(instance)
    {
      console.log("destroy");
      var index = this.instances.indexOf(instance);
      this.instances.splice(index, 1);
    };console.log("makeBackOff");

    //Private the actual backoff object
    this.BackOff = function(isReady,thenDo, timeLimit, errorCallback,destroy)
    {
      console.log("BackOff");
      this.backOffTime = 200;
      this.totalTime = 0;

      this.test = function ()
      {
      console.log("BackOff.test");
        if(isReady())
        {
          destroy(this);
          thenDo();
        }
        else if (this.totalTime < (timeLimit?timeLimit:5000))
        {
          this.backOffTime += 200;
          this.totalTime += this.backOffTime;
          setTimeout(this.test.bind(this),this.backOffTime);
        }
        else
        {
          console.log("TimeOut Error");
          destroy(this);
          if (errorCallback)
            errorCallback();
        }
      };

      this.totalTime += this.backOffTime;
      setTimeout(this.test.bind(this),this.backOffTime);
    };
  })()
} ;

var a = 3;
gs.backOffController.makeBackOffObject(function(){console.log("test isReady"); return a==5;},function(){console.log("finished")},3000);
