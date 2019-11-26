var bodyparser =require("body-parser"),
    express    = require("express"),
    mongoose   = require("mongoose"),
    app= express();

// App congiguration==========================================================================================
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.static("views"));
mongoose.connect('mongodb://localhost/Blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
 
//Database configuration================================================================================================
var BlogSchema = new mongoose.Schema({
           title : String,
           image: String,
           body: String,
           Created : {type: Date, default: Date.now }
});

//Database Model==========================================================================================================
var Blog = mongoose.model("Blog",BlogSchema);

// Blog.create({
// 	title: "Blockchain",
// 	image:"https://images.unsplash.com/photo-1561451213-d5c9f0951fdf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=889&q=80",
// 	body: " A blockchain, originally block chain, is a growing list of records, called blocks, that are linked using cryptography. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data. By design, a blockchain is resistant to modification of the data"
// });


//Routes

app.get("/",function(req,res){
      res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
  Blog.find({},function(err,blogs){
    if(err){
      console.log("error");
    }else{
      res.render("index",{blogs: blogs});
    }
  });
	
});


app.listen(3000,function(){
 console.log("Tested OK");
});