// import React, { useEffect, useState } from "react";
// import { Chess } from "chess.js";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";

// function App() {
//   const [game, setGame] = useState(new Chess());
//   const [selected, setSelected] = useState(null);
//   const [legalMoves, setLegalMoves] = useState([]);
//   const [status, setStatus] = useState("");
//   const [capturedWhite, setCapturedWhite] = useState([]);
//   const [capturedBlack, setCapturedBlack] = useState([]);
//   const [moveHistory, setMoveHistory] = useState([]);
//   const [fenHistory, setFenHistory] = useState([]);
//   const [captureHistory, setCaptureHistory] = useState([]);

//   const moveSound = new Audio("/sounds/move.mp3");
//   const captureSound = new Audio("/sounds/capture.mp3");
//   const checkSound = new Audio("/sounds/move-check.mp3");
//   const checkmateSound = new Audio("/sounds/game-end.mp3");

//   const files = "abcdefgh";
//   const getSquare = (row, col) => files[col] + (8 - row);
//   const board = game.board();

//   useEffect(() => {
//     const savedFen = localStorage.getItem("fen");
//     const savedMoves = JSON.parse(localStorage.getItem("moveHistory") || "[]");
//     const savedCapturedWhite = JSON.parse(localStorage.getItem("capturedWhite") || "[]");
//     const savedCapturedBlack = JSON.parse(localStorage.getItem("capturedBlack") || "[]");
//     const savedCaptureHistory = JSON.parse(localStorage.getItem("captureHistory") || "[]");

//     if (savedFen) {
//       const loadedGame = new Chess(savedFen);
//       setGame(loadedGame);
//       setMoveHistory(savedMoves);
//       setCapturedWhite(savedCapturedWhite);
//       setCapturedBlack(savedCapturedBlack);
//       setCaptureHistory(savedCaptureHistory);
//       setStatus(getStatus(loadedGame));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("fen", game.fen());
//     localStorage.setItem("moveHistory", JSON.stringify(moveHistory));
//     localStorage.setItem("capturedWhite", JSON.stringify(capturedWhite));
//     localStorage.setItem("capturedBlack", JSON.stringify(capturedBlack));
//     localStorage.setItem("captureHistory", JSON.stringify(captureHistory));
//   }, [game, moveHistory, capturedWhite, capturedBlack, captureHistory]);

//   const handleClick = (row, col) => {
//     const square = getSquare(row, col);
//     const piece = game.get(square);

//     if (selected) {
//       if (selected === square) {
//         setSelected(null);
//         setLegalMoves([]);
//         return;
//       }

//       if (legalMoves.includes(square)) {
//         const captured = game.get(square);
//         const prevFen = game.fen();
//         const move = game.move({ from: selected, to: square, promotion: "q" });

//         if (move) {
//           setFenHistory((prev) => [...prev, prevFen]);
//           setCaptureHistory((prev) => [...prev, captured || null]);

//           if (captured) {
//             captured.color === "w"
//               ? setCapturedWhite((prev) => [...prev, captured])
//               : setCapturedBlack((prev) => [...prev, captured]);

//             game.isCheckmate()
//               ? checkmateSound.play()
//               : game.inCheck()
//               ? checkSound.play()
//               : captureSound.play();
//           } else {
//             game.isCheckmate()
//               ? checkmateSound.play()
//               : game.inCheck()
//               ? checkSound.play()
//               : moveSound.play();
//           }

//           setMoveHistory((prev) => [...prev, move.san]);
//           setGame(new Chess(game.fen()));
//           setSelected(null);
//           setLegalMoves([]);
//           setStatus(getStatus(game));
//         }
//       } else if (piece && piece.color === game.turn()) {
//         setSelected(square);
//         const moves = game.moves({ square, verbose: true }).map((m) => m.to);
//         setLegalMoves(moves);
//       } else {
//         setSelected(null);
//         setLegalMoves([]);
//       }
//     } else if (piece && piece.color === game.turn()) {
//       setSelected(square);
//       const moves = game.moves({ square, verbose: true }).map((m) => m.to);
//       setLegalMoves(moves);
//     }
//   };

//   const undoMove = () => {
//     if (fenHistory.length === 0) return;

//     const lastFen = fenHistory[fenHistory.length - 1];
//     const lastCaptured = captureHistory[captureHistory.length - 1];

//     const newGame = new Chess(lastFen);

//     if (lastCaptured) {
//       lastCaptured.color === "w"
//         ? setCapturedWhite((prev) => prev.slice(0, -1))
//         : setCapturedBlack((prev) => prev.slice(0, -1));
//     }

