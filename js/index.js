const sample = document.querySelector(".sample");
const viewportRadioBtns = document.querySelectorAll('input[name="viewport"]');
const inputs = document.querySelectorAll(".input");
const viewport = document.querySelector("#viewport");
const viewportTitle = document.querySelector("#viewport-title");
const calcInput = document.querySelector("#calc");
const slider = document.querySelector("#slider");
const computed = document.querySelector("#computed");
const viewportIcon = document.querySelectorAll(".viewport-icon");


const inputsArray = () =>
  Array.from(inputs).map((el) => {
    const parsed = parseEl(el);
    el.addEventListener("blur", updateEls);
    return parsed;
  });

function unitConversion(obj) {
  const { number, unit } = obj;
  if (unit === "rem") {
    const rem = number + "rem";
    const px = number * 10 + "px";
    return { rem, px };
  }
  const px = number + "px";
  const rem = number / 10 + "rem";
  return { rem, px };
}

function parseValue(str) {
  const num = +str.match(/[\d.]+/) && +str.match(/[\d.]+/)[0];
  const unit = str.match(/[^.\d]+/) && str.match(/[^.\d]+/)[0].toLowerCase();
  return { num, unit };
}


function updateEls(el) {
  parseEl(el);
  calculateClamp();
}

function getEl(el) {
  return el.target ? el.target : el;
}

function parseEl(el) {
  const element = getEl(el);
  const id = element.id;
  const value = element.value;
  const number = parseValue(value).num;
  const unit = parseValue(value).unit;
  const px = unitConversion({ number, unit }).px;
  const rem = unitConversion({ number, unit }).rem;
  const parsed = { el, id, value, number, unit, px, rem };
  updateConversion(parsed);
  return parsed;
}

function updateConversion(obj) {
  const targetEl = document.querySelector(`[data-unit=${obj.id}]`);
  if (targetEl) {
    const text = obj.unit !== "rem" ? obj.rem : obj.px;
    targetEl.textContent = text;
  }
}

function convertToRem(obj) {
  return obj.unit === "rem" ? obj.number : obj.number / 10;
}

function calculateClamp() {
  console.log("ran");
  const updatedValues = inputsArray();
  const minFs = convertToRem(updatedValues.find((obj) => obj.id === "min-fs"));
  const maxFs = convertToRem(updatedValues.find((obj) => obj.id === "max-fs"));
  const minVw = convertToRem(updatedValues.find((obj) => obj.id === "min-vw"));
  const maxVw = convertToRem(updatedValues.find((obj) => obj.id === "max-vw"));
  const factor = (1 / (maxVw - minVw)) * (maxFs - minFs);
  const calcRem = minFs - minVw * factor;
  const calcVw = 100 * factor;
  const calc = `${calcRem}rem + ${calcVw}vw`;
  const min = Math.min(minFs, maxFs);
  const max = Math.max(minFs, maxFs);
  const clamp = `font-size: ${min}rem;
font-size: clamp(${min}rem, ${calc}, ${max}rem);`;
  const css = clamp;
  calcInput.textContent = css;

}

function determineViewport(num) {
  switch (true) {
    case num <= 768:
      return "mobile";
    case num <= 1023:
      return "tablet";
    case num <= 1407:
      return "laptop";
    default:
      return "desktop";
  }
}


function calcInternalClamp(val, min, max) {
  return val <= max && val >= min ? val : val > max ? max : min;
}

inputsArray();
calculateClamp();
