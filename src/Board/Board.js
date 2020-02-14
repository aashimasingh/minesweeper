import React, {Component} from 'react';
import Cell from 'D:/react-projects/minesweeper/src/Board/Cell/Cell'
import classes from './Board.module.css';
import happyface from 'D:/react-projects/minesweeper/src/images/happy_smiley.jpg';
import sadface from 'D:/react-projects/minesweeper/src/images/sad_smiley.jpg';

class Board extends Component {
    putMines( mat, rows, cols, mines ) {
        let counter = 0; let randx = 0; let randy = 0;
        while (counter < mines) {
            randx = Math.floor(Math.random() * Math.floor(rows));
            randy = Math.floor(Math.random() * Math.floor(cols));
            if (!mat[randx][randy].isExploded) {
                mat[randx][randy].isExploded = true;
                counter = counter+1;
            }
        }
        return mat;
    }

    boardTraversal(mat, x, y) {
        var neighbors = []
        if (x > 0)
            neighbors.push(mat[x-1][y]);
        if (y > 0)
            neighbors.push(mat[x][y-1]);
        if (x < this.props.rows - 1)
            neighbors.push(mat[x+1][y]);
        if (y < this.props.cols - 1)
            neighbors.push(mat[x][y+1]);
        if (x > 0 && y > 0)
            neighbors.push(mat[x-1][y-1]);
        if (x < this.props.rows -1 && y < this.props.cols -1)
            neighbors.push(mat[x+1][y+1]);
        if (x > 0 && y < this.props.cols -1)
            neighbors.push(mat[x-1][y+1]);
        if (x < this.props.rows -1 && y > 0)
            neighbors.push(mat[x+1][y-1]);
        return neighbors;
    }

    getNumNeighboringMines(tempMat, rows, cols) {
        let mat = tempMat;

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (!mat[i][j].isExploded) {
                    let nmines = 0;
                    const neighb = this.boardTraversal(mat, mat[i][j].xpos, mat[i][j].ypos);

                    neighb.map(value => {
                        if(value.isExploded) {
                            nmines++;
                        }
                    });
                    if (nmines === 0)
                        mat[i][j].hasNothing = true;
                    mat[i][j].neighbor = nmines;
                }
            }
        }
        return mat;
    }

    initBoardMatrix (rows, cols, mines) {
        let mat = [];
        for (var i = 0; i < rows; i++) {
            mat.push([]);
            for (var j = 0; j < cols; j++) {
                mat[i][j] = {
                    xpos : i,
                    ypos : j,
                    isFlagged : false,
                    isExploded : false,
                    isHidden : true,
                    neighbor : 0,
                    hasNothing : false
                }
            }
        }
        mat = this.putMines(mat, rows, cols, mines);
        mat = this.getNumNeighboringMines(mat, rows, cols);
        return mat;
    }

    state = {
        boardMatrix : this.initBoardMatrix ( this.props.rows, this.props.cols, this.props.mines ),
        numMines : this.props.mines,
        gameStatus : "Game in progress",
        smileyStatus : happyface
    }
    

    showBoard() {
        let newState = this.state.boardMatrix;
        newState.map((matRow) => {
            matRow.map((matCol) => {
                matCol.isHidden = false;
            });
        });
        this.setState({boardMatrix : newState})
    }

    numHidden(tempMat) {
        let arr = []
        tempMat.map((tempMatRow) => {
            tempMatRow.map((tempMatCol) => {
                if (tempMatCol.isHidden)
                    arr.push(tempMatCol);
            });
        });
        return arr.length;
    }

    numFlags(tempMat) {
        let arr = []
        tempMat.map((tempMatRow) => {
            tempMatRow.map((tempMatCol) => {
                if (tempMatCol.isFlagged)
                    arr.push(tempMatCol);
            });
        });
        return arr.length;
    }

    revealNeighbors( x, y, tempMat ) {
        let neigh = this.boardTraversal( tempMat, x, y );
        neigh.map(objs=>{
            if (!objs.isFlagged && (!objs.isExploded || objs.hasNothing) && objs.isHidden) {
                tempMat[objs.xpos][objs.ypos].isHidden = false;
                if (objs.hasNothing) {
                    this.revealNeighbors(objs.xpos, objs.ypos, tempMat);
                }
            }
        });
        return tempMat;
    }

    _cellClickEvent (x, y) {
        if (!this.state.boardMatrix[x][y].isHidden || this.state.boardMatrix[x][y].isFlagged)
            return null;
        
        if (this.state.boardMatrix[x][y].isExploded) {
            this.setState({gameStatus : "Game lost", smileyStatus : sadface});
            this.showBoard();
            alert("Game Over");
        }

        let tempMat = this.state.boardMatrix;
        tempMat[x][y].isFlagged = false;
        tempMat[x][y].isHidden = false;

        if (tempMat[x][y].hasNothing) {
            tempMat = this.revealNeighbors(x, y, tempMat);
        }
        if (this.numHidden(tempMat) === this.props.mines) {
            this.setState({numMines: 0});
            this.showBoard();
            alert("You won!");
        }
        this.setState({boardMatrix: tempMat, numMines: this.props.mines - this.numFlags(tempMat)});
    }

    _rightClickEvent(x,y) {
        let tempMat = this.state.boardMatrix;
        if (tempMat[x][y].isHidden)
            tempMat[x][y].isFlagged = true;
        this.setState({boardMatrix: tempMat, numMines: this.props.mines - this.numFlags(tempMat)});
    }

    renderBoard(boardMatrix) {
        return boardMatrix.map((boardRow) => {
            return boardRow.map((boardCol) => {
                return (
                    <div key={boardCol.xpos * boardRow.length + boardCol.ypos} 
                    onClick={this._cellClickEvent.bind(this,boardCol.xpos,boardCol.ypos)}
                    onContextMenu={this._rightClickEvent.bind(this,boardCol.xpos,boardCol.ypos)}>
                        <Cell value={boardCol} />
                    </div>
                );
            });
        });
    }

    restartGame() {
        this.setState({boardMatrix: this.initBoardMatrix(this.props.rows, this.props.cols, this.props.mines), numMines: this.props.mines, 
            gameStatus:"Game in progress", smileyStatus:happyface});
    }

    render () {
        return (
            <div className = {classes.board}>
                <div className = {classes.boardHeader}> 
                    <div className = {classes.part1}>MINES LEFT: {this.state.numMines}</div>
                    <img className = {classes.smiley} src={this.state.smileyStatus}/>
                    <button onClick={this.restartGame.bind(this)} className = {classes.restartButton}>Restart the game</button>
                </div>
                {this.renderBoard(this.state.boardMatrix)}
            </div>
        )
    }
}

export default Board;