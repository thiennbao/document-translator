import { GoogleGenerativeAI } from "@google/generative-ai";
import languages from "../constants/languages";
import { API_KEY } from "../config/config";

// Model
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// States
var sourceLang, targetLang, text;

// Elements
const appLoadElm = document.getElementById("app-load");
const appBodyElm = document.getElementById("app-body");
const sourceLangElm = document.getElementById("source-lang");
const targetLangElm = document.getElementById("target-lang");
const swapBtnElm = document.getElementById("swap-btn");
const sourceElm = document.getElementById("source");
const targetElm = document.getElementById("target");

// App entry
Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    appLoadElm.style.display = "none";
    appBodyElm.style.display = "block";

    // Append language options
    sourceLangElm.appendChild(createOptionElm("Auto detect", true));
    [sourceLangElm, targetLangElm].forEach((select) => {
      languages.forEach((lang) => {
        select.appendChild(createOptionElm(lang));
      });
    });
    document.querySelectorAll("#target-lang>option[value=Vietnamese]")[0].selected = true;
    selectLang();

    // Events register
    sourceLangElm.addEventListener("change", onSelectLang);
    targetLangElm.addEventListener("change", onSelectLang);
    swapBtnElm.addEventListener("click", onSwapLang);
    sourceElm.addEventListener("input", onTyping);
    Office.context.document.addHandlerAsync(
      Office.EventType.DocumentSelectionChanged,
      onSelectText
    );
  }
});

// Event functions
async function onSelectLang() {
  selectLang();
  await translate();
}
async function onSwapLang() {
  sourceLangElm.value = targetLang;
  targetLangElm.value = sourceLang === "Auto detect" ? languages[0] : sourceLang;
  selectLang();
  await translate();
}
async function onSelectText() {
  await Word.run(async (context) => {
    var range = context.document.getSelection();
    range.load("text");
    await context.sync();
    text = range.text.trim();
  });
  await translate();
}
async function onTyping(event) {
  text = event.target.value;
  await translate();
}

// Util functions

async function translate() {
  if (!text) return;
  const prompt = `Translate "${text}" from ${sourceLang} to ${targetLang}, response only the translation.`;
  const translation = await promptModel(prompt);
  sourceElm.value = text ?? "";
  targetElm.innerText = translation ?? "";
}

let debounceTimer;
async function promptModel(prompt) {
  if (debounceTimer) clearTimeout(debounceTimer);
  return new Promise((resolve) => {
    debounceTimer = setTimeout(async () => {
      const result = await model.generateContent(prompt);
      resolve(result.response.text());
    }, 500);
  });
}

function selectLang() {
  sourceLang = sourceLangElm.value;
  targetLang = targetLangElm.value;
}

function createOptionElm(value, selected = false) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  option.selected = selected;
  return option;
}
