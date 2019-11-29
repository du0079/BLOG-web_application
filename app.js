var bodyparser =require("body-parser"),
    express    = require("express"),
    expressSanitizer=require("express-sanitizer"),
    methodOverride  = require("method-override"),
    mongoose   = require("mongoose"),
    app= express();

// App congiguration==========================================================================================
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("views"));
mongoose.connect('mongodb://localhost/Blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(methodOverride("_method"));
 
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
//Index route==============================================================================================================================================================
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


//New route
app.get("/blogs/new",function(req,res){
  res.render("new");
});


//postroute==============================================================================================================================================================
app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog ,function(err,newBlog){
    if(err){
      res.render("new");
    }else{
      res.redirect("/blogs");
    }
  });
});

   
// Show route==============================================================================================================================================================
app.get("/blogs/:id",function(req,res){
   Blog.findById(req.params.id,function(err,blog){
    if(err){
      res.render("/blogs");
    }else{
      res.render("show",{blog: blog});
    }
   });
});


//Edit route ==============================================================================================================================================================

app.get("/blogs/:id/edit", function(req,res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if (err){
           res.redirect("/blogs");
       } else {
              res.render("edit", {blog: foundBlog}); 
       }
   })
});



//UPDATE ROUTE==============================================================================================================================================================
app.put("/blogs/:id", function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err) {
           res.redirect("/blogs");
           } else {
               res.redirect("/blogs/" + req.params.id);
           }
   });
});



//DELETE ROUTE==============================================================================================================================================================
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if (err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   });
  
});


app.listen(3000,function(){
 console.log("Tested OK");
});