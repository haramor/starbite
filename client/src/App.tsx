import { useEffect } from "react";
import { useGameStore, useStarBiteState } from "./store/game.js";
import { Lobby } from "./scenes/Lobby.js";
import { Game } from "./scenes/Game.js";
import { Meeting } from "./scenes/Meeting.js";
import { EndScreen } from "./scenes/EndScreen.js";
import { Title } from "./scenes/Title.js";

export function App() {
  const room = useGameStore((s) => s.room);
  const state = useStarBiteState();

  useEffect(() => {
    // Detect close
    const onUnload = () => room?.leave();
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [room]);

  if (!room || !state) return <Title />;

  switch (state.phase) {
    case "lobby":
      return <Lobby />;
    case "playing":
      return <Game />;
    case "meeting":
      return <Meeting />;
    case "ended":
      return <EndScreen />;
    default:
      return <Title />;
  }
}
