const smallScreens = window.matchMedia("(max-width: 767px)");
const largeScreens = window.matchMedia("(min-width: 767px)");
const mainNav = document.getElementById("main-nav");
userSettingKey = "user-settings";
let userSetting = {};
//skills section scroll animation function throttle
const throttledScrollSkills = throttle(ourSkillsProgress, 300);
//moving setting Icon on scroll function throttle
const settingIcon = document.getElementById("setting-icon");
const throttledScrollSetting = throttle(settingFloatingRight, 300);
//testimonials section scroll animation function throttle
const throttledScrollTestimonials = throttle(testimonialsAnimation, 300);
//sections-navigations section scroll animation function throttle
const throttledScrollNavigation = throttle(navigationVisibility, 300);

document.addEventListener("DOMContentLoaded", () => {
  loadUserSettings();
  screenSizeChanges();
  handleLargeScreens();
  settingFloatingRight();
  window.addEventListener("scroll", throttledScrollSkills);
  window.addEventListener("scroll", throttledScrollTestimonials);
});
const dropMenu = document.querySelector("header .dropdown-icon");
function screenSizeChanges() {
  if (dropMenu) {
    if (smallScreens.matches) {
      dropMenu.addEventListener("click", handleDropMenu);
      window.addEventListener("scroll", throttledScrollSetting);
    } else {
      dropMenu.removeEventListener("click", handleDropMenu);
      window.removeEventListener("scroll", throttledScrollSetting);
    }
  }
}

function handleLargeScreens() {
  if (largeScreens.matches) {
    window.addEventListener("scroll", throttledScrollNavigation);
    mainNav.addEventListener("click", navigateSections);
  } else {
    window.removeEventListener("scroll", throttledScrollNavigation);
    mainNav.removeEventListener("click", navigateSections);
  }
}

smallScreens.addEventListener("change", screenSizeChanges);
largeScreens.addEventListener("change", handleLargeScreens);

// small screens drop nav
function handleDropMenu() {
  const closeNav = document.querySelector("#main-nav span");
  if (mainNav && closeNav) {
    mainNav.classList.add("visible");
    dropMenu.classList.add("open");
    closeNav.addEventListener("click", onCloseNav);
    document.addEventListener("keyup", onEscape);
    function onEscape(event) {
      if (event.key === "Escape") {
        onCloseNav();
      }
    }
    function onCloseNav() {
      mainNav.classList.remove("visible");
      closeNav.removeEventListener("click", onCloseNav);
      document.removeEventListener("keyup", onEscape);
      dropMenu.classList.remove("open");
    }
  }
}

// background image rotation

// preloading the images before changing the background image

const loadedImgs = {};

function preLoadImages(imgUrl) {
  return new Promise((resolve, reject) => {
    if (loadedImgs[imgUrl]) {
      resolve(loadedImgs[imgUrl]);
    } else {
      const newImg = new Image();
      newImg.src = imgUrl;
      newImg.onload = () => {
        loadedImgs[imgUrl] = newImg.src;
        resolve(newImg.src);
      };
      newImg.onerror = () => reject(new Error("Image Loading Error"));
    }
  });
}

// change the background
function changeBackground() {
  const images = [
    "./assets/images/background-01.jpg",
    "./assets/images/background-02.jpg",
    "./assets/images/background-04.jpg",
    "./assets/images/background-05.jpg",
  ];
  const randomIndex = Math.floor(Math.random() * images.length);
  const selectedImg = images[randomIndex];
  preLoadImages(selectedImg)
    .then((response) => {
      document.documentElement.style.setProperty(
        "--background-image",
        `url(${response})`
      );
    })
    .catch((reason) => {
      console.error(reason);
    });
}
let BackgroundIntervalId = null;
function setRandomBackground(random = true) {
  if (random === true) {
    BackgroundIntervalId = setInterval(() => changeBackground(), 10000);
  } else {
    clearInterval(BackgroundIntervalId);
    BackgroundIntervalId = null;
  }
}

// setting Box display

function toggleSettingMenu() {
  //setting menu container
  const settingMenu = document.getElementById("setting-box");
  //setting menu close icon
  const closeSettingSpan = document.getElementById("close-setting");

  // toggle setting container when setting icon clicked
  settingIcon.classList.toggle("active");
  settingIcon.parentElement.classList.toggle("active");
  settingMenu.classList.toggle("open");

  // add event listener to the close icon and on ESCAPE key when the setting menu is opened
  if (settingMenu.classList.contains("open")) {
    //click close icon
    closeSettingSpan.addEventListener("click", closeSetting, { once: true });
    // Escape Key
    document.addEventListener(
      "keyup",
      (event) => {
        if (event.key === "Escape") {
          closeSetting();
        }
      },
      { once: true }
    );
    // close off the setting container
    function closeSetting() {
      settingIcon.classList.remove("active");
      settingIcon.parentElement.classList.remove("active");
      settingMenu.classList.remove("open");
    }
  }
}

