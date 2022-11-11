import { DateTime } from "luxon";
import Account from "../models/Account.js";

class AccountController {

  // Get all
  getAllUsers(req, res) {
    Account.find()
      .then(accounts => {
        res.send(accounts)
      })
  }

  // Add
  addUser(req, res) {

    let accountInfo = req.body;
    let username = accountInfo.username;

    let currentTime = DateTime.utc().toISO();
    accountInfo.createAt = currentTime;
    accountInfo.deleteAt = null;

    let account = new Account(accountInfo);

    Account.find({ username: username })
      .then(acc => {
        if (acc.length >= 1) {
          res.json({
            Error: "Account is exist!"
          });
        }
        else {
          account.save()
            .then(() => res.json({
              Result: "Add account successfully."
            }))
            .catch(error => { });
        }
      })



  }

  // Update
  updateUser(req, res) {

    let username = req.body.username;

    Account.find({ username: username })
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

export default new AccountController();
