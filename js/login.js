const loadLinkedAccounts = async () => {
  try {
    // popupToBackground: this method is from utils.js
    const zoomiesAccounts = await popupToBackground("get-accounts");
    if (!(zoomiesAccounts && Object.keys(zoomiesAccounts).length)) {
      document.getElementById("go-back-link").style.display = "none";
    } else {
      document.getElementById("go-back-link").style.display = "flex";
    }
  } catch (e) {
    // console.log(e.message);
    // alert("Failed to fetch accounts.");
  }
};

console.log("show login screen")

document.querySelectorAll('[id="google-calendar-btn"]').forEach((button) => {
  button.onclick = function () {
    chrome.tabs.create({
      url: `${chrome.runtime.getManifest().domain_url}/google`,
    });
    // window.close();
  };
});

document.querySelectorAll('[id="microsoft-calendar-btn"]').forEach((button) => {
  button.onclick = function () {
    chrome.tabs.create({
      url: `${chrome.runtime.getManifest().domain_url}/microsoft`,
    });
    // window.close();
  };
});

//show admin content
document.querySelectorAll('[id="admin-btn"]').forEach((button) => {
  button.onclick = function () {
    document.querySelectorAll('[id="loginContent"]').forEach((googleButton) => {
      googleButton.style.display = "none";
    });
    document.getElementById("adminContainer").style.display = "flex";
    const textarea = document.getElementById("admin-permission-request-note");
    textarea.value = "Hello Admin,\n\nI am writing to request permission to use Portd with my work calendar. Portd is a productivity tool that can manage multiple calendar, facilitates joining meetings from one place with one-click. I believe it will help me and others manage meetings better.\n\nAccording to their privacy policy, they do not store the user's calendar events. Here is the link to their privacy policy - https://portd.io/privacy-policy and a 60-second video about their product - https://www.youtube.com/watch?v=vkr0BtTxMcU.\n\nThank you.";
    document.getElementById("admin-btn").style.display = "none";
    document.getElementById("collapsible-header-close-icon").style.display = "none";
    document.getElementById("meetings-collapsible-title").innerHTML = "admin approval"; 
    // window.alert(document.getElementById("meetings-collapsible-title").innerHTML())
    // document.getElementById("meetings-collapsible-header").style.pointerEvents = "none";

    collapsibleHeaders.forEach((header) => {
      header.style.pointerEvents = "none";
      const content = header.nextElementSibling;
      const headerParent = header.parentNode;
      if (header.id !== "meetings-collapsible-header") {
        header.style.opacity = 0.5;
        content.style.display = "none";
        content.classList.remove("open");
        content.classList.remove("half-open");
        content.classList.add("closed");
        headerParent.classList.remove("flex-1");
        headerParent.classList.add("flex-0");
      } else {
        content.style.display = "flex";
        content.classList.add("open");
        content.classList.remove("half-open");
        headerParent.classList.remove("flex-0");
        headerParent.classList.add("flex-1");
      }
    });
    document.getElementById("expand-notes").style.pointerEvents = "none";
  };
});

//close admin content and show login screen
document.getElementById('go-back-admin-permission-request-note').onclick = function () {
    document.querySelectorAll('[id="loginContent"]').forEach((googleButton) => {
      googleButton.style.display = "flex";
      googleButton.style.justifyContent = "center";
    });
    document.getElementById("collapsible-header-close-icon").style.display = "none";
    document.getElementById("adminContainer").style.display = "none";
    document.getElementById("admin-btn").style.display = "block";
    document.getElementById("collapsible-header-close-icon").style.display = "block";
    document.getElementById("meetings-collapsible-title").innerHTML = "meetings";
  document.getElementById("meetings-collapsible-header").style.pointerEvents = "all";
  collapsibleHeaders.forEach((header) => {
    header.style.pointerEvents = "all";
    const content = header.nextElementSibling;
    const headerParent = header.parentNode;
    if (header.id !== "meetings-collapsible-header") {
      header.style.opacity = 1;
      content.style.display = "flex";
      content.classList.add("half-open");
      content.classList.remove("closed");
      headerParent.classList.add("flex-1");
      headerParent.classList.remove("flex-0");
    } else {
      content.style.display = "flex";
      content.classList.add("half-open");
      content.classList.remove("closed");
      headerParent.classList.add("flex-1");
      headerParent.classList.remove("flex-0");
    }
  });
    document.getElementById("expand-notes").style.pointerEvents = "all";
};


document.getElementById('copy-admin-permission-request-note').onclick = function () {

  const textarea = document.getElementById("admin-permission-request-note");

  // Use the Clipboard API to copy the text to the clipboard
  navigator.clipboard.writeText(textarea.value)
    .then(() => {
      // Provide feedback that the text has been copied
      alert('Text copied to clipboard: ' + textarea.value);
    })
    .catch(err => {
      console.error('Unable to copy text to clipboard', err);
    });
};

document.querySelectorAll('[id="calendly-calendar-btn"]').forEach((button) => {
  button.onclick = function () {
    chrome.tabs.create({
      url: `${chrome.runtime.getManifest().domain_url}/calendly`,
    });

    // window.close();
  };
});

loadLinkedAccounts();





// const loadLinkedAccounts = async () => {
//   try {
//     const zoomiesAccounts = await popupToBackground("get-accounts");
//     if (!(zoomiesAccounts && Object.keys(zoomiesAccounts).length)) {
//       document.getElementById("go-back-link").style.display = "none";
//     } else {
//       document.getElementById("go-back-link").style.display = "flex";
//     }
//   } catch (e) {
//   }
// };

// document.querySelectorAll('[id="google-calendar-btn"]').forEach((button) => {
//   button.onclick = function () {
//     chrome.tabs.create({
//       url: `${chrome.runtime.getManifest().domain_url}/google`,
//     });
//   };
// });

// document.querySelectorAll('[id="microsoft-calendar-btn"]').forEach((button) => {
//   button.onclick = function () {
//     chrome.tabs.create({
//       url: `${chrome.runtime.getManifest().domain_url}/microsoft`,
//     });
//   };
// });

// document.querySelectorAll('[id="calendly-calendar-btn"]').forEach((button) => {
//   button.onclick = function () {
//     chrome.tabs.create({
//       url: `${chrome.runtime.getManifest().domain_url}/calendly`,
//     });
//   };
// });

// loadLinkedAccounts();
