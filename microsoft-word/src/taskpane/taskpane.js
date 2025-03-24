import { languages } from "./const";

var sourceLang, targetLang;

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
    document.getElementById("source-lang").addEventListener("change", selectLang);
    document.getElementById("target-lang").addEventListener("change", selectLang);
    document.getElementById("swap-btn").addEventListener("click", swapLang);
    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, selectText);
  }
});

// Event functions
async function selectLang() {
  sourceLang = document.getElementById("source-lang").value;
  targetLang = document.getElementById("target-lang").value;
  await translate();
}
async function swapLang() {
  document.getElementById("source-lang").value = targetLang;
  document.getElementById("target-lang").value =
    sourceLang === "Auto detect" ? languages[0] : sourceLang;
  selectLang();
  await translate();
}
async function selectText() {
  await translate();
}

// Util functions
async function translate() {
  document.getElementById("source").value = `${sourceLang}: Lmao`;
  document.getElementById("target").innerText = `${targetLang}: Lmao`;
}
function createOptionElm(value, selected = false) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  option.selected = selected;
  return option;
}
