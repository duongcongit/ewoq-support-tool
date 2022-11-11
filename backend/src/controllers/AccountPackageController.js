import AccountPackage from "../models/AccountPackage.js";
import Admin from "../models/Admin.js";


class AccountPackageController {

  // Get all
  getAccountPackages(req, res) {
    AccountPackage.find().sort({ package: "ascending" })
      .then(accountPackages => {
        res.send(accountPackages)
      })

  }

  // Add
  addAccountPackage(req, res) {
    let adminUserName = req.body.adminUserName;
    let adminAPIKey = req.body.adminAPIKey;
    let accountPackageInfo = req.body.accountPackageInfo;

    // Check admin account
    Admin.findOne({ username: adminUserName, adminAPIKey: adminAPIKey })
      .then(acc => {
        if (acc != null) {
          // Add account package
          let accountPackage = new AccountPackage(accountPackageInfo);
          accountPackage.save()
            .then(() => res.json({
              Result: "Add account package successfully."
            }))
            .catch(error => { });
        }
        else {
          res.json({
            Error: "Wrong account or don't have permission."
          })
        }

      })




  }

  // Update
  updateAccountPackage(req, res) {
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
  deleteAccountPackage(req, res) {
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

export default new AccountPackageController();

