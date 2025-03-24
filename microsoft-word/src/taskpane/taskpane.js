import { languages } from "./const";

var sourceLang, targetLang, text;

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("app-load").style.display = "none";
    document.getElementById("app-body").style.display = "block";

    // Append language options
    document.getElementById("source-lang").appendChild(createOptionElm("Auto detect", true));
    document.querySelectorAll("select[id$=lang]").forEach((select) => {
      languages.forEach((lang) => {
        select.appendChild(createOptionElm(lang));
      });
    });
    document.querySelectorAll("#target-lang>option[value=Vietnamese]")[0].selected = true;
    selectLang();

    // Events register
    document.getElementById("source-lang").addEventListener("change", onSelectLang);
    document.getElementById("target-lang").addEventListener("change", onSelectLang);
    document.getElementById("swap-btn").addEventListener("click", onSwapLang);
    document.getElementById("source").addEventListener("input", onTyping);
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
  document.getElementById("source-lang").value = targetLang;
  document.getElementById("target-lang").value =
    sourceLang === "Auto detect" ? languages[0] : sourceLang;
  selectLang();
  await translate();
}
async function onSelectText() {
  await Word.run(async (context) => {
    var range = context.document.getSelection();
    range.load("text");
    await context.sync();
    if (range.text?.trim()) text = range.text;
  });
  await translate();
}
async function onTyping(event) {
  text = event.target.value;
  await translate();
}

// Util functions
async function translate() {
  const translation = text && `[${sourceLang} > ${targetLang}]: ${text}`;
  document.getElementById("source").value = text;
  document.getElementById("target").innerText = translation;
}
function selectLang() {
  sourceLang = document.getElementById("source-lang").value;
  targetLang = document.getElementById("target-lang").value;
}
function createOptionElm(value, selected = false) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  option.selected = selected;
  return option;
}