settingIcon.addEventListener("click", toggleSettingMenu);

//user setting
const settingContainer = document.getElementById("setting-box");
function setSettings(event) {
  //main color settings
  if (event.target.tagName === "INPUT" && event.target.type === "radio") {
    const newMainColor = event.target.value;
    if (newMainColor) {
      userSetting.mainColor = newMainColor;
      document.documentElement.style.setProperty("--main-color", newMainColor);
    }
  } //random background settings
  else if (
    event.target instanceof HTMLButtonElement &&
    event.target.classList.contains("background")
  ) {
    const currentActive = document.querySelector(
      "#setting-box .background-setting button.active"
    );
    if (event.target !== currentActive) {
      currentActive.classList.remove("active");
      event.target.classList.add("active");
      if (event.target.classList.contains("background-setting-yes")) {
        setRandomBackground(true);
        userSetting.randomBackground = true;
      } else if (event.target.classList.contains("background-setting-no")) {
        setRandomBackground(false);
        userSetting.randomBackground = false;
      }
    }
  } //show navigation bullets settings
  else if (
    event.target instanceof HTMLButtonElement &&
    event.target.classList.contains("bullets")
  ) {
    const currentActive = document.querySelector(
      "#setting-box .bullets-setting button.active"
    );
    if (event.target !== currentActive) {
      currentActive.classList.remove("active");
      event.target.classList.add("active");
      if (event.target.classList.contains("bullets-setting-yes")) {
        userSetting.navigationBullets = true;
        navigationVisibility();
      } else if (event.target.classList.contains("bullets-setting-no")) {
        userSetting.navigationBullets = false;
        navigationVisibility();
      }
    }
  } else if (
    event.target instanceof HTMLButtonElement &&
    event.target.classList.contains("reset-options")
  ) {
    userSetting.mainColor = "#f59723";
    userSetting.navigationBullets = true;
    userSetting.randomBackground = true;
    updateLocalStorage();
    window.location.reload();
  }
  updateLocalStorage(userSettingKey, userSetting);
}

settingContainer.addEventListener("click", setSettings);

//moving setting icon to the right when scrolling in small screens
function settingFloatingRight() {
  //calculating the position after scrolling 2VH
  const targetPosition = 0.02 * window.innerHeight;
  if (window.scrollY >= targetPosition) {
    settingIcon.classList.add("float-right");
    settingIcon.parentElement.classList.add("float-right");
  } else {
    settingIcon.classList.remove("float-right");
    settingIcon.parentElement.classList.remove("float-right");
  }
}

//local storage

//update local storage
function updateLocalStorage(key = "", value = {}) {
  if (typeof key === "string" && key !== "") {
    const JSONvalue = JSON.stringify(value);
    localStorage.setItem(key, JSONvalue);
  } else {
    console.error("Error Updating LocalStorage");
  }
}

//Load data from local storage
function loadUserSettings() {
  try {
    const JSONuserSetting = localStorage.getItem(userSettingKey);
    const userSettingObject = JSONuserSetting
      ? JSON.parse(JSONuserSetting)
      : {};

    userSetting = { ...userSettingObject };

    //Load Main Color
    const userMainColor = userSettingObject.mainColor || "#f59723";
    const mainColorElement = document.querySelector(
      `#colors-options input[value="${userMainColor}"]`
    );
    if (mainColorElement) {
      document.documentElement.style.setProperty("--main-color", userMainColor);
      mainColorElement.checked = true;
    }
    //load random background settings
    let userBackgroundSetting = true;
    if (Object.hasOwn(userSettingObject, "randomBackground")) {
      userBackgroundSetting = userSettingObject.randomBackground;
    }

    if (userBackgroundSetting) {
      setRandomBackground(userBackgroundSetting);
      const randomBackgroundOption = document.querySelector(
        "#setting-box .background-setting .background-setting-yes"
      );
      randomBackgroundOption.classList.add("active");
    } else {
      setRandomBackground(userBackgroundSetting);
      const randomBackgroundOption = document.querySelector(
        "#setting-box .background-setting .background-setting-no"
      );
      randomBackgroundOption.classList.add("active");
    }

    //Load section navigation settings
    let sectionNavigationSetting = true;
    if (Object.hasOwn(userSettingObject, "navigationBullets")) {
      sectionNavigationSetting = userSettingObject.navigationBullets;
    }

    if (sectionNavigationSetting) {
      navigationVisibility();
      const sectionNavigationOption = document.querySelector(
        "#setting-box .bullets-setting .bullets-setting-yes"
      );
      sectionNavigationOption.classList.add("active");
    } else {
      navigationVisibility();
      const sectionNavigationOption = document.querySelector(
        "#setting-box .bullets-setting .bullets-setting-no"
      );
      sectionNavigationOption.classList.add("active");
    }
  } catch (error) {
    console.error(error.message);
  }
}