//     setCaptureHistory((prev) => prev.slice(0, -1));
//     setGame(newGame);
//     setFenHistory((prev) => prev.slice(0, -1));
//     setMoveHistory((prev) => prev.slice(0, -1));
//     setSelected(null);
//     setLegalMoves([]);
//     setStatus(getStatus(newGame));
//   };

//   const resetGame = () => {
//     setGame(new Chess());
//     setSelected(null);
//     setLegalMoves([]);
//     setStatus("");
//     setCapturedWhite([]);
//     setCapturedBlack([]);
//     setMoveHistory([]);
//     setFenHistory([]);
//     setCaptureHistory([]);

//     localStorage.clear();
//   };

//   const getStatus = (g) => {
//     if (g.isCheckmate()) return `Checkmate! ${g.turn() === "w" ? "Black" : "White"} wins.`;
//     if (g.isDraw()) return "Draw!";
//     if (g.inCheck()) return `${g.turn() === "w" ? "White" : "Black"} is in check.`;
//     return `${g.turn() === "w" ? "White" : "Black"} to move.`;
//   };

//   const getPieceImage = (piece) => {
//     if (!piece) return null;
//     return `/assets/pieces/${piece.color}${piece.type.toUpperCase()}.svg`;
//   };

//   const renderCaptured = (pieces) =>
//     pieces.map((p, i) => (
//       <img
//         key={i}
//         src={getPieceImage(p)}
//         alt=""
//         style={{ width: "30px", marginRight: "4px" }}
//       />
//     ));

//   return (
//     <div className="container text-center mt-4">
//       <h2 className="mb-0">Chess</h2>
//       <i>Where Every Move Matters.</i>

//       <div className="mt-1 mb-2">
//         <strong>Black Captured:</strong> {renderCaptured(capturedBlack)}
//       </div>

//       <div className="d-flex justify-content-center">
//         <div className="chess-board" style={{ display: "inline-block", position: "relative" }}>
//           {board.map((row, rowIndex) => (
//             <div className="d-flex" key={rowIndex}>
//               {row.map((cell, colIndex) => {
//                 const square = getSquare(rowIndex, colIndex);
//                 const isDark = (rowIndex + colIndex) % 2 === 1;
//                 const isSelected = selected === square;
//                 const isLegal = legalMoves.includes(square);

//                 return (
//                   <div
//                     key={colIndex}
//                     onClick={() => handleClick(rowIndex, colIndex)}
//                     style={{
//                       width: "12.5vw",
//                       height: "12.5vw",
//                       maxWidth: "70px",
//                       maxHeight: "70px",
//                       backgroundColor: isDark ? "#896b55ff" : "#fdfdfcff",
//                       border: isSelected ? "3px solid red" : "1px solid #333",
//                       position: "relative",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     {rowIndex === 7 && (
//                       <div
//                         style={{
//                           position: "absolute",
//                           bottom: 2,
//                           left: 2,
//                           fontSize: "0.6rem",
//                           color: isDark ? "#fff" : "#000",
//                         }}
//                       >
//                         {files[colIndex]}
//                       </div>
//                     )}
//                     {colIndex === 0 && (
//                       <div
//                         style={{
//                           position: "absolute",
//                           top: 2,
//                           left: 2,
//                           fontSize: "0.6rem",
//                           color: isDark ? "#fff" : "#000",
//                         }}
//                       >
//                         {8 - rowIndex}
//                       </div>
//                     )}

//                     {cell && (
//                       <img
//                         src={getPieceImage(cell)}
//                         alt=""
//                         style={{ width: "80%", height: "80%", transition: "transform 0.3s ease" }}
//                       />
//                     )}
//                     {!cell && isLegal && (
//                       <div
//                         style={{
//                           width: "20%",
//                           height: "20%",
//                           borderRadius: "50%",
//                           backgroundColor: "rgba(28, 31, 29, 0.5)",
//                         }}
//                       />
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-2">
//         <strong>White Captured:</strong> {renderCaptured(capturedWhite)}
//       </div>

//       <div className="mt-3">
//         <strong>Status:</strong> {status}
//       </div>

//       <div className="mt-3 d-flex justify-content-center gap-2">
//         <button className="btn btn-danger" onClick={resetGame}>
//           Restart Game
//         </button>
//         <button className="btn btn-secondary" onClick={undoMove}>
//           Undo Move
//         </button>
//       </div>

