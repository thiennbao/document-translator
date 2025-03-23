Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("app-load").style.display = "none";
    document.getElementById("app-body").style.display = "flex";

    // Events register
    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, onSelect);
  }
});

async function onSelect() {
  Word.run(async (context) => {
    const paragraph = context.document.body.insertParagraph("Hello World", Word.InsertLocation.end);
    paragraph.font.color = "blue";
    context.sync();
  });
}
