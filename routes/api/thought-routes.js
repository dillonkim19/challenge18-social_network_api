
const router = require('express').Router();
const { Thought, Reaction} = require('../../models')

//TODO: ROUTE TO GET ALL THOUGHTS
router.get('/', (req,res)=> {
    Thought.find({}, (err, thoughts) => {
        if (err) {
            res.send(err)
        }
        res.status(200).json(thoughts)
    }).populate('reactions')
})

//TODO: ROUTE TO CREATE A NEW THOUGHT
router.post('/', (req,res)=> {
    Thought.create({
        thoughtText: req.body.thoughtText,
        username: req.body.username,
    }, (err, thought) => {
        if (err) {
            res.send(err)
        }
        res.status(200).json("Thought added")
    })
});

//TODO: ROUTE TO GET SINGLE THOUGHT BASED ON THOUGHT ID
router.get('/:thoughtId', (req,res)=> {
    Thought.findById(req.params.thoughtId, (err, thought) => {
        if (err) {
            res.send(err)
        }
        res.status(200).json(thought)
    })
})

//TODO: ROUTE TO UPDATE A THOUGHT
router.put('/', (req,res)=> {
    const options = {new: true}
    Thought.findOneAndUpdate(req.body.filter, req.body.update, options, (err, thought) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        res.status(200).json(thought)
    })
})

//TODO: ROUTE TO DELETE A THOUGHT BASED ON THOUGHT ID
router.delete('/:thoughtId', (req,res)=> {
    Thought.findByIdAndDelete(req.params.thoughtId, (err, thoughts) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        res.status(200).json("Thought Deleted!")
    })
});

//TODO: ROUTE TO ADD REACTION TO A THOUGHT
router.post('/:thoughtId/reactions', (req,res)=> {

    Reaction.create({
        reactionBody: req.body.reactionBody,
        username: req.body.username,
    }, (reactionErr, reaction) => {
        Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $push: { reactions: reaction }},
            (thoughtErr, thought) => {
                if (thoughtErr) {
                    console.log(thoughtErr)
                    res.send(thoughtErr)
                }
                console.log('Reaction: ', req.body.reactionBody, ' added!')
                res.status(200).json('Reaction Added!')
            }
        )
    })

    // let newReaction = new Reaction({
    //     reactionBody: req.body.reactionBody,
    //     username: req.body.username,
    // })
    // newReaction.save((err, result) => {
    //     Thought.findByIdAndUpdate(
    //         req.params.thoughtId,
    //         {$push: { reactions: newReaction }},
    //         (err, thought) => {
    //             if (err) {
    //                 console.log(err)
    //                 res.send(err)
    //             }
    //             console.log('Reaction: ', newReaction.reactionBody, 'added to thought')
    //             res.status(200).json(thought)
    //         }
    //     )
    // })

});

//TODO: ROUTE TO DELETE A REACTION ON A THOUGHT
router.delete('/:thoughtId/reactions/:reactionId', (req,res)=> {
    Reaction.findByIdAndDelete(req.params.reactionId, (reactionErr, reaction) => {

        Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $pull: {reaction} },
            (err, thought) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                }
                console.log(reaction)
                console.log('Reaction: ', req.params.reactionId, ' deleted!')
                res.status(200).json(thought)
            }
        )
    })

})

module.exports = router;
