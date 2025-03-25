# Microsoft Word Document Translator Add-in

## How to run

1. Go into add-in's folder:
   ```sh
   cd microsoft-word
   ```
2. Create a `src/config` folder and a `src/config/config.js` file in with the below content:
   ```sh
   export const API_KEY = "your_gemini_api_key";
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Run the add-in:
   ```sh
   npm start
   ```
