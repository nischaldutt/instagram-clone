import React, { useState, useEffect } from "react";
import firebase                       from "firebase";
import Avatar                         from "@material-ui/core/Avatar";
import { db }                         from "./firebase";
import                                     "./post.css";

function Post({ postId, user, username, imageUrl, caption }) {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")

  useEffect(() => { 
    let unsubscribe
    if(postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc') 
        .onSnapshot((snapshot) => { 
          setComments(snapshot.docs.map(doc => doc.data()))
        })
    }

    return () => {
      // cleanup
      unsubscribe()
    }
  }, [postId])

  const postComment = (e) => {
    e.preventDefault()
    console.log('posting')
    db.collection("posts").doc(postId).collection("comments").add({
      key: postId + firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    
    setComment("")
  }

  return (
    <div className="post">
      {/* header -> avatar + username */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          src=""
          alt={username}
        />
        <h4>{username}</h4>
      </div>

      {/* image */}
      <img className="post__image"
      src={imageUrl}
      alt=""/>
      
      {/* username + caption */}
      <p className="post__text"><strong>{username}</strong> {caption}</p>

      <div className="post__comment">
        {comments.map((comment) => {
          return <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        })}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input" 
            type="text" 
            placeholder="Add your comment here" 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
          />

          <button
            className="post__button" 
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  )
}

export default Post
