import { DateTime } from "luxon";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import AccountPackage from "../models/AccountPackage.js";


class AdminController {

  // ========== Manage Admin
  // Get all
  getAllAdmins(req, res) {
    Admin.find({}, { _id: 0, __v: 0, password: 0 })
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


  // ========== Manage User ==========

  // Get all users
  getAllUsers = (req, res) => {
    User.find({}, { password: 0, __v: 0, activeCode: 0, _id: 0 })
      .then(users => {
        return res.status(200).send(users)
      })
  }

  // Update
  updateUser = (req, res) => {

    let username = req.body.username;

    User.find({ username: username })
      .then(acc => {
        if (acc.length >= 1) {
          User.findOneAndUpdate({ username: username }, req.body)
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
  softDeleteUser = (req, res) => {
    let username = req.body.username;
    let currentTime = DateTime.utc().toISO();


    let accSoftDelDetail = {
      status: -1,
      deleteAt: currentTime
    }

    User.findOne({ username: username })
      .then(acc => {
        if (acc) {
          if (acc.status == -1) {
            res.json({
              Error: "Account has been deleted before."
            })
          }
          else {
            User.findOneAndUpdate({ username: username }, accSoftDelDetail)
              .then(() => {
                res.status(200).json({
                  Result: "Soft delete account successfully."
                })
              })
          }
        }
        else {
          res.json({
            Error: "Account not found!"
          });
        }
      })



  }

  // Delete
  deleteUser = (req, res) => {
    let username = req.body.username;

    User.find({ username: username })
      .then(acc => {
        if (acc.length >= 1) {
          User.findOneAndRemove({ username: username })
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


  // ============== Manage Account package ===============
  // Get all
  getAccountPackages = (req, res) => {
    AccountPackage.find({}, { __v: 0 }).sort({ package: "ascending" })
      .then(accountPackages => {
        res.send(accountPackages)
      })

  }

  // Add
  addAccountPackage = (req, res) => {
    let adminUserName = req.body.adminUserName;
    let accountPackageInfo = req.body.accountPackageInfo;

    // Check admin account
    Admin.findOne({ username: adminUserName })
      .then(acc => {
        if (acc != null) {

          AccountPackage.find({
            $or: [
              { package: accountPackageInfo.package },
              { name: accountPackageInfo.name }
            ]
          })
            .then(accPkgs => {
              if (accPkgs.length > 0) {
                res.status(401).json({ Error: "Package existed." })
              }
              else {
                // Add account package
                let accountPackage = new AccountPackage(accountPackageInfo);
                accountPackage.save()
                  .then(() => res.json({
                    Result: "Add account package successfully."
                  }))
                  .catch(error => { });
              }
            })

        }
        else {
          res.json({
            Error: "Wrong account or don't have permission."
          })
        }

      })




  }

  // Update
  updateAccountPackage = (req, res) => {
    let adminUserName = req.body.adminUserName;
    let adminAPIKey = req.body.adminAPIKey;
    let accountPackageInfo = req.body.accountPackageInfo;

    // Check admin account
    Admin.findOne({ username: adminUserName, adminAPIKey: adminAPIKey })
      .then(acc => {
        if (acc != null) {
          // Check package is exist or not
          AccountPackage.findOne({ package: accountPackageInfo.package })
            .then(pkg => {
              // Update package
              if (pkg != null) {
                AccountPackage.findOneAndUpdate({ package: accountPackageInfo.package }, accountPackageInfo)
                  .then(() => {
                    res.json({
                      Result: "Update account package successfully."
                    })
                  })
              }
              // Not found
              else {
                res.json({
                  Error: "Account package not found!"
                })
              }
            })
        }
        else {
          res.json({
            Error: "Wrong account or don't have permission."
          })
        }

      })

  }

  // Delete
  deleteAccountPackage = (req, res) => {
    let adminUserName = req.body.adminUserName;
    let accountPackageInfo = req.body.accountPackageInfo;

    // Check admin account
    Admin.findOne({ username: adminUserName })
      .then(acc => {
        if (acc) {
          // Check package is exist or not
          AccountPackage.findOne({ package: accountPackageInfo.package })
            .then(pkg => {
              // Update package
              if (pkg) {
                AccountPackage.findOneAndRemove({ package: accountPackageInfo.package })
                  .then(() => {
                    res.json({
                      Result: "Delete account package successfully."
                    })
                  })
              }
              // Not found
              else {
                res.json({
                  Error: "Account package not found!"
                })
              }
            })
        }
        else {
          res.json({
            Error: "Wrong account or don't have permission."
          })
        }

      })

  }



}

export default new AdminController();
