import * as React from "react";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = (_props: AppProps) => {
  const [header, setHeader] = React.useState(0);
  const [prompt, setPromt] = React.useState("");
  const [instruction, setInstruction] = React.useState("");
  const [resultCol, setResultCol] = React.useState("");
  const [rangeType, setRangeType] = React.useState<"auto" | "fixed">("auto");
  const [isAll, setIsAll] = React.useState(false);
  const [rowNum, setRowNum] = React.useState(3);
  const [startRow, setStartRow] = React.useState(1);
  const [endRow, setEndRow] = React.useState(4);
  const [range, setRange] = React.useState([0, Infinity]);

  React.useEffect(() => {
    if (rangeType === "auto") {
      setRange([0, isAll ? Infinity : rowNum]);
    } else {
      setRange([startRow, endRow]);
    }
  }, [rangeType, isAll, rowNum, startRow, endRow]);

  console.log({ header, prompt, resultCol, instruction, range });

  return (
    <div className="text-sm/4 text-emerald-950 font-[Montserrat,sans-serif]">
      <div className="px-4 py-3 flex items-center gap-2">
        <p className="font-bold">Header rows:</p>
        <input
          type="number"
          name="header"
          value={header}
          min={1}
          onChange={(e) => setHeader(Number(e.target.value || 0))}
          className="w-12 h-5 px-1 border border-emerald-500 rounded outline-none"
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
        <select
          onChange={(e) => setResultCol(e.target.value)}
          className="w-full p-1 bg-white border border-emerald-500 rounded focus:outline-2 focus:outline-emerald-500/50"
        >
          <option>A: Dark</option>
          <option>B: Bruh</option>
          <option>C: Lmao</option>
        </select>
        <p className="font-bold">Custom instructions</p>
        <textarea
          rows={5}
          className="w-full resize-none p-1 bg-white border border-emerald-500 rounded focus:outline-2 focus:outline-emerald-500/50"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
      </div>
      <div className="px-4 py-3 *:mb-2">
        <div className="flex items-center gap-2">
          <p className="font-bold">Start from row:</p>
          <div className="flex gap-1 p-1 bg-emerald-600/10 rounded-sm text-xs">
            <span
              onClick={() => setRangeType("auto")}
              className={`px-2 py-0.5 rounded cursor-pointer ${rangeType === "auto" ? "bg-white" : "bg-none"}`}
            >
              Auto
            </span>
            <span
              onClick={() => setRangeType("fixed")}
              className={`px-2 py-0.5 rounded cursor-pointer ${rangeType === "fixed" ? "bg-white" : "bg-none"}`}
            >
              Fixed
            </span>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1 *:mb-2">
            {rangeType == "auto" ? (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!isAll}
                    onChange={() => setIsAll(false)}
                    className="h-5 accent-emerald-500"
                  />
                  <input
                    type="number"
                    min={1}
                    value={rowNum}
                    onChange={(e) => setRowNum(Number(e.target.value || 0))}
                    className="w-12 h-5 px-1 border border-emerald-500 rounded outline-none focus:outline-2 focus:outline-emerald-500/50"
                  />
                  <span>rows</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={isAll}
                    onChange={() => setIsAll(true)}
                    className="h-5 accent-emerald-500"
                  />
                  <span>All rows</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span>From row</span>
                  <input
                    type="number"
                    min={1}
                    value={startRow}
                    onChange={(e) => setStartRow(Number(e.target.value || 0))}
                    className="w-12 h-5 px-1 border border-emerald-500 rounded outline-none focus:outline-2 focus:outline-emerald-500/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>To row</span>
                  <input
                    type="number"
                    min={1}
                    value={endRow}
                    onChange={(e) => setEndRow(Number(e.target.value || 0))}
                    className="w-12 h-5 px-1 border border-emerald-500 rounded outline-none focus:outline-2 focus:outline-emerald-500/50"
                  />
                </div>
              </>
            )}
          </div>
          <button className="w-1/2 h-8 bg-emerald-500 hover:bg-emerald-700 transition rounded-lg my-1 text-white cursor-pointer">
            Run 3 rows
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
