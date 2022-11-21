import React from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "../firebase";

const DB_POSTS_KEY = "posts";
const DB_IMAGES_KEY = "images";

export default class Composer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: "",
      fileInput: "",
      fileInputFile: null,
    };
  }

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

  handleSubmit = (e) => {
    e.preventDefault();

    const imageRef = storageRef(
      storage,
      DB_IMAGES_KEY + "/" + this.state.fileInput
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

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
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
    );
  }
}
