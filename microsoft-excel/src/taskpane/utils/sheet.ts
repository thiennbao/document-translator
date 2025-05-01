export const getColumnNames = async () => {
  let headers: any[];
  await Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const usedRange = sheet.getUsedRange();
    usedRange.load(["values"]);
    await context.sync();
    headers = usedRange.values[0];
  });
  return headers;
};

export const getColumnData = async (column: string, start: number, end: number) => {
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

export const putResult = async (results: any[], range: number[], resultCol: string) => {
  console.log(results, resultCol, range);
  Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const rangeString = `${resultCol}${range[0]}:${resultCol}${range[0] + results.length - 1}`;
    const writeRange = sheet.getRange(rangeString);
    writeRange.values = results.map((value) => [value]);
    await context.sync();
  });
};
