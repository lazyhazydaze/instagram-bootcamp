import React from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty posts array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
      textInput: "",
      fileInput: "",
      fileInputFile: null,
    };
  }

  componentDidMount() {
    const postsRef = databaseRef(database, DB_POSTS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      console.log("data", data);
      console.log("data.key", data.key);
      console.log("data.val", data.val());
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        posts: [
          ...state.posts,
          {
            key: data.key,
            val: data.val(),
          },
        ],
      }));
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (e) => {
    e.preventDefault();

    const imageRef = storageRef(
      storage,
      DB_POSTS_KEY + "/" + this.state.fileInput
    );
    const messageListRef = databaseRef(database, DB_POSTS_KEY);
    const newMessageRef = push(messageListRef); //POST request
    console.log("this.state.fileInputFile", this.state.fileInputFile); // This is a FILE
    uploadBytes(imageRef, this.state.fileInputFile).then(() => {
      getDownloadURL(imageRef).then((url) => {
        set(newMessageRef, {
          content: this.state.textInput,
          timeStamp: new Date().toLocaleString(),
          picture: url,
        }).then(
          this.setState({
            textInput: "",
            fileInput: "",
            fileInputFile: null,
          })
        );
      });
    });
  };

  handleFileInputChange = (e) => {
    console.log("wtf", e.target);
    this.setState(
      { fileInputFile: e.target.files[0], fileInput: e.target.value },
      () => console.log(this.state)
    );
  };

  handleTextInputChange = (e) => {
    this.setState({
      textInput: e.target.value,
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.posts.map((message) => (
      <li key={message.key}>
        <div>
          {message.val.content}
          {message.val.timeStamp}
          <img src={message.val.picture} width="50vw" height="30vw" alt="" />
        </div>
      </li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form onSubmit={this.writeData}>
            <input
              type="file"
              value={this.state.fileInput}
              onChange={this.handleFileInputChange}
            />
            <input
              type="text"
              placeholder="Enter Message Here"
              value={this.state.textInput}
              onChange={this.handleTextInputChange}
            />
            <input type="submit" value="Send" />
          </form>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
