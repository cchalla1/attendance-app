var mongoose = require("mongoose"),
    autoIncrement = require("../server").autoIncrement,
    db = require("../server").db;
    Schema = mongoose.Schema;

var EmployeeSchema = new Schema({
  att : [{type: Number, ref: "Attendance"}],
  employee_id : String,
  employee_first_name : String,
  employee_last_name : String,
  employee_email : String,
  employee_gender : String,
  employee_phn_number : String
});

var AttendanceSchema = new Schema({
  employee : {type: Number, ref: "Employees"},
  employee_id : String,
  date : String,
  attendance : {type: String, default:""}
})

EmployeeSchema.plugin(autoIncrement.plugin, "Employees");
AttendanceSchema.plugin(autoIncrement.plugin, "Attendance");
db.model("Employees", EmployeeSchema);
db.model("Attendance", AttendanceSchema);
