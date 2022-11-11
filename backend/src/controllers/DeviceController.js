import Device from "../models/Device.js";
import Account from "../models/Account.js";
import { json } from "stream/consumers";
import { stringify } from "querystring";

class DeviceController {
  // Get all
  getAllDevicesByUser(req, res) {
    let username = req.body.username;
    let userAPIKey = req.body.userAPIKey;

    // Account
    Account.findOne({ username: username }).then((acc) => {
      // Check account is exist or not
      if (acc != null) {
        // Check API key
        if (userAPIKey == acc.userAPIKey) {
          // Get devices
          Device.find({ username: username }).then((devices) => {
            res.send(devices);
          });
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

  // Get one device
  getADevice(req, res) {
    let username = req.body.username;
    let userAPIKey = req.body.userAPIKey;
    let deviceId = req.body.deviceId;

    // Account
    Account.findOne({ username: username }).then((acc) => {
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

  // Add
  addDevice(req, res) {
    let username = req.body.username;
    let userAPIKey = req.body.userAPIKey;
    let deviceInfo = req.body.deviceInfo;
    let deviceName = deviceInfo.name;

    // Account
    Account.findOne({ username: username }).then((acc) => {
      // Check account is exist or not
      if (acc != null) {
        // Check API key
        if (userAPIKey == acc.userAPIKey) {
          // Check device name exist or not
          Device.findOne({ username: username, name: deviceName }).then(
            (result) => {
              if (result == null) {
                // Add device
                let device = new Device(deviceInfo);
                device
                  .save()
                  .then(() =>
                    res.json({
                      Result: "Add device successfully.",
                    })
                  )
                  .catch((error) => { });
              }
              // Device name existed
              else {
                res.json({
                  Error: "Device name existed!",
                });
              }
            }
          );
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

    Account.findOne({ username: username }).then((acc) => {
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

    Account.findOne({ username: username }).then((acc) => {
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

export default new DeviceController();
