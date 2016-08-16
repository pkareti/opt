require('package-script').spawn([{
    admin: false,
    command: "npm",
    args: ["install", "-g", "gulp"]
  }, {
    admin: false,
    command: "npm",
    args: ["install", "-g", "meteor-build-client"]
  }, {
    admin: false,
    command: "npm",
    args: ["install", "-g", "mgp"]
  }, {
    admin: false,
    command: "npm",
    args: ["install", "-g", "phantomjs"]
  }, {
    admin: false,
    command: "npm",
    args: ["install", "-g", "spacejam"]
  }, {
    admin: false,
    command: "npm",
    args: ["install", "-g", "starrynight"]
  }

]);
