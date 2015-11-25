// require the schema & model
var User = require('../models/User.js')

function edit(req, res) {
  // find the user and select the name&email&password field and execute the specified function
  User.findOne({_id: req.body.id}).select('name email password').exec(function(err, user){
    if (err) {console.log(err)}
    else {
      user.local.name = req.body.name
      user.local.email = req.body.email
      if (req.body.password !== "") { // only encrypt the password if there was a value in the password field
        user.local.password = user.generateHash(req.body.password) // save the new encrypted password
      }
      user.save(function(err){ // save the change
        if (err) res.send(err)
      })
    }
    req.flash('edit', 'Information was saved succesfully')
    res.render('edit', {user: user, messages: req.flash('edit')}) // send the flash so it message will be available in view
  })
}

module.exports = {
  editUser: edit
}
