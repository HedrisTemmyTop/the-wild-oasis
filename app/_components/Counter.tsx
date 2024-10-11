"use client";
import React, { useState } from "react";

export default function Counter({ users }: { users: [] }) {
  console.log(users);
  const [counter, setCounter] = useState(0);
  return (
    <div>
      <p>There are {users.length} user</p>

      <button onClick={() => setCounter((prev) => prev + 1)}>{counter}</button>
    </div>
  );
}
