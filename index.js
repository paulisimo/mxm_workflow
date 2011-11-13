var mongoose = require('mongoose')
    , express = require('express')
    , jade = require('jade');

// Mongodb schema
var Schema = mongoose.Schema;
  
var PlanSchema = new Schema({
  created_date    : Date,
  seq             : Number,
  title           : String,
  project         : String,
  client          : String,
  body            : String, // make this old
  value           : Number,
  business_ob     : String,
  discovery_weeks : Number,
  iteration_weeks : Number,
  start_date      : Date,
  end_date        : Date,
  vision          : String,
  requirements    : String,
  design_days     : Number,
  frontend_days   : Number,
  backend_days    : Number,
  service_days    : Number,
  producer_days   : Number,
  leaddev_days    : Number,
  partner_days    : Number
});

//Whats the plan?
mongoose.connect('mongodb://localhost/blog');
mongoose.model('Plan', PlanSchema);
console.log("Server is up")

var Plan = mongoose.model('Plan');

//Express
var app = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

//ROUTES
// Show all
app.get('/plans', function(req, res){
  var plans = Plan.find({}, function(err, docs){
    res.render('index.jade', { locals: {
        plans: docs
      }
      });
    console.log("Serving all");
  });
});

// Create a new plan
app.get('/plans/new', function(req, res){
  res.render('new.jade');
  console.log('Serving - Create new');
});

// Edit a record
app.get('/plans/edit/:id', function(req, res){
  Plan.findById(req.params.id, function(err, title, body){
    try {
      res.render('edit.jade', { locals: {
          plan: title
        }
        });
    console.log("Editing " + plan.id);
    } catch(e) {
      console.log(e)
    }
  });
});

// show one
app.get('/plans/:id', function(req, res){
  Plan.findById(req.params.id, function(err, plan){
    //res.send(JSON.stringify(post));
    try {
      res.render('plan.jade', { locals: {
          plan: plan
        }
        });
      console.log("Serving " + plan.id);
    } catch(e) {
      console.log(e);
      console.log(err);
    }
  });
});


app.get('/plans/order', function(req, res){
    try {
      plan.sequence.findAndModify({
      query: {"_id": "customer"},
      update : {$inc : {"seq":1}},
      upsert:true,
      new:true
    });
    } catch (e) {
      console.log(e)
    }
});


app.post('/plans', function(req, res){
  var plan = new Plan(req.body);
  plan.save();
  console.log('Saved ' + plan.id);
  //res.redirect('/plans');
  res.redirect('back');  
});

app.post('/plans/:id', function(req, res){
  Plan.update({ 
    _id: req.params.id }, 
    req.body, 
    function(){ res.redirect('/plans/' + req.params.id) 
  });
});

app.get('/plans/remove/:id', function(req, res){
  Plan.findById(req.params.id, function (err, plan) {
    plan.remove(plan);
    console.log('Deleted ' + plan.id)
    res.redirect('/plans');
    if (!err) {
    }
  });
});

app.listen(3000);