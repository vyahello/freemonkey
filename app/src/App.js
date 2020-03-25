import React, { Component } from 'react';
import './App.css';
import './index.css';
import { getRandomMovie } from "./data";

const GAME_TITLE = 'Free Monkey';
const WON_MSG = 'Congrats, you freed the monkey!';
const LOST_MSG = 'Ouch, monkey is locked away :(';
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const PLACEHOLDER = '_';
const ALLOWED_GUESSES = 5;
const MONKEY_IMG = (num) => `http://projects.bobbelderbos.com/hangman/monkey${num}.png`;
const WIN_STATE = '_wins';


class App extends Component  {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount = () => this.resetGame();

    resetGame = () => {
        const movie = getRandomMovie(); // we guess a movie
        console.log(movie);

        this.setState({
            header: GAME_TITLE,
            movie: movie.split(''),  // we split it into an array
            mask: movie.replace(/[A-Za-z]/g, PLACEHOLDER).split(''), // we mask all alphabet letters
            buttonWidget: this.createButtons(), // will be called when we reset the game
            badGuesses: 0,
        })
    };

    createButtons = () => {
        let buttons = [];
        for(const [index, letter] of ALPHABET.entries()) {
            buttons.push(
                <button className="letter" key={index} onClick={this.matchChar}>{letter.toUpperCase()}</button>
            )
        }
        return buttons;
    };

    matchChar = (item) => {
        const guessed = item.target.innerHTML;
        const guessedLowercase = guessed.toLowerCase();
        let assertedLetter = false;
        let newMask = [];
        for(let index = 0; index < this.state.movie.length; index++) {
            if(this.state.movie[index].toLowerCase() === guessedLowercase) {
                newMask.push(this.state.movie[index]);
                assertedLetter = true;
            }
            else {
                newMask.push(this.state.mask[index]);
            }
        }
        this.setState({
            mask: newMask,
            badGuesses: assertedLetter? this.state.badGuesses: this.state.badGuesses + 1
        }, this.checkWinOrLoss)

        item.target.disabled = true;
        item.target.style.backgroundColor = assertedLetter? "green": "red";
        item.target.style.color = "white";
    }

    gameWon = () => !this.state.mask.includes(PLACEHOLDER);

    gameOver = () => this.state.badGuesses >= ALLOWED_GUESSES;

    newGameButton = (btnText) => <button onClick={this.resetGame}>{btnText}</button>;

    checkWinOrLoss = () => {
        // if won
        if(this.gameWon()) {
            this.setState({
                header: WON_MSG,
                badGuesses: WIN_STATE, // show winning image
                buttonWidget: this.newGameButton('Play again')
            })
            return;
        }
        //
        if(this.gameOver()) {
            this.setState({
                header: LOST_MSG,
                mask: this.state.movie, // show what the movie was
                buttonWidget: this.newGameButton('Try again')
            })
            return;
        }
    }

    render() {
        return (
            <div id="game">
                <h1>{this.state.header}</h1>
                <img id="state" src={MONKEY_IMG(this.state.badGuesses)} alt="monkey state" />
                <div id="mask">{this.state.mask}</div>
                <div id="keyboard">{this.state.buttonWidget}</div>
            </div>
        )
    }
}

export default App;

