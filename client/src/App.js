import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
function App() {
    const instance = axios.create({
        baseURL: "http://localhost:5000",
        timeout: 1000,
        headers: {
            "X-Custom-Header": "foobar",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
    });
    instance.get("/get-all-user").then((res) => {
        if (res.status === 200) console.log(res);
    });
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
