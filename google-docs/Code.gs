function onOpen() {
  DocumentApp.getUi().createAddonMenu().addItem("Open Translator", "showUI").addToUi();
}

function showUI() {
  var html = HtmlService.createHtmlOutputFromFile("UI").setTitle("Document Translator");
  DocumentApp.getUi().showSidebar(html);
}

function onSelectText() {
  const doc = DocumentApp.getActiveDocument();
  const selection = doc.getSelection();
  if (selection) {
    var elements = selection.getRangeElements();
    let text = "";
    elements.forEach((element) => {
      var start = element.getStartOffset();
      var end = element.getEndOffsetInclusive();
      var selectedText = element.getElement().asText().getText();
      selectedText = selectedText.substring(start, end + 1);
      selectedText = selectedText.trim();
      text += selectedText;
    });

    return text;
  }
  return "";
}
