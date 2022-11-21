import React from "react";
import Composer from "./Components/Composer";
import NewsFeed from "./Components/NewsFeed";

import logo from "./logo.png";
import "./App.css";


class App extends React.Component {
  

  render() {
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Composer />
          <NewsFeed />
        </header>
      </div>
    );
  }
}

export default App;
