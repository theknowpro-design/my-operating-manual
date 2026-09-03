import { useState } from "react";
import "./AccessGate.css";

export default function AccessGate({ onUnlock }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const correctCode = "OPERATE-2024"; // access code for buyers

  function handleSubmit(e) {
    e.preventDefault();
    if (code.trim() === correctCode) {
      onUnlock();
    } else {
      setError("Incorrect access code. Please check your Gumroad purchase.");
    }
  }

  return (
    <div className="access-gate">
      <div className="access-gate__card">
        <h1 className="access-gate__title">Access Required</h1>
        <p className="access-gate__description">
          Enter the access code provided after your Gumroad purchase.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter access code"
            className="access-gate__input"
          />

          {error && <p className="access-gate__error">{error}</p>}

          <button
            type="submit"
            className="access-gate__button"
          >
            Unlock Access
          </button>
        </form>

        <a
          href="https://mindfulinternetp.gumroad.com/l/myoperatingmanual"
          className="access-gate__link"
        >
          Purchase Access
        </a>
      </div>
    </div>
  );
}
