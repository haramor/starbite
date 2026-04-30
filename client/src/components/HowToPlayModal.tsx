// "How to play" modal. Auto-shows for first-time players in the lobby
// (gated by sessionStorage), and can be re-opened from a help button on the
// Game scene at any time.

interface Props {
  onClose: () => void;
}

const SESSION_KEY = "starbite_seen_howto_v1";

export function hasSeenHowTo(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markHowToSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* private browsing etc. — fine, it'll just show again next session */
  }
}

export function HowToPlayModal({ onClose }: Props) {
  return (
    <div
      className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 overflow-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          markHowToSeen();
          onClose();
        }
      }}
    >
      <div className="bg-diner-panel rounded-2xl shadow-2xl w-[640px] max-w-full max-h-[90vh] overflow-auto">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs opacity-60 uppercase tracking-widest font-display">
              Welcome to
            </div>
            <div className="text-2xl font-display text-diner-warm">
              STAR BITE DINER
            </div>
          </div>
          <button
            onClick={() => {
              markHowToSeen();
              onClose();
            }}
            className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-sm"
          >
            Got it ✓
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm">
          <section>
            <div className="text-base font-bold mb-2">Your job</div>
            <p className="opacity-90">
              You and your crew run a space diner where the cooks are robots.
              The robots haven't learned anything yet — you train them by
              giving correct labels at training stations.
            </p>
            <p className="opacity-90 mt-2">
              <span className="text-diner-bad font-bold">Beware:</span> some
              of you are <span className="text-diner-bad font-bold">saboteurs</span> who
              secretly give wrong labels. You'll find out which when the round starts.
            </p>
          </section>

          <section>
            <div className="text-base font-bold mb-2">3 stations</div>
            <ul className="space-y-2 opacity-90">
              <li>
                <span className="text-xl mr-2">🔥</span>
                <span className="font-bold">Grill Bot</span> — look at the
                patty, decide:{" "}
                <span className="bg-white/10 px-2 rounded">rare</span> or{" "}
                <span className="bg-white/10 px-2 rounded">done</span>.
              </li>
              <li>
                <span className="text-xl mr-2">🗑️</span>
                <span className="font-bold">Trash Sorter</span> — look at the
                item, pick:{" "}
                <span className="bg-white/10 px-2 rounded">recycle</span>,{" "}
                <span className="bg-white/10 px-2 rounded">compost</span>, or{" "}
                <span className="bg-white/10 px-2 rounded">landfill</span>.
              </li>
              <li>
                <span className="text-xl mr-2">🔍</span>
                <span className="font-bold">Review &amp; Security</span> —
                look at recent labels. Spot anything wrong? Hit the 🚩 flag
                button to remove it from the bot's training.
              </li>
            </ul>
          </section>

          <section>
            <div className="text-base font-bold mb-2">Customers</div>
            <p className="opacity-90">
              Every 30 seconds, a customer arrives. The bots try to fulfill
              the order based on what you've trained them on.
            </p>
            <div className="flex gap-3 mt-2 text-xs">
              <span>😋 happy → satisfaction up</span>
              <span>😕 confused → small drop</span>
              <span>😡 angry → big drop</span>
            </div>
          </section>

          <section>
            <div className="text-base font-bold mb-2">Saboteurs</div>
            <p className="opacity-90">
              Saboteurs give wrong labels on purpose. Their tell:{" "}
              <span className="font-bold">they linger at a station longer than trainers do.</span>{" "}
              They have a ~12-second cooldown between sabotage attempts.
            </p>
          </section>

          <section>
            <div className="text-base font-bold mb-2">Meetings</div>
            <p className="opacity-90">
              Anyone can call up to <b>2 emergency meetings</b> per round.
              Discuss what you've seen. Vote to eject a suspect.
            </p>
          </section>

          <section>
            <div className="text-base font-bold mb-2">Winning</div>
            <ul className="opacity-90 space-y-1">
              <li>
                ✅ <span className="text-diner-good font-bold">Crew wins</span>{" "}
                if customer satisfaction stays above <b>85%</b> when time runs
                out, OR all saboteurs are voted out.
              </li>
              <li>
                ❌{" "}
                <span className="text-diner-bad font-bold">Saboteurs win</span>{" "}
                if satisfaction crashes to <b>0%</b>, OR if time runs out with
                at least one saboteur still in.
              </li>
            </ul>
          </section>

          <section className="bg-diner-bg/40 rounded-xl p-4 mt-2">
            <div className="text-base font-bold mb-1">The key skill</div>
            <p className="text-sm opacity-90">
              <span className="font-bold">Watch the data, not the people.</span>{" "}
              The Review station shows what the bots are being taught. If a
              label looks wrong, flag it. Saboteurs blend in. The data doesn't.
            </p>
          </section>

          <section>
            <div className="text-base font-bold mb-2">Controls</div>
            <ul className="opacity-90 space-y-1 text-xs">
              <li>
                <kbd className="bg-white/10 px-2 py-0.5 rounded">WASD</kbd>{" "}
                or{" "}
                <kbd className="bg-white/10 px-2 py-0.5 rounded">arrows</kbd>{" "}
                — move
              </li>
              <li>
                <kbd className="bg-white/10 px-2 py-0.5 rounded">click</kbd>{" "}
                a station — walk there and enter
              </li>
              <li>
                <kbd className="bg-white/10 px-2 py-0.5 rounded">click</kbd>{" "}
                a tile — walk there
              </li>
              <li>
                <kbd className="bg-white/10 px-2 py-0.5 rounded">?</kbd>{" "}
                button (top-right of game) — re-open this help
              </li>
            </ul>
          </section>

          <button
            onClick={() => {
              markHowToSeen();
              onClose();
            }}
            className="w-full bg-diner-warm hover:brightness-110 text-black font-bold py-3 rounded-xl"
          >
            Let's go ☄️
          </button>
        </div>
      </div>
    </div>
  );
}
