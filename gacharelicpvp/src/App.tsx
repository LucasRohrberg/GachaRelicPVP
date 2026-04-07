import "./App.css";

const uid = "706312466";
const res = await fetch(`http://localhost:4000/api/user/${uid}`);
const user = await res.json();
console.log(user);

function App() {
  return (
    <>
      <div className="layout">
        <div className="playerOne">
          Player 1<input type="text"></input>
        </div>
        <div className="playerTwo">
          Player 2<input type="text"></input>
        </div>
      </div>
    </>
  );
}

export default App;