//Animate our skills section
function ourSkillsProgress() {
  const skillsSection = document.querySelector("main .our-skills");
  const pos =
    skillsSection.getBoundingClientRect().top +
    window.scrollY +
    skillsSection.offsetHeight / 2;
  const scrollPosition = window.scrollY + window.innerHeight;
  if (scrollPosition > pos) {
    const skills = document.querySelectorAll(
      "main .our-skills .skill-progress span"
    );
    skills.forEach((skill) => {
      skill.style.setProperty("--progress", skill.dataset.progress);
      skill.classList.add("display-progress");
    });
    window.removeEventListener("scroll", throttledScrollSkills);
  }
}

//Gallery section popup
const galleryImagesContainer = document.querySelector(
  ".our-gallery .images-container"
);

function openPopup(event) {
  if (event.target.matches("img")) {
    //Add image src and alt to the popup img
    const popupImage = document.querySelector("#popup-box img");
    popupImage.src = event.target.src;
    popupImage.alt = event.target.alt;

    //Add title to the popup
    const popupTitle = document.querySelector("#popup-box h3");
    popupTitle.textContent = popupImage.alt;
    //show popup
    const galleryPopup = document.getElementById("gallery-popup-overlay");
    galleryPopup.classList.add("show");

    //close the popup

    //close using close span
    const closePopup = document.querySelector("#popup-box span");
    closePopup.addEventListener("click", closePopupAction);
    //close on keyup ESCAPE
    document.addEventListener("keyup", onEscape);
    //close when clicked outside the popup box
    galleryPopup.addEventListener("click", closeOnClick);

    function onEscape(event) {
      if (event.key === "Escape") {
        closePopupAction();
      }
    }
    function closeOnClick(event) {
      if (event.target === galleryPopup) {
        closePopupAction();
      }
    }

    function closePopupAction() {
      galleryPopup.classList.remove("show");
      popupImage.src = "";
      popupImage.alt = "";
      document.removeEventListener("keyup", onEscape);
      closePopup.removeEventListener("click", closePopupAction);
      galleryPopup.removeEventListener("click", closeOnClick);
    }
  }
}

galleryImagesContainer.addEventListener("click", openPopup);

//Animate testimonials section

function testimonialsAnimation() {
  const testimonialsEl = document.querySelector("section.testimonials");
  const elementPos = testimonialsEl.getBoundingClientRect();
  const quarterHeight = elementPos.height * 0.25;
  if (
    elementPos.top + quarterHeight < window.innerHeight &&
    elementPos.bottom > quarterHeight
  ) {
    testimonialsEl.classList.add("active");
  } else {
    testimonialsEl.classList.remove("active");
  }
}

//sections navigation
const sectionNavigation = document.getElementById("section-navigation");
function navigateSections(event) {
  if (event.target.classList.contains("section")) {
    event.preventDefault();
    const clickedSection = event.target.dataset.section;
    selectedSection = document.querySelector(clickedSection);
    selectedSection.scrollIntoView({ behavior: "smooth" });
  }
}
sectionNavigation.addEventListener("click", navigateSections);

//Handle when section-navigation appears  viewport
function navigationVisibility() {
  if (userSetting.navigationBullets) {
    sectionNavigation.style.display = "block";
    const targetPosition = window.innerHeight;
    if (window.scrollY > targetPosition) {
      sectionNavigation.classList.add("show");
    } else {
      sectionNavigation.classList.remove("show");
    }
  } else {
    sectionNavigation.classList.remove("show");
    sectionNavigation.style.display = "none";
  }
}

//Throttle

function throttle(func, limit) {
  let lastRun, lastFunc;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRun) {
      func.apply(context, args);
      lastRun = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRun >= limit) {
          func.apply(context, args);
        }
      }, limit - (Date.now() - lastRun));
    }
  };
}
