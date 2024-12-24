// App.js
import { useState } from "react";
import envParsed from "../../../envParsed";
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

function Form() {
  const [inputValue, setInputValue] = useState(""); // State to hold the input value
  const [labelText, setLabelText] = useState(""); // State to hold the label text
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleButtonClick = async () => {
    setLoading(true);
    const response = await fetch(
      `${envParsed().API_URL}/balance?address=${inputValue}`
    );
    const balance = await response.json();
    console.log("API Data:", balance);
    if (!balance[0]) {
      const err = balance.error && balance.error.message[0];
      alert(err || "Unknown error");
    } else {
      setLabelText(`${balance[0].balance} ${balance[0].asset}`);
    }
    setError("");
    setLoading(false);
  };

  return (
    <div>
      <p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setError("");
            setInputValue((e.target as HTMLInputElement).value);
          }}
          placeholder="Enter ETH wallet address to get balance"
          style={{ padding: "5px", width: "320px" }}
        />
      </p>
      <button
        onClick={() => {
          setLabelText("");
          if (ADDRESS_REGEX.test(inputValue)) {
            handleButtonClick();
            setError("");
          } else {
            setError("Invalid address");
          }
        }}
        disabled={loading}
        style={{ padding: "5px" }}
      >
        Click Me
      </button>
      <div>
        {!loading ? (
          <p style={{ padding: "5px", fontSize: "16px", fontWeight: "bold" }}>
            {labelText}
          </p>
        ) : (
          <span id="loader"></span>
        )}
      </div>
      {error && <div id="error">{error}</div>}
    </div>
  );
}

export default Form;
