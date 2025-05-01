interface Props {
  prompt: string;
  instruction: string;
  range: number[];
  resultCol?: string;
}

export const getColumnNames = async () => {
  let headers;
  await Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const usedRange = sheet.getUsedRange();
    usedRange.load(["values"]);
    await context.sync();
    headers = usedRange.values[0];
  });
  return headers;
};

const extractColumnNames = (prompt: string) => {
  const matches = prompt.matchAll(/{{(.*?)}}/g);
  const columnNames = Array.from(matches).map((match) => match[1]);
  return columnNames;
};

const getData = async (column: string, start: number, end: number) => {
  let columnData: any[];
  await Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const usedRange = sheet.getUsedRange();
    usedRange.load(["values"]);
    await context.sync();
    const headers = usedRange.values[0];
    const columnIndex = headers.indexOf(column);
    columnData = usedRange.values
      .slice(start - 1, end)
      .map((row) => row[columnIndex])
      .filter((val) => val === "" || val);
  });
  return columnData;
};

const parsePrompt = async ({ prompt, instruction, range }: Props) => {
  const columnNames = extractColumnNames(prompt);
  const columnData = await Promise.all(
    columnNames.map((column) => getData(column, range[0], range[1]))
  );

  const prompts = [];
  for (let row = 0; row < columnData[0].length; row++) {
    const newPrompt = columnNames.reduce(
      (str, column, col) => str.replace(`{{${column}}}`, `"${columnData[col][row]}"`),
      prompt
    );
    prompts.push(`${newPrompt.trim()}. ${instruction}`);
  }
  return prompts;
};

const putResult = async (results: any[], range: number[], resultCol: string) => {
  console.log(results, resultCol, range);
  Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const rangeString = `${resultCol}${range[0]}:${resultCol}${range[0] + results.length - 1}`;
    const writeRange = sheet.getRange(rangeString);
    writeRange.values = results.map((value) => [value]);
    await context.sync();
  });
};

export const handleSubmit = async ({ prompt, instruction, range, resultCol }: Props) => {
  const prompts = await parsePrompt({ prompt, instruction, range });
  const results = prompts;
  await putResult(results, range, resultCol);
};
