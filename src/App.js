import React, { useState, useEffect }           from "react";
import InstagramEmbed                           from 'react-instagram-embed';
import { makeStyles }                           from '@material-ui/core/styles';
import { Button, Input }                        from "@material-ui/core";
import Modal                                    from '@material-ui/core/Modal';
import Post                                     from "./post";
import { db, auth }                             from "./firebase";
import ImageUpload                              from "./imageUpload";
import                                               "./App.css";

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // useEffect = componentDidMount() + componentDidUpdate() + componentWillUnmount()
  // useEffect runs a piece of code based on a specific condition
  useEffect(() => {
    // get the all the posts from firebase initially when our app first loads 
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      // "posts" in collection is the collection in firebase
      // onSnapshot is a real time powerful listener
      // so whenever some data gets added to posts array in firebase onSnapshot listens and fires immediately
      // every time a new post is added, this code fires
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, // id is th document id which recently got added in the db
        post: doc.data(), // data() gives you all of the properties and values which we get from the newly created post and update posts
      })))
    })
    return 
  }, []) 
  
  useEffect(() => { // listens for changes on the front end
    const unsubscribe = auth.onAuthStateChanged((authUser) => { // listens for the changes on the back end
      // onAuthStateChanged returns a callback if any authentication change occurs 
      // authUser is passed in the callback which contains information regarding the user
      // onAuthStateChanged also keeps the user logged in, even after the refresh on the page
      if(authUser) {
        // if user logged in 
        setUser(authUser)
      }
      else {
        // if user logged out 
        setUser(null)
      }
    })

    // consider if the user and username get changed several time then we'll have
    // several listeners in our app and load will be very high

    // we can return a function insider useEffect, which gets fired up 
    // just before the next time useEffect is about to run ie. when user and username change
    return () => {
      // if the useEffect fires up again then perform some clean up action here
      // we get unsubscribe from onAuthStateChanged 
      // here we are unsubscribing the listener
      console.log("unsubscribe == ")
      console.log(unsubscribe)
      unsubscribe()
    }
  }, [user, username]) 
  // whenever the user and username in our current state change, it gets fired up

  // registering a new user using firebase
  const signUp = (e) => {
    e.preventDefault()

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      // we need to use return here becoz it is from a promise
      return authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false)
  }

  const logIn = (e) => {
    e.preventDefault()

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenLogin(false)
  }

  return (
    <div className="app">
      {/* signup and login modal*/}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
              className="app__headerImage"
            />

            <form className="app__signup">
              <Input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button onClick={signUp}>Sign Up</Button>
            </form>
          </center>
        </div>
      </Modal>

      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
              className="app__headerImage"
            />

            <form className="app__signup">
              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button onClick={logIn}>Login</Button>
            </form>
          </center>
        </div>
      </Modal>

      {/* Header */}
      <div className="app__header">
        <a href="https://instagram-clone-27222.web.app/">
          <img
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
            className="app__headerImage"
          />
        </a>

        {/* login*/}
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="login__container">
            <Button onClick={() => setOpenLogin(true)}>Login</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )}
      </div>

      {/* Posts*/}
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => {
            return (
              <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                imageUrl={post.imageUrl}
                caption={post.caption}
              />
            );
          })}
        </div>

        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/B94gp_6FGui/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />

          <InstagramEmbed
            url="https://www.instagram.com/p/BnBbQBkFZ-I/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h4 id="ban">Sorry you need to login to upload images.</h4>
      )}
    </div>
  );
}

export default App;
