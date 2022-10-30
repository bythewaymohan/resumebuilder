const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Resume = require('../models/Resume')

// @desc Show add resume
//route GET/resume/add

router.get('/add',ensureAuth, (req,res)=>{
    res.render('resume/add');
})

// @desc process the add form
//route POST/resumes

router.post('/',ensureAuth, async (req,res)=>{
    try{
        req.body.user = req.user.id
        await Resume.create(req.body)
        res.redirect('/dashboard')
    }catch (err){
        console.error(err);
        res.render('error/500')

    }
})


//@decsription   Show Resume
//@route         GET/resume/:id
router.get('/:id', async(req, res) => {
    try{
        let resume = await Resume.findById(req.params.id)
        .populate('user')
        .lean()

        if(!resume){
            return res.render('error/404')
        }

        res.render('resume/show',{
            resume
        })
    } catch (err){
        console.error(err);
        res.render('error/404')
    }
})


//@decsription   Show edit page
//@route         GET/resume/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id
        }).lean()

        if (!resume) {
            return res.render('error/404')
        }

        if (resume.user != req.user.id) {
            res.redirect('/resume')
        } else {
            res.render('resume/edit', {
                resume,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

//@decsription   Update Resume
//@route         PUT/resume/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let resume = await Resume.findById(req.params.id).lean()

        if (!resume) {
            return res.render('error/404')
        }

        if (resume.user != req.user.id) {
            res.redirect('/show')
        } else {
            resume = await Resume.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,

            })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }

})

//@decsription   Delete Story
//@route         DELETE/resume/id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Resume.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

module.exports = router