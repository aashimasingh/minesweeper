import React, { Component } from 'react';

import classes from './App.module.css';
import Board from './Board/Board';

class App extends Component {
  state = {
    rows : 8,
    cols : 8,
    mines : 10
  };

  render() {
    return (
      <div className={classes.App}>
        <h1 className={classes.head}>Minesweeper</h1>
        <Board rows={this.state.rows} cols={this.state.cols} mines={this.state.mines}></Board>
      </div>
    );
  }
}

export default App;
