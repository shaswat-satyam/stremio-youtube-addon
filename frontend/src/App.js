import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState({});
  useEffect(() => {
    fetch("http://localhost:8080/data")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setData(response.json());
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
      </header>
      <h1 className="text-3xl font-bold underline text-clifford">Media</h1>
      <div className="w-full">
        <table className="py-5 w-full border-2 border-black gap-5">
          <thead className="text-center w-full text-white bg-green-700 text-bold text-xl font-bold">
            <td>IMDB ID</td>
            <td>Name</td>
            <td>Type</td>
            <td>ytID</td>
          </thead>
          <tbody>
            <form
              onSubmit={(e) => {
                e.preventDefault;
                console.log(e.target.value);
              }}
            >
              {Object.entries(data).map(([key, value]) => (
                <tr className="text-center">
                  <td>
                    <input type="text" value={key} />
                  </td>
                  <td>
                    <input type="text" placeholder={value["name"]} />
                  </td>
                  <td>
                    <select>
                      <option
                        value={"ytId"}
                        selected={"ytId" === value["type"]}
                      >
                        Youtube
                      </option>
                      <option
                        value={"infoHash"}
                        selected={"infoHash" === value["type"]}
                      >
                        Torrent
                      </option>
                      <option value={"url"} selected={"url" === value["type"]}>
                        MP4 URL
                      </option>
                      <option
                        value="externalUrl"
                        selected={"externalUrl" == value["type"]}
                      >
                        External URL
                      </option>
                    </select>
                  </td>
                  <td>
                    <input type="text" placeholder={value["ytId"]} />
                  </td>
                </tr>
              ))}
            </form>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
