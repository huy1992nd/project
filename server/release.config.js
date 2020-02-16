module.exports = {
    apps : [
      {
      name        : "server",
      script      : "./index.js",
      instance_var: 'INSTANCE_ID',
      env: {
        "NODE_ENV": "release"
      }
    }
  ]
  }