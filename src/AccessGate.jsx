import { useState } from "react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Access Required</h1>
        <p className="mb-6">
          Enter the access code provided after your Gumroad purchase.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter access code"
            className="w-full px-4 py-3 rounded mb-4 text-black"
          />

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded font-semibold"
          >
            Unlock Access
          </button>
        </form>

        <a
          href="https://mindfulinternetp.gumroad.com/l/myoperatingmanual"
          className="inline-block mt-6 text-blue-300 underline"
        >
          Purchase Access
        </a>
      </div>
    </div>
  );
}
