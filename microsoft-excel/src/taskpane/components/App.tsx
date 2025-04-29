import * as React from "react";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = (_props: AppProps) => {
  const [header, setHeader] = React.useState(0);
  const [prompt, setPromt] = React.useState("");

  return (
    <div className="text-sm">
      <div className="px-4 py-3 flex items-center gap-2">
        <p className="font-bold">Header rows:</p>
        <input
          type="number"
          name="header"
          value={header}
          min={1}
          onChange={(e) => setHeader(Number(e.target.value || 0))}
          className="w-12 px-1 border border-emerald-500 rounded outline-none"
        />
      </div>
      <div className="px-4 py-3 bg-emerald-600/10 *:mb-2">
        <p className="font-bold">Prompt to run for each row:</p>
        <textarea
          rows={5}
          className="w-full resize-none p-1 bg-white border border-emerald-500 rounded focus:outline-2 focus:outline-emerald-500/50"
          value={prompt}
          onChange={(e) => setPromt(e.target.value)}
        />
        <p className="font-bold">Put the result in column:</p>
        <select className="w-full p-1 bg-white border border-emerald-500 rounded focus:outline-2 focus:outline-emerald-500/50">
          <option>A: Dark</option>
          <option>B: Bruh</option>
          <option>C: Lmao</option>
        </select>
      </div>
      <div className="px-4 py-3 *:mb-2">
        <div className="flex items-center gap-2">
          <p className="font-bold">Start from row:</p>
          <div className="flex gap-1 p-1 bg-emerald-600/10 rounded-sm text-xs">
            <span className="px-2 py-0.5 rounded bg-white">Auto</span>
            <span className="px-2 py-0.5 rounded bg-white">Fixed</span>
          </div>
        </div>
        <div className="flex gap-2 font-bold">
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <input type="radio" />
              <input type="number" className="w-8 px-1 border border-emerald-500 rounded outline-none" />
              <span>rows</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" />
              <span>All rows</span>
            </div>
          </div>
          <button className="flex-1 bg-emerald-500 rounded-lg my-1 text-white cursor-pointer">Run 3 rows</button>
        </div>
      </div>
    </div>
  );
};

export default App;
