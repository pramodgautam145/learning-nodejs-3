const express = require("express");
var courses = require("../../onlinetraining_pug/model/course.model");
const fs = require("fs");
let router = express.Router();

router.route("/").get((req, res) => {
  res.render("courses", { listofcourses: courses, title: "List Of Courses" });
});

router.route("/coursedetails/:cid").get((req, res) => {
  let courseId =+req.params.cid;
  let course = courses.find(c=>c.id===courseId);
  res.render("coursedetails", {
   course
  });
});

router.route("/video/:id").get((req,res)=>{
  let courseId = req.params.id;
  let theCourse = courses.find(c=>c.id=== courseId);
  let videoPath = theCourse.introVideo;

  const range = req.header.renge;
  const videoSize = fs.statSync(videoPath).size;

  console.log("range");
  //range
  const CHUNK_SIZE = 10**6; // 1MB
  const start =Number(range.replace(/\D/g,""));
  const end  = Math.min(start + CHUNK_SIZE,videoSize - 1);
  // header
  const contentLength = end - start +1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  
  res.writeHead(206,headers);
  const videoStream =fs.createReadStream(videoPath,{start,end});
  //Stream the video as response to the client
  videoStream.pipe(res);
});

module.exports = router;
