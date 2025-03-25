import $ from "jquery";
import { GoogleGenerativeAI } from "@google/generative-ai";
import StateManager from "../utils/stateManager";
import { API_KEY } from "../config/config";
import languages from "../constants/languages";

let stateUpdated = new Event("stateUpdate");
const stateManager = new StateManager(
  {
    sourceLang: "Auto detect",
    targetLang: "Vietnamese",
    text: "",
    modelName: "gemini-2.0-flash",
    temperature: 0.8,
    wrttingStyle: "general",
  },
  stateUpdated
);
let debounceTimer;
let genAI = new GoogleGenerativeAI(API_KEY);

// App entry
Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    $("#app-load").css("display", "none");
    $("#app-body").css("display", "flex");

    // Append language options
    $("#source-lang").append(createOptionElm("Auto detect", true));
    languages.forEach((lang) => {
      $("#source-lang").append(createOptionElm(lang));
      $("#target-lang").append(createOptionElm(lang));
    });
    $("#target-lang>option[value=Vietnamese]")[0].selected = true;

    // Events register
    window.addEventListener("stateUpdate", onStateUpdated);
    $("#source-lang").on("change", onSourceLangChange);
    $("#target-lang").on("change", onTargetLangChange);
    $("#swap-btn").on("click", onSwapLang);
    $("#source").on("input", onTyping);
    Office.context.document.addHandlerAsync(
      Office.EventType.DocumentSelectionChanged,
      onSelectText
    );
  }
});

// Event handler
async function onStateUpdated() {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (stateManager.state.text) {
    $("#source-lang").val(stateManager.state.sourceLang);
    $("#target-lang").val(stateManager.state.targetLang);
    $("#source").val(stateManager.state.text);
    const translation = await translate(stateManager.state);
    $("#target").val(translation);
  }
}
function onSourceLangChange(e) {
  stateManager.setState({ ...stateManager.state, sourceLang: e.target.value });
}
function onTargetLangChange(e) {
  stateManager.setState({ ...stateManager.state, sourceLang: e.target.value });
}
function onSwapLang() {
  const currentSource = stateManager.state.sourceLang;
  const currentTarget = stateManager.state.targetLang;
  stateManager.setState({
    ...stateManager.state,
    sourceLang: currentTarget,
    targetLang: currentSource === "Auto detect" ? languages[0] : currentSource,
  });
}
function onTyping(e) {
  stateManager.setState({ ...stateManager.state, text: e.target.value });
}
async function onSelectText() {
  await Word.run(async (context) => {
    var range = context.document.getSelection();
    range.load("text");
    await context.sync();
    stateManager.setState({ ...stateManager.state, text: range.text.trim() });
  });
}

// Util functions
async function translate(state) {
  return new Promise((resolve) => {
    debounceTimer = setTimeout(async () => {
      const prompt = `Translate "${state.text}" from ${state.sourceLang} to ${state.targetLang} in ${state.wrttingStyle} wrtting style, response only the translation.`;
      const model = genAI.getGenerativeModel({ model: state.modelName });
      const result = await model.generateContent(prompt, { temperature: state.temperature });
      resolve(result.response.text());
    }, 500);
  });
}
function createOptionElm(value, selected = false) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  option.selected = selected;
  return option;
}
