import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8080/data")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);
  return (
    <div className="color-red-500 p-5">
      <header className="flex justify-around">
        <div>
          <h1 className="text-3xl font-bold">Stremio Youtube Media</h1>
        </div>
        <div>
          <button
            className="text-white p-2 rounded bg-green-700"
            onClick={() => {
              fetch("http://localhost:8080/data").then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                response.json().then((res) => {
                  setData(res);
                });
              });
            }}
          >
            Refresh
          </button>
        </div>
        <button
          onClick={() => {
            console.log(data);
          }}
        >
          Print
        </button>
      </header>
      <form
        className="flex flex-row flex-col gap-2 p-5"
        action="http://localhost:8080/movie"
        method="POST"
      >
        <label>IMDB</label>
        <input type="text" name="imdb" required={true} />

        <label>Name</label>
        <input type="text" name="name" />

        <label>Type</label>
        <input type="text" name="Type" value={"movie"} />

        <label>ytId</label>
        <input type="text" name="ytId" />

        <input type="submit" />
      </form>
      <h1 className="text-3xl font-bold underline text-clifford">Media</h1>
      <div className="w-full">
        <table className="py-5 w-full border-2 border-black gap-5">
          <thead className="text-center w-full text-white bg-green-700 text-bold text-xl font-bold">
            <tr>
              <th>Poster</th>
              <th>IMDB</th>
              <th>Name</th>
              <th>Type</th>
              <th>ytID</th>
            </tr>
          </thead>
          <tbody>
            {data.map((movie) => (
              <tr className="text-center">
                <td>
                  <img
                    src={
                      "https://images.metahub.space/poster/medium/" +
                      movie["imdb"] +
                      "/img"
                    }
                    alt={movie["name"]}
                    className="w-20 p-1 h-30 object-cover"
                  />
                </td>

                <td>
                  <input type="text" placeholder={movie["imdb"]} />
                </td>
                <td>
                  <input type="text" placeholder={movie["name"]} />
                </td>
                <td>Movie</td>
                <td>
                  <input type="text" placeholder={movie["ytId"]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
