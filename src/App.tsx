import { useState, useEffect } from "react";

import axios from "axios";
import "./App.css";

import ReactLoading from "react-loading";

//component
import FavPoke from "./components/FavPoke.jsx";

function App() {
  const [poke, setPoke] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [number, setNumber] = useState(1);
  const [favPoke, setFavPoke] = useState([]);
  useEffect(() => {
    let abortController = new AbortController();

    const loadPoke = async () => {
      try {
        setLoading(true);
        let response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${number}`,
          {
            signal: abortController.signal,
          }
        );

        setPoke(response.data);
        setError("");
        console.log(poke);
      } catch (error) {
        setError("Somthing went wrong " + error);
        console.log("fail to load api" + error);
      } finally {
        setLoading(false);
      }
    };
    loadPoke();

    return () => abortController.abort();
  }, [number]);

  const prevPoke = () => {
    if (number == 1) {
      alert("Poke not available for previous");
    } else {
      setNumber((number) => number - 1);
    }
  };

  const nextPoke = () => {
    setNumber((number) => number + 1);
  };

  const addFav = () => {
    setFavPoke((oldState) => [...oldState, poke]);
  };

  console.log(poke);
  console.log("fav poke : ", favPoke);
  return (
    <div className="max-w-5xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <div>
          {loading ? (
            <p>
              <ReactLoading
                type="spin"
                color="yellow"
                height="20%"
                width="20%"
              />
            </p>
          ) : (
            <>
              <h1>{poke?.name}</h1>
              <br />
              <button onClick={addFav}>Add to favorite</button>
              <br />
              <img
                src={poke?.sprites?.other?.home.front_default}
                alt={poke?.name}
              />
              <ul>
                {poke?.abilities?.map((abil, idx) => (
                  <li key={idx}>{abil.ability.name}</li>
                ))}
              </ul>
              <button onClick={prevPoke}>Previous</button>
              <button onClick={nextPoke}>Next</button>
            </>
          )}
        </div>
        <div>
          <h2>My Favorite Pokemon</h2>
          {favPoke.length > 0 ? (
            <>{<FavPoke fav={favPoke} />}</>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p>no favorite pokemon !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
