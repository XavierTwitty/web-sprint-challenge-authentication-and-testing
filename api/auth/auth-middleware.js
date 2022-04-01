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

const checkUsernameExists = async (req, res, next) => {
  /*
    If the username in req.body does NOT exist in the database
    status 401
    {
      "message": "Invalid credentials"
    }
  */
    try {
      const [user] = await Users.findBy({ username: req.body.username });
      if (!user) {
        next({status: 401, message: "Invalid credentials"})
      } else {
        req.user = user
        next()
      }
    } catch (err) {
      next(err)
    }
}

module.exports  = {
    checkUsernameFree,
    validateUser, 
    checkUsernameExists
}