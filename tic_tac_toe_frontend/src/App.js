import React, { useState, useEffect } from 'react';
import './App.css';

// --- Utility functions for game logic ---

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /**
   * Determines the winner of the tic tac toe game.
   * @param {Array} squares - The current state of the board.
   * @returns {Object} { winner: string, line: array } if found, or null.
   */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let l = 0; l < lines.length; l += 1) {
    const [a, b, c] = lines[l];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function isDraw(squares) {
  /**
   * Returns true if the board is full and there's no winner.
   * @param {Array} squares - Board state.
   */
  return squares.every(Boolean) && !calculateWinner(squares);
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main App for Tic Tac Toe game with a modern, light, center-aligned UI.
   * Handles game state, winner/draw logic, reset, and player indication.
   */

  // Theme toggle (retained for demonstration)
  const [theme, setTheme] = useState('light');

  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState('');
  const [winnerInfo, setWinnerInfo] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      setStatus(`Winner: ${winner.winner}`);
      setWinnerInfo(winner);
    } else if (isDraw(squares)) {
      setStatus("It's a Draw!");
      setWinnerInfo(null);
    } else {
      setStatus(`Current Player: ${xIsNext ? 'X' : 'O'}`);
      setWinnerInfo(null);
    }
  }, [squares, xIsNext]);

  // PUBLIC_INTERFACE
  const handleClick = idx => {
    /**
     * Handles click on a square. Ignores if occupied or game over.
     */
    if (squares[idx] || winnerInfo || isDraw(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(prev => !prev);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /** Resets the game to initial state. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setStatus(`Current Player: X`);
    setWinnerInfo(null);
  };

  // --- Render helpers ---

  const renderSquare = idx => {
    const isWinning =
      winnerInfo && winnerInfo.line && winnerInfo.line.includes(idx);
    return (
      <button
        key={idx}
        className={`ttt-square${isWinning ? ' ttt-win' : ''}`}
        onClick={() => handleClick(idx)}
        aria-label={`Square ${idx + 1} ${squares[idx] ? `filled by ${squares[idx]}` : ''}`}
      >
        {squares[idx]}
      </button>
    );
  };

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <main className="ttt-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <section>
            <h1 className="ttt-title" style={{ color: 'var(--text-primary)' }}>Tic Tac Toe</h1>
            <p className="ttt-status" style={{ color: status.startsWith('Winner') ? '#1976d2' : status.toLowerCase().includes('draw') ? '#f44336' : '#20232a', fontWeight: 500, fontSize: 20 }}>
              {status}
            </p>
          </section>
          <div className="ttt-board">
            {[0, 1, 2].map(row => (
              <div className="ttt-row" key={row}>
                {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22 }}>
            <button className="ttt-btn" onClick={resetGame}>
              {squares.some(Boolean) && (!winnerInfo && !isDraw(squares)) ? 'Restart Game' : 'New Game'}
            </button>
          </div>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </main>
    </div>
  );
}

export default App;
