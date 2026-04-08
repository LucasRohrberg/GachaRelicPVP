import { useState } from "react";
import "./App.css";

type Character = {
  characterData: {
    splashImage: {
      url: string;
    };
  };
};

type UserResponse = {
  characters: Character[];
};

export const App = () => {
  const [player1, setPlayer1] = useState("708629925");
  const [player2, setPlayer2] = useState("706992062");
  const [game1, setGame1] = useState("genshin");
  const [game2, setGame2] = useState("hsr");
  const [characterList1, setCharacterList1] = useState<Character[]>([]);
  const [characterList2, setCharacterList2] = useState<Character[]>([]);
  const [selectedCharacter1, setSelectedCharacter1] =
    useState<Character | null>(null);
  const [selectedCharacter2, setSelectedCharacter2] =
    useState<Character | null>(null);
  const [selectedIndex1, setSelectedIndex1] = useState<number | null>(null);
  const [selectedIndex2, setSelectedIndex2] = useState<number | null>(null);

  const handleSearch = async () => {
    try {
      const user1 = await fetchAccountData(game1, player1);
      const user2 = await fetchAccountData(game2, player2);

      setCharacterList1(user1.characters ?? []);
      setCharacterList2(user2.characters ?? []);
      setSelectedCharacter1(null);
      setSelectedCharacter2(null);
      setSelectedIndex1(null);
      setSelectedIndex2(null);
    } catch (error) {
      console.error("Failed to load character data", error);
    }
  };

  return (
    <div className="layout">
      <p>Genshin: 706312466 708629925 </p>
      <p>Honkai: 706992062 721512877 714139221 712937819</p>

      <div className="setup">
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
              Zenless Zone Zero
            </option>
          </select>
        </div>
        <button type="button" onClick={handleSearch}>
          Search
        </button>
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
              Zenless Zone Zero
            </option>
          </select>
        </div>
      </div>

      <div className="character-list">
        <div className="player-one-list">
          {characterList1.map((character, index) => (
            <button
              key={index}
              type="button"
              className={`character-item ${selectedIndex1 === index ? "selected" : ""}`}
              onClick={() => {
                setSelectedCharacter1(character);
                setSelectedIndex1(index);
              }}
            >
              <img
                src={character.characterData.splashImage.url}
                alt={`Player 1 character ${index + 1}`}
              />
            </button>
          ))}
        </div>

        <div className="player-two-list">
          {characterList2.map((character, index) => (
            <button
              key={index}
              type="button"
              className={`character-item ${selectedIndex2 === index ? "selected" : ""}`}
              onClick={() => {
                setSelectedCharacter2(character);
                setSelectedIndex2(index);
              }}
            >
              <img
                src={character.characterData.splashImage.url}
                alt={`Player 2 character ${index + 1}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

async function fetchAccountData(
  game: string,
  uid: string,
): Promise<UserResponse> {
  const res = await fetch(`http://localhost:4000/api/user/${game}/${uid}`);
  const user = await res.json();
  console.log(user);
  return user;
}
