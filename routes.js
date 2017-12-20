var express = require("express"),
    router = express.Router(),
    _ = require("underscore"),
    moment = require("moment"),
    mongoose = require("mongoose"),
    db = require("./server").db,
    Employee = db.model("Employees"),
    path = require("path"),
    Attendance = db.model("Attendance");

router.get("/*", function(req, res, next) {
  if(req.url.includes("api")) {
    next();
  } else {
    console.log("i am here", path.resolve(__dirname, '../Views'));
    res.render(path.resolve(__dirname, '../Views/index'));
  }
});

router.post("/api/registerEmployee", function(req, res) {
  Employee.findOne({employee_id:req.body.employee_id}, function(err, existingEmp) {
    console.log("Employee------------", new Date());
    if(!existingEmp || (existingEmp && !existingEmp.employee_id)) {
      var employee = new Employee();
      _.mapObject(req.body, function(val, key) {
        employee[key] = val;
      });
      employee.save(function(err, emp) {
        if(err) {
          res.send({status:500, msg:err});
        }
        res.send({status:200, msg:"Employee ID "+emp.employee_id+" successfully got registered"});
      })
    } else {
      res.send({status:200, msg:"Employee already registered"});
    }
  })
})

router.post("/api/getEmployees", function(req, res) {
  var result = [];
  Employee.find().populate('att', null, {date:req.body.today}).stream()
    .on("data", function(employee) {
      var clone = JSON.parse(JSON.stringify(employee));
      if(!clone.att || clone.att.length==0) {
        var attendance = new Attendance({employee:clone._id, employee_id:clone.employee_id, date:req.body.today});
        attendance.save(function(err, att) {
          Employee.update({employee_id:clone.employee_id}, {$push:{att:att._id}}).exec();
        });
      }
      result.push(clone);
    })
    .on("error", function(err) {

    })
    .on("end", function() {
      res.send(result);
    })
  // exec(function(err, employees) {
  //   var result = [];
  //   console.log(employees);
  //   for(var i=0; i<employees.length; i++) {
  //     var clone = JSON.parse(JSON.stringify(employees[i]));
  //     if(!clone.att || clone.att.length==0) {
  //       var attendance = new Attendance({employee:clone._id, employee_id:clone.employee_id, date:req.body.today});
  //       (function(c){attendance.save(function(err, att) {
  //         console.log("saved", c);
  //         c.att.push(att._id);
  //         Employee.update({employee_id:c.employee_id}, {$set:{att:c.att}}).exec();
  //       })})(clone);
  //     }
  //     result.push(clone);
  //   }
  //   res.send(result);
  // })
})

router.post("/api/postAttendance", function(req, res) {
  var employees = _.indexBy(req.body.data, "employee_id")
  Attendance.find({employee_id:{$in: Object.keys(employees)}, date:req.body.today}).stream()
    .on("data", function(att) {
      Attendance.update({employee_id:att.employee_id, date:req.body.today}, {$set:{attendance:employees[att.employee_id].attendance}}).exec();
    })
    .on("error", function(err) {

    })
    .on("end", function() {
      res.send({msg:"Successfully Submitted"});
    })
})

router.get("/api/getAllEmployees", function(req, res) {
  Employee.find().exec(function(err, employees) {
    res.send(employees);
  })
})

router.post("/api/fetchAttendance", function(req, res) {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  var query = "";
  var id = req.body.employee_id.substr(0, req.body.employee_id.indexOf('(')-1);
  if(req.body.view == "month") {
    query = ".*" + months[(new Date(req.body.today)).getMonth()] + ".*";
  } else {
    query = ".*" + (new Date(req.body.today)).getFullYear() + ".*";
  }
  console.log(query);
  Attendance.find({employee_id:id, date:{$regex:query}, attendance:"0"}).exec(function(err, employees) {
    res.send(employees);
  })
})

// router.post("/api/login", function(req, res) {
//   var response;
//   if(req.body.username === "admin" && req.body.password === "admin") {
//     response = {msg:"success", user:"admin"};
//   } else if(req.body.username === "user" && req.body.password === "user") {
//     response = {msg:"success", user:"user"};
//   } else {
//     response = {msg:"failure"}
//   }
//   res.send(response);
// });
//
// router.post("/api/postQuestion", function(req, res) {
//   var question = new Questions();
//   question.question = req.body.question;
//   question.type = req.body.type;
//   question.options = req.body.options;
//   question.save(function(err, ques) {
//     if(err) {
//       console.log(err);
//       res.send(err);
//     }
//     console.log("-------------",ques);
//     var answer = new Answers();
//     answer.question = question._id;
//     answer.type = question.type;
//     answer.answer = req.body.answer;
//     answer.save(function(err, ans) {
//       if(err) {
//         res.send(err);
//       }
//       res.send({msg : "success"});
//     })
//   })
// });
//
// router.get("/api/getQuestions/:limit", function(req, res) {
//   var q = Questions.aggregate({ $sample: { size: parseInt(req.params.limit) }});
//   q.exec(function(err, questions) {
//     if(err) {
//       res.send(err);
//     }
//     res.send(questions);
//   })
// });
//
// router.post("/api/postAnswers", function(req, res) {
//   var questionIds = [];
//   var response = {correctAnswers : [], wrongAnswers : []};
//   if(req.body.answers) {
//     for (var i in req.body.answers) {
//       questionIds.push(i);
//     }
//   }
//   if(questionIds.length > 0) {
//     Answers.find({question : {$in: questionIds}}).exec(function(err, answers) {
//       if(err) {
//         res.send(err);
//       }
//       for(var j=0; j<answers.length; j++) {
//         var submittedAnswer = req.body.answers[answers[j].question].answer?req.body.answers[answers[j].question].answer.toLowerCase():"";
//         var actualAnswer = answers[j].answer?answers[j].answer.toLowerCase():"";
//         if(submittedAnswer === actualAnswer) {
//           req.body.answers[answers[j].question].correctAnswer = answers[j].answer;
//           response.correctAnswers.push(req.body.answers[answers[j].question]);
//         } else {
//           req.body.answers[answers[j].question].correctAnswer = answers[j].answer;
//           response.wrongAnswers.push(req.body.answers[answers[j].question]);
//         }
//       }
//       var score = (response.correctAnswers.length/parseInt(req.body.noOfQuestions))*100;
//       response.score = +score.toFixed(2);
//       res.send(response);
//     })
//   } else {
//     response.score = 0;
//     res.send(response);
//   }
// })
//
// router.get("/api/getAllQuestions", function(req, res) {
//   Answers.find().populate('question').exec(function(err, answers) {
//     res.send(answers);
//   })
// })

module.exports = router;
