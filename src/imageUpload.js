import React, { useState } from "react";
import firebase from "firebase";
import { db, storage } from "./firebase";
import { Button } from "@material-ui/core";
import "./imageUpload.css";
import axios from "./axios";

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      // choose only first file selected
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // uploading the image
    // ref: gets a reference to storage in firebase
    // put: puts the image in the link specified in the ref in our firebase storage
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    // since uploadTask is asynchronous we handle it by using event listener
    // provided to us by firebase storage api

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // getting the progress bar functionality
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // if any error occurs during uploading
        console.log(error);
        alert(error.message);
      },
      () => {
        // if image upload is complete
        storage
          .ref("images") // get reference to the images folder in our storage
          .child(image.name) // go to the image name using child()
          .getDownloadURL() // the url of the image which just got uploaded in firebase storage
          .then((url) => {
            setUrl(url);

            axios.post("/upload", {
              caption: caption,
              user: username,
              image: url,
            });

            // add the image to your database*
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(), // server time remains same for every where
              caption: caption,
              imageUrl: url,
              username: username,
            });

            // reset the state after the upload
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress
        className="imageUpload__progress"
        value={progress}
        max="100"
      ></progress>

      <input
        type="text"
        placeholder="Enter your caption here..."
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
      />

      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
