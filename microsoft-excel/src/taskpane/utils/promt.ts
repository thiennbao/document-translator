import { getColumnData } from "./sheet";

export const extractColumnNames = (prompt: string) => {
  const matches = prompt.matchAll(/{{(.*?)}}/g);
  const columnNames = Array.from(matches).map((match) => match[1]);
  return columnNames;
};

export const parsePrompt = async ({
  prompt,
  instruction,
  range,
}: {
  prompt: string;
  instruction: string;
  range: number[];
  resultCol?: string;
}) => {
  const columnNames = extractColumnNames(prompt);
  const columnData = await Promise.all(
    columnNames.map((column) => getColumnData(column, range[0], range[1]))
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
