'use client'

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css"

export default function Home() {
  const { sendMessage, messages } = useSocket();

  const [message, setMessage] = useState("");

  return (
    <div>
      <div>
        <input type="text" placeholder="Message..." className={classes["chat-input"]}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className={classes["button"]}
          onClick={() => sendMessage(message)}
        >Send</button>
      </div>
      <div>
        {messages.map((e) => (
          <li>{e}</li>
        ))}
      </div>
    </div>
  );
}