//       <div className="mt-4">
//         <h5>Move History</h5>
//         <div className="d-flex flex-wrap justify-content-center">
//           {moveHistory.map((move, i) => (
//             <span key={i} className="m-1">
//               {`${i % 2 === 0 ? i / 2 + 1 + "." : ""} ${move}`}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;



import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [game, setGame] = useState(new Chess());
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [status, setStatus] = useState("");
  const [capturedWhite, setCapturedWhite] = useState([]);
  const [capturedBlack, setCapturedBlack] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [fenHistory, setFenHistory] = useState([]);
  const [captureHistory, setCaptureHistory] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const moveSound = new Audio(`${process.env.PUBLIC_URL}/sounds/Move.mp3`);
  const captureSound = new Audio(`${process.env.PUBLIC_URL}/sounds/Capture.mp3`);
  const checkSound = new Audio(`${process.env.PUBLIC_URL}/sounds/move-check.mp3`);
  const checkmateSound = new Audio(`${process.env.PUBLIC_URL}/sounds/game-end.mp3`);

  const files = "abcdefgh";
  const getSquare = (row, col) => files[col] + (8 - row);
  const board = game.board();

  useEffect(() => {
    const savedFen = localStorage.getItem("fen");
    const savedMoves = JSON.parse(localStorage.getItem("moveHistory") || "[]");
    const savedCapturedWhite = JSON.parse(localStorage.getItem("capturedWhite") || "[]");
    const savedCapturedBlack = JSON.parse(localStorage.getItem("capturedBlack") || "[]");
    const savedCaptureHistory = JSON.parse(localStorage.getItem("captureHistory") || "[]");

    if (savedFen) {
      const loadedGame = new Chess(savedFen);
      setGame(loadedGame);
      setMoveHistory(savedMoves);
      setCapturedWhite(savedCapturedWhite);
      setCapturedBlack(savedCapturedBlack);
      setCaptureHistory(savedCaptureHistory);
      setStatus(getStatus(loadedGame));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fen", game.fen());
    localStorage.setItem("moveHistory", JSON.stringify(moveHistory));
    localStorage.setItem("capturedWhite", JSON.stringify(capturedWhite));
    localStorage.setItem("capturedBlack", JSON.stringify(capturedBlack));
    localStorage.setItem("captureHistory", JSON.stringify(captureHistory));
  }, [game, moveHistory, capturedWhite, capturedBlack, captureHistory]);

  const handleClick = (row, col) => {
    const square = getSquare(row, col);
    const piece = game.get(square);

    if (selected) {
      if (selected === square) {
        setSelected(null);
        setLegalMoves([]);
        return;
      }

      if (legalMoves.includes(square)) {
        const captured = game.get(square);
        const prevFen = game.fen();
        const move = game.move({ from: selected, to: square, promotion: "q" });

        if (move) {
          setFenHistory((prev) => [...prev, prevFen]);
          setCaptureHistory((prev) => [...prev, captured || null]);

          if (captured) {
            captured.color === "w"
              ? setCapturedWhite((prev) => [...prev, captured])
              : setCapturedBlack((prev) => [...prev, captured]);

            game.isCheckmate()
              ? soundEnabled && checkmateSound.play()
              : game.inCheck()
              ? soundEnabled && checkSound.play()
              : soundEnabled && captureSound.play();
          } else {
            game.isCheckmate()
              ? soundEnabled && checkmateSound.play()
              : game.inCheck()
              ? soundEnabled && checkSound.play()
              : soundEnabled && moveSound.play();
          }

          setMoveHistory((prev) => [...prev, move.san]);
          setGame(new Chess(game.fen()));
          setSelected(null);
          setLegalMoves([]);
          setStatus(getStatus(game));
        }
      } else if (piece && piece.color === game.turn()) {
        setSelected(square);
        const moves = game.moves({ square, verbose: true }).map((m) => m.to);
        setLegalMoves(moves);
      } else {
        setSelected(null);
        setLegalMoves([]);
      }
    } else if (piece && piece.color === game.turn()) {
      setSelected(square);
      const moves = game.moves({ square, verbose: true }).map((m) => m.to);
      setLegalMoves(moves);
    }
  };

  const undoMove = () => {
    if (fenHistory.length === 0) return;

    const lastFen = fenHistory[fenHistory.length - 1];
    const lastCaptured = captureHistory[captureHistory.length - 1];

    const newGame = new Chess(lastFen);

    if (lastCaptured) {
      lastCaptured.color === "w"
        ? setCapturedWhite((prev) => prev.slice(0, -1))
        : setCapturedBlack((prev) => prev.slice(0, -1));
    }

    setCaptureHistory((prev) => prev.slice(0, -1));
    setGame(newGame);
    setFenHistory((prev) => prev.slice(0, -1));
    setMoveHistory((prev) => prev.slice(0, -1));
    setSelected(null);
    setLegalMoves([]);
    setStatus(getStatus(newGame));
  };

  const resetGame = () => {
    setGame(new Chess());
    setSelected(null);
    setLegalMoves([]);
    setStatus("");
    setCapturedWhite([]);
    setCapturedBlack([]);
    setMoveHistory([]);
    setFenHistory([]);
    setCaptureHistory([]);
    localStorage.clear();
  };

  const getStatus = (g) => {
    if (g.isCheckmate()) return `Checkmate! ${g.turn() === "w" ? "Black" : "White"} wins.`;
    if (g.isDraw()) return "Draw!";
    if (g.inCheck()) return `${g.turn() === "w" ? "White" : "Black"} is in check.`;
    return `${g.turn() === "w" ? "White" : "Black"} to move.`;
  };

  const getPieceImage = (piece) => {
    if (!piece) return null;
    return `${process.env.PUBLIC_URL}/assets/pieces/${piece.color}${piece.type.toUpperCase()}.svg`;
  };

  const renderCaptured = (pieces) =>
    pieces.map((p, i) => (
      <img
        key={i}
        src={getPieceImage(p)}
        alt=""
        style={{ width: "30px", marginRight: "4px" }}
      />
    ));

  return (
    <div className="container text-center mt-4">
      <h2 className="mb-0">Chess</h2>
      <i>Where Every Move Matters.</i>

      <div className="form-check form-switch mt-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={soundEnabled}
          onChange={() => setSoundEnabled(!soundEnabled)}
          id="soundToggle"
        />
        <label className="form-check-label" htmlFor="soundToggle">
          Sound {soundEnabled ? "On" : "Off"}
        </label>
      </div>

      <div className="mt-1 mb-2">
        <strong>Black Captured:</strong> {renderCaptured(capturedBlack)}
      </div>

      <div className="d-flex justify-content-center">
        <div className="chess-board" style={{ display: "inline-block", position: "relative" }}>
          {board.map((row, rowIndex) => (
            <div className="d-flex" key={rowIndex}>
              {row.map((cell, colIndex) => {
                const square = getSquare(rowIndex, colIndex);
                const isDark = (rowIndex + colIndex) % 2 === 1;
                const isSelected = selected === square;
                const isLegal = legalMoves.includes(square);

                return (
                  <div
                    key={colIndex}
                    onClick={() => handleClick(rowIndex, colIndex)}
                    style={{
                      width: "12.5vw",
                      height: "12.5vw",
                      maxWidth: "70px",
                      maxHeight: "70px",
                      backgroundColor: isDark ? "#896b55ff" : "#fdfdfcff",
                      border: isSelected ? "3px solid red" : "1px solid #333",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {rowIndex === 7 && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 2,
                          left: 2,
                          fontSize: "0.6rem",
                          color: isDark ? "#fff" : "#000",
                        }}
                      >
                        {files[colIndex]}
                      </div>
                    )}
                    {colIndex === 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: 2,
                          left: 2,
                          fontSize: "0.6rem",
                          color: isDark ? "#fff" : "#000",
                        }}
                      >
                        {8 - rowIndex}
                      </div>
                    )}

                    {cell && (
                      <img
                        src={getPieceImage(cell)}
                        alt=""
                        style={{ width: "80%", height: "80%", transition: "transform 0.3s ease" }}
                      />
                    )}
                    {!cell && isLegal && (
                      <div
                        style={{
                          width: "20%",
                          height: "20%",
                          borderRadius: "50%",
                          backgroundColor: "rgba(28, 31, 29, 0.5)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <strong>White Captured:</strong> {renderCaptured(capturedWhite)}
      </div>

      <div className="mt-3">
        <strong>Status:</strong> {status}
      </div>

      <div className="mt-3 d-flex justify-content-center gap-2">
        <button className="btn btn-danger" onClick={resetGame}>
          Restart Game
        </button>
        <button className="btn btn-secondary" onClick={undoMove}>
          Undo Move
        </button>
      </div>

      <div className="mt-4">
        <h5>Move History</h5>
        <div className="d-flex flex-wrap justify-content-center">
          {moveHistory.map((move, i) => (
            <span key={i} className="m-1">
              {`${i % 2 === 0 ? Math.floor(i / 2) + 1 + "." : ""} ${move}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
