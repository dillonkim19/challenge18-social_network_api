
const router = require('express').Router();
const {User} = require("../../models")

//TODO - ROUTE THAT GETS ALL THE USERS, include friends?
router.get('/', (req,res)=> {
    User.find({}, (err, users) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        res.status(200).json(users)
    }).populate('friends')
    .populate('thoughts')
})

//TODO - ROUTE THAT CREATES A NEW USER
router.post('/', (req,res)=> {
    User.create({
        username: req.body.username,
        email: req.body.email
    }, (err, user) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        res.status(200).json(user)
    })
});

//TODO - ROUTE THAT GETS A SINGLE USER BASED ON USER ID
router.get('/:userId', (req,res) => {
    User.findById(req.params.userId, (err, user) => {
        if (err) {
            res.send(err)
        }
        res.status(200).json(user)
    }).populate('thoughts', 'friends')
})

//TODO - ROUTE THAT UPDATES A SINGLE USER
router.put('/:userId', (req,res)=> {
    const options = {new:true}
    User.findByIdAndUpdate(req.params.userId, req.body, options, (err, user) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        res.status(200).json(user)
    })
})

//TODO - ROUTE THAT DELETES A SINGLE USER BASED ON USER ID
router.delete('/:userId', (req,res)=> {
    User.findByIdAndDelete(req.params.userId, (err, user) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        res.status(200).json("User Deleted!")
    })
});

//TODO - ROUTE THAT ADDS A FRIEND TO A USER
router.put('/:userId/friends/:friendId', (req,res)=> {
    User.findById(req.params.friendId, (friendErr, friend) => {
      User.findByIdAndUpdate(
          req.params.userId,
          { $push: { friends: friend }},
          (userErr, user) => {
            if (userErr) {
                console.log(userErr)
                res.send(userErr)
            }
            console.log('Friend:', friend.username ,' added!')
            res.status(200).json('Friend added!')
          }
      )
    })
})

//TODO - ROUTE THAT DELETES A FRIEND FROM A USER'S FRIENDS, DONT DELETE THE FRIEND AS A USER THOUGH!
router.delete('/:userId/friends/:friendId', (req,res)=> {
    User.findByIdAndUpdate(
        req.params.userId,
        { $pull: {friends: req.params.friendId}},
        (userErr, user) => {
            if (userErr) {
                console.log(userErr)
                res.send(userErr)
            }
            console.log('Friend: deleted!')
            res.status(200).json('Friend deleted!')
        }
    )
});

module.exports = router;
