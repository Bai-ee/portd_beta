// Event Listener
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var evt = document.createEvent("CustomEvent");
  evt.initCustomEvent(request.method, true, true);
  document.dispatchEvent(evt);
  sendResponse("sideBar toggled");
});

let sidebarContainer,
  toggleBtn,
  iframe,
  iframeDocument,
  toggleState = false,
  extensionVisibleState = true;

// This function will inject side bar html in the webpage
const loadSideBar = async () => {
  const response = await fetch(chrome.runtime.getURL("src/html/sidebar.html"));
  const html = await response.text();
  document.body.insertAdjacentHTML("beforeend", html);

  iframe = document.getElementById("portd-notes-iframe");
  iframe.src = chrome.runtime.getURL("src/html/notes.html");

  // Here we are animating the sidebar element (open / close) with GSAP

  sidebarContainer = document.querySelector(".portd-notes-container");
  toggleBtn = document.querySelector(".portd-notes-toggle-sidebar-btn");

  // MASTER TIMELINE
  const sidebarCont = gsap.timeline();
  sidebarCont.pause();

  const popupCont = gsap.timeline();
  popupCont.pause();

  const screenWidth = window.innerWidth;

  let moveLeft = 390;
  if (screenWidth <= 1366) {
    moveLeft = 390;
  } else {
  }

  const easeMaster = "back.out(.35)";
  const easeDur = 0.45;

  // GSAP EFFECTS
  // OPENS EXTENSION
  gsap.registerEffect({
    name: "move",
    effect: (targets, config) => {
      return gsap.to(targets, {
        duration: easeDur,
        right: moveLeft,
        opacity: 1,
        ease: easeMaster,
      });
    },
    defaults: { duration: 0.35 }, //defaults get applied to any "config" object passed to the effect
    extendTimeline: true, //now you can call the effect directly on any GSAP timeline to have the result immediately inserted in the position you define (default is sequenced at the end)
  });

  gsap.registerEffect({
    name: "move_popup",
    effect: (targets, config) => {
      return gsap.to(targets, {
        duration: easeDur,
        right: moveLeft,
        opacity: 1,
        ease: easeMaster,
      });
    },
    defaults: { duration: 0.15 }, //defaults get applied to any "config" object passed to the effect
    extendTimeline: true, //now you can call the effect directly on any GSAP timeline to have the result immediately inserted in the position you define (default is sequenced at the end)
  });

  // APPEND TO MASTER TIMELINE
  sidebarCont.add(gsap.effects.move(sidebarContainer));
  popupCont.add(gsap.effects.move_popup(sidebarContainer));

  document
    .querySelector(".portd-notes-toggle-sidebar-btn img")
    .setAttribute(
      "src",
      chrome.runtime.getURL("/src/assets/toggle-sidebar-btn.svg")
    );

  // this listener is for sidebar icon, when it is clicked it will toggle side bar
  toggleBtn.onclick = () => {
    if (toggleState) {
      // console.log("toggle = false sidebar closed");
      toggleSidebar();
      sidebarCont.reverse();
      toggleState = false; // set toggle state to false
    } else {
      // console.log("toggle = true sidebar open");
      toggleSidebar();
      sidebarCont.play();
      toggleState = true; // set toggle state to true
    }
  };

  // this listener is for the popup icon, when it is clicked it will toggle side bar
  document.addEventListener("enableFeature", function (e) {
    if (toggleState) {
      toggleSidebar();
      sidebarCont.reverse();
      toggleState = false; // set toggle state to false
    } else {
      const container = document.querySelector(".portd-notes-container");
      container.classList.remove("hide");
      container.classList.add("show");
      extensionVisibleState = true;

      toggleSidebar();
      sidebarCont.play();
      toggleState = true; // set toggle state to true
    }
  });

  // document.addEventListener("keydown", function (event) {
  //   // Check if Alt key and letter X are pressed simultaneously
  // console.log(event);
  //   if (event.ctrlKey && (event.key === "." || event.key === ".")) {
  //     // console.log("Ctrl + . pressed");
  //     if (toggleState) {
  //       // // console.log("toggle = false sidebar closed");
  //       toggleSidebar();
  //       sidebarCont.reverse();
  //       toggleState = false; // set toggle state to false
  //     } else {
  //       const container = document.querySelector(".portd-notes-container");
  //       if (container.classList.contains("hide")) {
  //         extensionVisibleState = true;
  //         container.classList.remove("hide");
  //         container.classList.add("show");
  //       }
  //       // // console.log("toggle = true sidebar open");
  //       toggleSidebar();
  //       sidebarCont.play();
  //       toggleState = true; // set toggle state to true
  //     }
  //   }

  //   if (event.ctrlKey && event.key === "/") {
  //     // console.log("Ctrl + / pressed");
  //     const container = document.querySelector(".portd-notes-container");
  //     if (extensionVisibleState) {
  //       extensionVisibleState = false;
  //       container.classList.remove("show");
  //       container.classList.add("hide");
  //     } else {
  //       extensionVisibleState = true;
  //       container.classList.remove("hide");
  //       container.classList.add("show");
  //     }
  //   }
  // });
};

window.addEventListener("message", function (event) {
  // console.log(event.data);
  if (
    event.data.type === "hideExtension" &&
    event.data.extensionVisibleState == false
  ) {
    extensionVisibleState = event.data.extensionVisibleState;
    toggleBtn.click();
    const container = document.querySelector(".portd-notes-container");
    container.classList.remove("show");
    container.classList.add("hide");
  }
});

// This function passes a message to notes.js when the sidebar opens/closes
const toggleSidebar = () => {
  toggleState = !toggleState;
  // sidebarContainer.classList.toggle("portd-notes-container-visible");
  iframe.contentWindow.postMessage(
    {
      type: "toggleSidebar",
      toggleState,
    },
    "*"
  );
};

loadSideBar();
