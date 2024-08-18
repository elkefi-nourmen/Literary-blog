const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes=require('./routes/blogRoutes');//double dots means come out of the current folder

// express app
const app = express();

// connect to mongodb
const dburi = 'mongodb+srv://maram:12657866ak@cluster0.on7g7xc.mongodb.net/project';
mongoose.connect(dburi)
  .then((result) => {
    console.log('connected to db');
    // listen for requests after connecting to the database
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.log(err);
  });

// register view engine
app.set('view engine', 'ejs');

// middleware and static files (images, css files, etc.)
app.use(express.static('public')); // every file in the public folder is considered static
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));

//mongoose and mongo sandbox routes
app.get('/add-blog',(req,res)=>{
const blog=new Blog({
  title:'new blog2',
  snippet:'about my new blog',
  body:'more about my new blog'
});
blog.save()//we use save with an instance of the Blog 
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err)
  });
});

app.get('/all-blogs',(req,res)=>{
Blog.find()// we don't use an instance with find 
  .then((result)=>{
    res.send(result);
  })
  .catch((err)=>{
    console.log(err);
  });
});


app.get('/single-blog',(req,res)=>{
  Blog.findById('66a8cb4ee29b89cf05f85557')
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
      console.log(err);
    })
})

/* Uncomment this if you want to log each request
app.use((req, res, next) => {
  console.log('new request made:');
  console.log('host:', req.hostname);
  console.log('path:', req.path);
  console.log('method:', req.method);
  next(); // it tells express that we're finished with this middleware and can move on to the next one
});
*/

app.get('/', (req, res) => {
 res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  // res.send('<p>hello world</p>');
  // res.sendFile('./views/about.html', { root: __dirname });
  res.render('about', { title: 'About' });
});

// redirects
app.get('/about-us', (req, res) => {
  res.redirect('./about');
});


//blog routes

app.use('/blogs',blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
