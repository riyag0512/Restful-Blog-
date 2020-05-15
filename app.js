var express=require('express');
var app=express();
var methodOverride= require('method-override');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var expressSanitizer=require('express-sanitizer');//after body-parser
mongoose.connect("mongodb://localhost/restful_blog");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
});
var blog=mongoose.model("blog",blogSchema);

/*blog.create({
    title:"dog",
    image: "https://cdn.mos.cms.futurecdn.net/QjuZKXnkLQgsYsL98uhL9X.jpg",
    body:"Hello this is 1 post!"
});
*/

app.get("/",function(req,res)
{
    res.redirect("/blogs");
});
app.get("/blogs/new",function(req,res){
    res.render("new");

})
app.get("/blogs",function(req,res)
{
    blog.find({},function(err,blogs)
    {
        
        if(err)
        console.log(err);
        else{
            res.render("index",{blogs:blogs});
        }
    });
});
app.post("/blogs",function(req,res){

    req.body.blog.body =req.sanitize( req.body.blog.body)
    blog.create(req.body.blog,function(err,newBlog){
        if(err)
        console.log(err);
        else
        res.redirect("/blogs");
    })
});
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        res.redirect("/blogs"); 
        else
   
    res.render("show",{blog:foundBlog});

})
}); 
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id, function(err,foundBlog){
        if(err)
        res.redirect("/blogs");
        else{
            res.render("edit",{blog: foundBlog});
        }
    }); 
   
});

app.put("/blogs/:id",function(req,res){
    req.body.blog.body =req.sanitize( req.body.blog.body)
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs/" + req.params.id);

    });

})

app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs");
    });
});




app.listen(4200,function()
{
    console.log("blog on port 4200");
});