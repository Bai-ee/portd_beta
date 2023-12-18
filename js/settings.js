const loadSettingsUI = async () => {
  try {
    const zoomiesAccounts = await popupToBackground("get-accounts");

    const html = settingsListHtml(zoomiesAccounts);
    if (html) {
      document.getElementById("account-list-container").innerHTML = html;
      addBindingsForDynamicsettingsHtmlElements();
    } else {
      linkedAccountCount = 0;
      await clearNotesData();
      showLoginUI();
      hideBadge();
    }
  } catch (e) {
    // console.log(e);
    // alert("Failed to fetch accounts.");
  }
};

const settingsListHtml = (accounts) => {
  if (!accounts) {
    return `
          <div class="account-item">
            <h4 class="settings-button-text">No accounts linked.</h4>
          </div>
          `;
  }
  accounts = Object.values(accounts);

  let html = "";
  for (let id in accounts) {
    const details = accounts[id];

    // display-flex flex-row align-center justify-around account-container mt-3 mb-3
    if (details) {
      const { email, provider } = details;
      html += `
        <div class="settings-btn-block mt-3" provider=${provider} email=${email}>
          <div class="display-flex justify-center align-center w-20">
            <img src="../icons/${provider}.png" alt="${provider}" height="20" width="20" class="btn-icon">
          </div>
          <div class="display-flex justify-center align-center w-60">
            <span class="linked-account-email ml-2">${email}</span>
          </div>
          <div class="display-flex justify-center align-center w-20">
            <img class="ml-2 close-button cursor-pointer" accountId="${details.id}" src="../assets/close.png" alt="settings" height="15" width="15" ></img> 
          </div>
        </div>`;
    }
  }

  return html;
};

const addBindingsForDynamicsettingsHtmlElements = () => {
  if (document.getElementsByClassName("close-button")) {
    const removeButtons = document.querySelectorAll(".close-button");
    for (let i = 0; i < removeButtons.length; i++) {
      removeButtons[i].onclick = async (event) => {
        try {
          await popupToBackground(
            "remove-account",
            event.target.getAttribute("accountId")
          );

          // This is to setBadge text
          const meetings = await getMeetingsFromBackgroundWorker(
            currentDateGlobalVarible,
            true
          );
          await loadSettingsUI();
        } catch (err) {
          alert("Failed to remove account.");
        }
      };
    }
  }
};

document.getElementById("import_notes_input").onchange = (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const fileContent = e.target.result;
      // console.log("File content:", fileContent);
      allNotesInJSON = { ...allNotesInJSON, ...JSON.parse(fileContent) };

      // console.log(allNotesInJSON);
      const notes = Object.values(allNotesInJSON) || [];

      if (!notes.length) {
        return showNoNotesBox();
      }

      const sortedNotes = sortNotesByDate(notes);
      populateNotes(sortedNotes, allNotesInJSON);
      await saveNotes(allNotesInJSON);
      document.getElementById("import_notes_input").value = "";
      alert("Notes Imported!");
    };

    reader.readAsText(file);
  }
};

document.getElementById("import_notes").onclick = () => {
  document.getElementById("import_notes_input").click();
};

// document.getElementById("export_notes").onclick = () => {
// console.log("Download JSON");
//   const jsonString = JSON.stringify(allNotesInJSON);
//   const blob = new Blob([jsonString], { type: "application/json" });

//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `notes_backup_${moment()}`;
//   link.click();
//   URL.revokeObjectURL(url);
//   alert("Notes Exported!");
// };

document.querySelectorAll('[id="export_notes"]').forEach((button) => {
  button.addEventListener("click", () => {
    // console.log("Download JSON");
    const jsonString = JSON.stringify(allNotesInJSON);
    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `notes_backup_${moment()}`;
    link.click();
    URL.revokeObjectURL(url);
    alert("Notes Exported!");
  });
});

document.getElementById("signout").onclick = async () => {
  await clearNotesData();
  showLoginUI();
};

/*
document.getElementById("dark-mode").onclick = function(e) {
    popupToBackground("set", { zoomiesTheme: "dark" });
    location.reload();
};

document.getElementById("light-mode").onclick = function() {
    popupToBackground("set", { zoomiesTheme: "light" });
    location.reload();
};
*/

loadSettingsUI();
