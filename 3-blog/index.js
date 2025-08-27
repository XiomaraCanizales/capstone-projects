import express from 'express'
import bodyParser from 'body-parser'

/* To handle PATCH requests from a form, use the method-override package. 
This middleware allows to use POST from the form and have it treated as PATCH */
import methodOverride from 'method-override'

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// Override with POST having ?_method=PATCH
app.use(methodOverride('_method'));

const posts = []

// get home
app.get('/', (req, res) => {
    res.render('index.ejs')
})

// display new post form
app.get('/post', (req, res) => {
    res.render('post.ejs')
})

// handle form submission
app.post('/posts', (req, res) => {
    const { title, content } = req.body
    posts.push({ title, content })
    res.redirect('/all-posts')
})

// display all posts
app.get('/all-posts', (req, res) => {
    res.render('all-posts.ejs', { posts })
})

// update post
app.get('/update-post/:title', (req, res) => {
    const post = posts.find(post => post.title === req.params.title)
    if (post) {
        res.render('update-post.ejs', { post })
    } else {
        res.status(404).send('Post not found')
    }
})

// This will handle a POST request with the _method query parameter as PATCH
app.patch('/update-post', (req, res) => {
    const { title, content } = req.body;
    const index = posts.findIndex(post => post.title === title)

    if (index !== -1) {
        posts[index].content = content
        res.redirect('/all-posts')
    } else {
        res.status(404).send('Post not found')
    }
});


// delete post
app.delete('/delete-post/:title', (req, res) => {
    const index = posts.findIndex(post => post.title === req.params.title)
    if (index !== -1) {
        posts.splice(index, 1)
        res.redirect('/all-posts')
    } else {
        res.status(404).send('Post not found')
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})