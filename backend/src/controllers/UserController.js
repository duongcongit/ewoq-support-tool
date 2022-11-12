import { DateTime } from "luxon";
import User from "../models/User.js";
import Device from "../models/Device.js";

class UserController {

  // Update
  updateUser(req, res) {

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
  softDeleteUser(req, res) {
    let username = req.body.username;
    let currentTime = DateTime.utc().toISO();


    let accSoftDelDetail = {
      status: 0,
      deleteAt: currentTime
    }

    User.find({ username: username })
      .then(acc => {
        if (acc.length >= 1) {
          User.findOneAndUpdate({ username: username }, accSoftDelDetail)
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

  // =========== Manage Devices ===========
  // Get all devices
  getAllDevices(req, res) {
    let username = req.body.username;
    // Account
    User.findOne({ username: username }).then((acc) => {
      // Check user is exist or not
      if (acc != null) {
        Device.find({ username: username }).then((devices) => {
          res.send(devices);
        });
      }
      // Not found user
      else {
        res.json({
          Error: "User not found!",
        });
      }
    });
  }

  // Get one device
  getADevice(req, res) {
    let username = req.body.username;
    let userAPIKey = req.body.userAPIKey;
    let deviceId = req.body.deviceId;

    // Account
    User.findOne({ username: username }).then((acc) => {
      // Check account is exist or not
      if (acc != null) {
        // Check API key
        if (userAPIKey == acc.userAPIKey) {
          // Check device id format
          if (deviceId.length == 24) {
            // Get devices
            Device.findOne({ username: username, _id: deviceId }).
              then((devices) => {
                if (devices != null) {
                  res.send(devices);
                }
                else {
                  res.json({
                    Error: "Device not found!",
                  });
                }

              });
          }
          // Device id wrong format
          else {
            res.json({
              Error: "Device not found!",
            });
          }
        }
        // Wrong API key
        else {
          res.json({
            Error: "User API key not found!",
          });
        }
      }
      // Not found user
      else {
        res.json({
          Error: "User not found!",
        });
      }
    });
  }

  // Update
  updateDevice(req, res) {
    let deviceId = req.body._id;
    let username = req.body.username;
    let userAPIKey = req.body.userAPIKey;
    let deviceDataUpdate = req.body.deviceDataUpdate;

    User.findOne({ username: username }).then((acc) => {
      // Check account is exist or not
      if (acc != null) {
        // Check API key
        if (userAPIKey == acc.userAPIKey) {
          // Check device id format
          if (deviceId.length == 24) {
            Device.find({ _id: deviceId, username: username }).then(
              (findDevice) => {
                // Check device
                if (findDevice.length >= 1) {
                  // Update device
                  Device.findOneAndUpdate(
                    { _id: deviceId, username: username },
                    deviceDataUpdate
                  ).then(() => {
                    res.json({
                      Result: "Update device successfully.",
                    });
                  });
                } else {
                  res.json({
                    Error: "Device not found!",
                  });
                }
              }
            );
          }
          // Device id wrong format
          else {
            res.json({
              Error: "Device not found!",
            });
          }
        }
        // Wrong API key
        else {
          res.json({
            Error: "User API key not found!",
          });
        }
      }
      // Not found user
      else {
        res.json({
          Error: "User not found!",
        });
      }
    });
  }

  // Delete device
  deleteDevice(req, res) {
    let deviceId = req.body._id;
    let username = req.body.username;
    let userAPIKey = req.body.userAPIKey;

    User.findOne({ username: username }).then((acc) => {
      // Check account is exist or not
      if (acc != null) {
        // Check API key
        if (userAPIKey == acc.userAPIKey) {
          // Check device id format
          if (deviceId.length == 24) {
            Device.find({ _id: deviceId, username: username }).then(
              (findDevice) => {
                // Check device
                if (findDevice.length >= 1) {
                  // Delete device
                  Device.findOneAndRemove({
                    _id: deviceId,
                    username: username,
                  }).then(() => {
                    res.json({
                      Result: "Delete device successfully.",
                    });
                  });
                } else {
                  res.json({
                    Error: "Device not found!",
                  });
                }
              }
            );
          }
          // Device id wrong format
          else {
            res.json({
              Error: "Device not found!",
            });
          }
        }
        // Wrong API key
        else {
          res.json({
            Error: "User API key not found!",
          });
        }
      }
      // Not found user
      else {
        res.json({
          Error: "User not found!",
        });
      }
    });
  }


}

export default new UserController();
