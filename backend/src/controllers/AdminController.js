import { DateTime } from "luxon";
import Admin from "../models/Admin.js";

class AdminController {

  // Get all
  getAllAdmins(req, res) {
    Admin.find()
      .then(admins => {
        res.send(admins)
      })

  }

  // Add
  addAdmin(req, res) {

    let adminAccountInfo = req.body;
    let username = adminAccountInfo.username;

    Admin.find({ username: username })
      .then(acc => {
        if (acc.length >= 1) {
          res.json({
            Error: "Admin account is existed!"
          });
        }
        else {
          let adminAcc = new Admin(adminAccountInfo);
          adminAcc.save()
            .then(() => res.json({
              Result: "Add admin account successfully."
            }))
            .catch(error => { });
        }
      })



  }

  // Delete
  deleteAdmin(req, res) {
    let username = req.body.username;
    let adminAPIKey = req.body.adminAPIKey;

    Admin.findOne({ username: username })
      .then(acc => {
        // Check admin account is exist or not
        if (acc != null) {
          Admin.findOneAndRemove({ username: username })
            .then(() => {
              res.json({
                Result: "Delete admin account successfully."
              })
            })
        }
        else {
          res.json({
            Error: "Admin account not found!"
          });
        }
      })



  }



}

export default new AdminController();
