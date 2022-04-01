const Users = require('../users/users-model')

async function checkUsernameFree(req, res, next) {
  try {
    const users = await Users.findBy({username: req.body.username})
      if(!users.length) {
        next()
      } else {
        next({
          message: "username taken",
          status: 422
        })
      }
  } catch (err) {
    next(err)
  }
}

function validateUser (req, res, next) {
    console.log(req.body)
    const {username, password} = req.body
    if(
        !username.trim() || 
        !password.trim() || 
        username && password === 'undefined'
    ) {
      next({
        message:"username and password required",
        status:400
      })
    } else {
        next()
    }

}

module.exports  = {
    checkUsernameFree,
    validateUser, 
}