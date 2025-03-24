import { languages } from "./const";

var sourceLang = "Auto detect";
var targetLang = "Vietnamese";

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

    // Events register
    document.getElementById("source-lang").addEventListener("change", onSelectSource);
    document.getElementById("target-lang").addEventListener("change", onSelectTarget);
    Office.context.document.addHandlerAsync(
      Office.EventType.DocumentSelectionChanged,
      onSelectText
    );
  }
});

async function onSelectSource(event) {
  sourceLang = event.target.value;
}
async function onSelectTarget(event) {
  targetLang = event.target.value;
}

async function onSelectText() {
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
