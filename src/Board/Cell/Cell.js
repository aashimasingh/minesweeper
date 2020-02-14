import React, { Component } from 'react';
import classes from 'D:/react-projects/minesweeper/src/Board/Board.module.css';

class Cell extends Component {

    val ()  {
        const {value} = this.props;

        if (value.isHidden) {
            if (value.isFlagged)
                return "🚩";
            else 
                return null;
        }
        if (value.isExploded)
            return "💣";
        if (value.neighbor === 0)
            return null;

        return value.neighbor;
    }

    render () {
        let classname = classes.Sq + " " +(this.props.value.isHidden ? "":classes.revealed);
        return (
            <div className={classname}>
                {this.val()}
            </div>
        );
    }
}

export default Cell;