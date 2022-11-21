import React from "react";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";

const DB_POSTS_KEY = "posts";

export default class NewsFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { posts: [] };
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

  render() {
    let messageListItems = this.state.posts.map((message) => (
      <li key={message.key}>
        <div>
          {message.val.content}
          {message.val.timeStamp}
          <img src={message.val.picture} width="50vw" height="30vw" alt="" />
        </div>
      </li>
    ));
    return <ol>{messageListItems}</ol>;
  }
}
