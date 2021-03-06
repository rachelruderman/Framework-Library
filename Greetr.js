//step 1: create a new execution context to keep the code secure

(function(global, $){

  //I'm going to return new and use a function constructor to generate the object so I don't always have to set up the object with the new keyword
  var Greetr = function(firstName, lastName, language){
    return new Greetr.init(firstName, lastName, language)
  }

  var supportedLangs = ['en', 'es']

//now we have a nice list of greetings, and because they've been closed in through closures and not exposed, other developers can't manipulate their values without going into the source code
  var greetings = {
    en: 'Hello',
    es: 'Hola'
  }

  var formalGreetings = {
    en: 'Greetings',
    es: 'Saludos'
  }

  var logMessages = {
    en: 'Logged in',
    es: 'Inició sesión'
  }

  //this is where we'll put any methods that we want to use
  Greetr.prototype = {
    fullName: function(){
      return this.firstName + ' ' + this.lastName
    },
    //supportedLangs is hidden, but we still have access to it because of where it sits lexically
    validate: function(){
      if (supportedLangs.indexOf(this.language) === -1){
        throw 'Invalid language'
      }
    },
    greeting: function(){
      return greetings[this.language] + ' ' + this.firstName + '!'
    },
    formalGreeting: function(){
      return formalGreetings[this.language] + ', ' + this.fullName()
    },
    greet: function(formal){
      var msg;

      //if undefined or null it will be coerced to 'false'
      if(formal){
        msg = this.formalGreeting()
      } else {
        msg = this.greeting()
      }
      if(console){
        console.log(msg)
      }
      //'this' refers to the calling object at execution time. Makes the method chainable
      return this
    },
    log: function(){
      if(console){
        console.log(logMessages[this.language] + ': ' + this.fullName())
      }
      return this
    },
    setLang: function(lang){
      // we'll update the lang, then call validate to make sure it's valid
      this.language = lang;
      this.validate()

      return this
    },
    //jQuery method that takes a selector, sets the greeting itself and updates whatever HTML is there, and we're making it chainable. Lecture 77
    HTMLGreeting: function(selector, formal){
      if(!$){
        throw 'jQuery not loaded'
      }
      if(!selector){
        throw 'Missing jQuery selector'
      }
      var msg;
      if(formal){
        msg = this.formalGreeting()
      } else {
        msg = this.greeting()
      }
      $(selector).html(msg)

      return this
    }
  }

  //this is the function constructor that builds an object and gives it 3 properties. It sets its value if you pass something into the function constructor, otherwise it sets some defaults
  //this needs to point to Greetr.prototype as its prototype. As is, it points to Greetr.init.prototype, but we want it to point to Greetr.prototype
  //the actual object ic reated here, allowing us to 'new' an object without calling 'new'
  Greetr.init = function(firstName, lastName, language){
    var self = this;
    self.firstName = firstName || '';
    self.lastName = lastName || '';
    self.language = language || 'en';

    self.validate()
  }

//trick borrowed from jQuery so we don't have to use the 'new' keyword
  Greetr.init.prototype = Greetr.prototype

  //attach our Greetr to teh global object, and provide a shorthand '$G' for our poor fingers
  global.Greetr = global.G$ = Greetr

}(window, jQuery))
