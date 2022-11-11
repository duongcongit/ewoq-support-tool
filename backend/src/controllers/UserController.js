import { DateTime } from "luxon";
import User from "../models/User.js";

class UserController {

  // Get all
  getAllUsers(req, res) {
    User.find()
      .then(users => {
        res.send(users)
      })
  }


  // Update
  updateUser(req, res) {

    let username = req.body.username;

    User.find({ username: username })
      .then(acc => {
        if (acc.length >= 1) {
          Account.findOneAndUpdate({ username: username }, req.body)
            .then(() => {
              res.json({
                Result: "Update account successfully."
              })
            })
        }
        else {
          res.json({
            Error: "Account not found!"
          });
        }
      })




  }

  // Soft delete
  softDeleteUser(req, res) {
    let username = req.body.username;
    let currentTime = DateTime.utc().toISO();


    let accSoftDelDetail = {
      status: 0,
      deleteAt: currentTime
    }

    Account.find({ username: username })
      .then(acc => {
        if (acc.length >= 1) {
          Account.findOneAndUpdate({ username: username }, accSoftDelDetail)
            .then(() => {
              res.json({
                Result: "Soft delete account successfully."
              })
            })
        }
        else {
          res.json({
            Error: "Account not found!"
          });
        }
      })



  }

  // Delete
  deleteUser(req, res) {
    let username = req.body.username;

    Account.find({ username: username })
      .then(acc => {
        if (acc.length >= 1) {
          Account.findOneAndRemove({ username: username })
            .then(() => {
              res.json({
                Result: "Delete account successfully."
              })
            })
        }
        else {
          res.json({
            Error: "Account not found!"
          });
        }
      })


  }


}

export default new UserController();
