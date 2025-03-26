function onOpen() {
  DocumentApp.getUi().createAddonMenu().addItem("Open Translator", "showUI").addToUi();
}

function showUI() {
  var html = HtmlService.createHtmlOutputFromFile("UI").setTitle("Document Translator");
  DocumentApp.getUi().showSidebar(html);
}
