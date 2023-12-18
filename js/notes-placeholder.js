const loadNotes = () => {
  // console.log("notesPlaceholder");
  injectScripts("rte-js", chrome.runtime.getURL("/src/js/rte.js"));
  injectScripts("notes-js", chrome.runtime.getURL("/src/js/notes.js"));
};

loadNotes();
