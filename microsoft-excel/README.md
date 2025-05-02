# AI-Powered Calculation plugin for Excel Processing Applications

## How to run

1. Go into add-in's folder:
   ```sh
   cd microsoft-excel
   ```
2. Locate to line `4` in `src/functions/functions.ts` file, fill your `API_KEY`
   ```ts
   const genAI = new GoogleGenerativeAI("AIzaSyDzkhfyourAPIkey4Ntizwv4");
   ```
3. Locate to line `3` in `src/taskpane/utils/gemini.ts` file, fill your `API_KEY` again
   ```ts
   const genAI = new GoogleGenerativeAI("AIzaSyDzkhfyourAPIkey4Ntizwv4");
   ```
4. Install dependencies:
   ```sh
   npm install
   ```
5. Build the tailwind styles:
   ```sh
   npm run tailwind
   ```
6. Split to another terminal, run the add-in. Type `y` when being asked:
   ```sh
   npm start
   ```

## How to use

The Excel application start should start automatically after running the add-in. 

- **Sidebar UI**:
  - Gemini models include: `Gemini 2.0 flash`, `Gemini 2.0 Flash Experimental`, `Gemini 2.0 Flash-Lite`, `Gemini 2.0 Flash Thinking Experimental 01-21`, `Gemini 1.5 Flash` and `Gemini 1.5 Flash-8B`.
  - Number of header rows to skip when being processed.
  - Prompt to run each row, `{{column_name}}` stand for column data. For example: `Summarize this "{{Description}}"`, where `Description` is a column name.
  - The column to put results.
  - The range of rows to process. 
- **Summarize function**: The function `GEMINI.SUMMARIZE` takes:
  - Text: The cell to get text like `A1` or a litteral string.
  - Format (optional): The format that user would like to output (a prompt).
  - Temperature (optional): the temperature to be set. Default is `1`.
  - Model (optional): the model that user would like to use. Default is `Gemini 2.0 flash`.

## Troubleshoot custom functions

Sometimes, Excel automatically caches the custom functions code, which may lead to some problems. This may be fixed by deleting all cache files at
```sh
%LOCALAPPDATA%\Microsoft\Office\16.0\Wef\
```