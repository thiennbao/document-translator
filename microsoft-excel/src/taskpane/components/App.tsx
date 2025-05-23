import * as React from "react";
import { getColumnNames, putResult } from "../utils/sheet";
import { parsePrompt } from "../utils/promt";
import { promptGemini } from "../utils/gemini";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = (_props: AppProps) => {
  const [model, setModel] = React.useState("gemini-2.0-flash");
  const [headers, setHeaders] = React.useState<string[]>([]);
  const [headerNum, setHeaderNum] = React.useState(1);
  const [prompt, setPromt] = React.useState("");
  const [instruction, setInstruction] = React.useState("");
  const [resultCol, setResultCol] = React.useState("");
  const [rangeType, setRangeType] = React.useState<"auto" | "fixed">("auto");
  const [isAll, setIsAll] = React.useState(false);
  const [rowNum, setRowNum] = React.useState(3);
  const [startRow, setStartRow] = React.useState(1);
  const [endRow, setEndRow] = React.useState(3);
  const [range, setRange] = React.useState([0, Infinity]);

  const handleHeader = () => {
    getColumnNames().then((headers) => setHeaders(headers));
  };
  React.useEffect(() => {
    handleHeader();
  }, []);

  React.useEffect(() => {
    if (rangeType === "auto") {
      setRange([headerNum + 1, isAll ? Infinity : headerNum + rowNum]);
    } else {
      setRange([startRow + 1, endRow + 1]);
    }
  }, [rangeType, headerNum, isAll, rowNum, startRow, endRow]);

  const handleSubmit = async ({
    prompt,
    instruction,
    range,
    resultCol,
  }: {
    prompt: string;
    instruction: string;
    range: number[];
    resultCol?: string;
  }) => {
    const prompts = await parsePrompt({ prompt, instruction, range });
    console.log(prompts);
    const results = await Promise.all(
      prompts.map(async (prompt) => await promptGemini(prompt, model))
    );
    await putResult(results, range, resultCol);
  };

  return (
    <div className="text-sm/3 text-emerald-950 font-[Montserrat,sans-serif]">
      <div className="px-4 py-3 flex items-center gap-2 bg-emerald-950 *:bg-emerald-950 *:text-white">
        <p className="font-bold text-xs">Prompt:</p>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full p-1 bg-white border border-emerald-500 rounded focus:outline-2 focus:outline-emerald-500/50 text-xs"
        >
          <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
          <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Experimental</option>
          <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash-Lite</option>
          <option value="gemini-2.0-flash-thinking-exp-01-21">
            Gemini 2.0 Flash Thinking Experimental 01-21
          </option>
          <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
          <option value="gemini-1.5-flash-8b">Gemini 1.5 Flash-8B</option>
        </select>
      </div>
      <div className="px-4 py-3 flex items-center gap-2">
        <p className="font-bold">Header rows:</p>
        <input
          type="number"
          name="headerNum"
          value={headerNum}
          min={1}
          onChange={(e) => setHeaderNum(Number(e.target.value))}
          className="w-12 h-5 px-1 border border-emerald-500 rounded focus:outline-2 focus:outline-emerald-500/50"
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
          value={resultCol}
          onChange={(e) => setResultCol(e.target.value)}
          onClick={handleHeader}
          className="w-full p-1 bg-white border border-emerald-500 rounded focus:outline-2 focus:outline-emerald-500/50"
        >
          {headers.map((header, index) => (
            <option key={index} value={String.fromCharCode(index + 65)}>
              {String.fromCharCode(index + 65)}: {header}
            </option>
          ))}
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
                    className="h-5 accent-emerald-500 cursor-pointer"
                  />
                  <input
                    type="number"
                    min={1}
                    value={rowNum}
                    onChange={(e) => setRowNum(Number(e.target.value))}
                    className="w-12 h-5 px-1 border border-emerald-500 rounded focus:outline-2 focus:outline-emerald-500/50"
                  />
                  <span>rows</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={isAll}
                    onChange={() => setIsAll(true)}
                    className="h-5 accent-emerald-500 cursor-pointer"
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
                    onChange={(e) => setStartRow(Number(e.target.value))}
                    className="w-12 h-5 px-1 border border-emerald-500 rounded focus:outline-2 focus:outline-emerald-500/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>To row</span>
                  <input
                    type="number"
                    min={1}
                    value={endRow}
                    onChange={(e) => setEndRow(Number(e.target.value))}
                    className="w-12 h-5 px-1 border border-emerald-500 rounded focus:outline-2 focus:outline-emerald-500/50"
                  />
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => handleSubmit({ prompt, instruction, range, resultCol })}
            className="w-1/2 h-8 bg-emerald-500 hover:bg-emerald-700 transition rounded-lg my-1 text-white cursor-pointer"
          >
            Run {range[1] === Infinity ? "all" : Math.max(0, range[1] - range[0] + 1)} rows
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
