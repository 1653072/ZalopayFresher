import React from 'react';
import './minesweeper.css';
import {Container, Row, Table} from 'react-bootstrap';


// ------------------------------------------------------
// Function
// ------------------------------------------------------
function createEmptyArray(size) {
    let data = [];
    for (let i = 0; i < size; i++) {
        data.push([]);
        for (let j = 0; j < size; j++) {
            data[i][j] = {
                x: i,
                y: j,
                isMine: false,
                neighbour: 0,
                isEmpty: false,
            };
        }
    }
    return data;
}

function plantMines(data, size, mines) {
    let randomx, randomy, minesPlanted = 0;
    while (minesPlanted < mines) {
        randomx = Math.floor((Math.random() * size)); // random from 0 - (size-1)
        randomy = Math.floor((Math.random() * size)); // random from 0 - (size-1)
        if (!(data[randomx][randomy].isMine)) {
            data[randomx][randomy].isMine = true;
            minesPlanted++;
        }
    }
    return data;
}

function getNeighbours(data, size) {
    let updatedData = data;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (data[i][j].isMine !== true) {
                let mine = 0;
                const area = traverseBoard(data[i][j].x, data[i][j].y, size, data);

                area.map(value => {
                    if (value.isMine) {
                        mine++;
                    }
                    return value;
                });

                if (mine === 0) {
                    updatedData[i][j].isEmpty = true;
                }

                updatedData[i][j].neighbour = mine;
            }
        }
    }
    return updatedData;
}

// looks for neighbouring cells and returns them
function traverseBoard(x, y, size, data) {
    const el = [];

    //up
    if (x > 0) {
        el.push(data[x - 1][y]);
    } 

    //down
    if (x < size - 1) {
        el.push(data[x + 1][y]);
    }

    //left
    if (y > 0) {
        el.push(data[x][y - 1]);
    }

    //right
    if (y < size - 1) {
        el.push(data[x][y + 1]);
    }

    // top left
    if (x > 0 && y > 0) {
        el.push(data[x - 1][y - 1]);
    }

    // top right
    if (x > 0 && y < size - 1) {
        el.push(data[x - 1][y + 1]);
    }

    // bottom right
    if (x < size - 1 && y < size - 1) {
        el.push(data[x + 1][y + 1]);
    }

    // bottom left
    if (x < size - 1 && y > 0) {
        el.push(data[x + 1][y - 1]);
    }

    return el;
}

function initBoardData(size, mines) {
    let data = createEmptyArray(size);
    data = plantMines(data, size, mines);
    data = getNeighbours(data, size);
    return data;
}


// ------------------------------------------------------
// Class Minesweeper
// ------------------------------------------------------
class Minesweeper extends React.Component {

    // ----------------
    // Constructor
    // ----------------
    constructor(props) {
        super(props);
        let data = initBoardData(1, 1);
        this.state = {size: '1', bombs: '1', arrBox: data};

        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.handleBombsChange = this.handleBombsChange.bind(this);
        this.handleGeneration = this.handleGeneration.bind(this);
    }

    // ----------------
    // Functions
    // ----------------
    handleSizeChange(event) {
        this.setState({size: event.target.value});
    }

    handleBombsChange(event) {
        var maxBombs = this.state.size * this.state.size;
        if (event.target.value > maxBombs) 
            this.setState({bombs: maxBombs});
        else 
            this.setState({bombs: event.target.value});
    }

    handleGeneration(event) {
        var numBombs = this.state.bombs;
        var maxBombs = this.state.size * this.state.size;

        if (numBombs > maxBombs) {
            numBombs = maxBombs;
            this.setState({bombs: numBombs});
        }

        let data = initBoardData(this.state.size, numBombs);
        this.setState({arrBox: data});
        event.preventDefault();
    }

    // ----------------
    // Render
    // ----------------
    renderLogo = () => {
        return (
            <img src={process.env.PUBLIC_URL + "/images/logo.png"} alt="Logo" className="headingLogo"/>
        );
    }

    renderHeading = () => {
        return (
            <Row>
                {this.renderLogo()}
                <h1 className="headingContent">MINESWEEPER</h1>
                {this.renderLogo()}
            </Row>
        );
    }

    renderForm = () => {
        return (
            <form onSubmit={this.handleGeneration}>
                <Row>  
                    <div>
                        <label className="headingLabel">Size</label>
                        <input type="number" className="headingInput" onChange={this.handleSizeChange} value={this.state.size} min="1" max="32" required/>
                    </div>
                    <div>
                        <label className="headingLabel">Bombs</label>
                        <input type="number" className="headingInput" onChange={this.handleBombsChange} value={this.state.bombs} min="1" max="1024" required/>
                    </div>
                    <div>
                        <input type="submit" value="GENERATE" className="headingBtn" />  
                    </div>
                </Row>
            </form>
        );
    }

    renderBombImg = () => {
        return (
            <img src={process.env.PUBLIC_URL + "/images/logo.png"} alt="Logo" className="bombIcon"/>
        );
    }

    renderGame = () => {
        return (
            <div className="gameBox">
                <Table>
                    <tbody>
                        {
                            this.state.arrBox.map((row) => {
                                var boxes = row.map((box) => {
                                    if (box.isMine) return (<td className="bombBox">{this.renderBombImg()}</td>)
                                    if (box.isEmpty) return (<td></td>)
                                    return (<td className="textBox">{box.neighbour}</td>)
                                });

                                return (
                                    <tr>
                                        {boxes}
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
 
    render() {
        return (
            <Container fluid="true">
                {this.renderHeading()}
                {this.renderForm()}
                {this.renderGame()}
            </Container>
        );
    }
}

// ------------------------------------------------------
// Export
// ------------------------------------------------------
export default Minesweeper;