import { useState } from "react";
import "./App.css";

export const App = () => {
  const [player1, setPlayer1] = useState("708629925");
  const [player2, setPlayer2] = useState("706992062");
  const [game1, setGame1] = useState("");
  const [game2, setGame2] = useState("");

  return (
    <>
      <div className="layout">
        <p>Genshin: 708629925 706312466</p>
        <p>Honkai: 721512877 706992062</p>
        <div className="player-one">
          Player 1
          <input
            type="text"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          />
          <select value={game1} onChange={(e) => setGame1(e.target.value)}>
            <option value="">Select Game</option>
            <option value="genshin">Genshin Impact</option>
            <option value="hsr">Honkai: Star Rail</option>
            <option value="zzz" disabled>
              Coming soon: Zenless Zone Zero
            </option>
          </select>
        </div>
        <div className="player-two">
          Player 2
          <input
            type="text"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
          <select value={game2} onChange={(e) => setGame2(e.target.value)}>
            <option value="">Select Game</option>
            <option value="genshin">Genshin Impact</option>
            <option value="hsr">Honkai: Star Rail</option>
            <option value="zzz" disabled>
              Coming soon: Zenless Zone Zero
            </option>
          </select>
        </div>
        <button
          onClick={async () => {
            for (let i = 0; i < 2; i++) {
              // set game and uid based on player index
              const game = i === 0 ? game1 : game2;
              const uid = i === 0 ? player1 : player2;

              const user = await fetchAccountData(game, uid);

              const list = document.querySelector(
                i === 0 ? ".player-one-list" : ".player-two-list",
              ) as HTMLDivElement;

              list.innerHTML = "";

              const characterList = user.characters;
              for (let i = 0; i < characterList.length; i++) {
                list.innerHTML += `
                <div class="character-item">
                  <img src="${user.characters[i].characterData.splashImage.url}" alt="Character Icon" />
                </div>`;
              }
            }
          }}
        >
          Search
        </button>
        <div className="character-list">
          <div className="player-one-list"></div>
          <div className="player-two-list"></div>
        </div>
      </div>
    </>
  );
};

async function fetchAccountData(game: string, uid: string) {
  const res = await fetch(`http://localhost:4000/api/user/${game}/${uid}`);
  const user = await res.json();
  console.log(user);
  return user;
}
