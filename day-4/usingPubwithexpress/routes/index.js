const router = require("express").Router();

router.get("/",(req,res)=>{
    //res.send("Using pug!");
    res.render("index",{title:"using pug"});
});

module.exports =router;