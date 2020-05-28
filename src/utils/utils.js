const unified = require("unified");
const parse = require("rehype-parse");
const mutate = require("rehype-remark");
const stringify = require("remark-stringify");
const uploadMutation = require("./fetch");

const months = {
  0: "january",
  1: "february",
  2: "march",
  3: "april",
  4: "may",
  5: "june",
  6: "july",
  7: "august",
  8: "september",
  9: "october",
  10: "november",
  11: "december",
};

const month = (input) => months[input];

const proMark = (input) => {
  let content = "";
  unified()
    .use(parse)
    .use(mutate)
    .use(stringify, {})
    .process(input, function (err, payload) {
      if (err) console.log(err);
      content = String(payload);
    });
  return content;
};

const pathify = (date) => {
  const yearMonth = date.replace("-", "/").replace(/\-.+/, "");
  return `${yearMonth}/`;
};

const pickConstructor = (data) => (input, wp = true) =>
  wp ? data[0][`wp:${input}`] : data[0][input];
const attrConstructor = (post) => (input, enumerable = false) =>
  enumerable ? post[input] : post[input][0];

const firstVal = (input) => input["wp:meta_value"][0];
const firstKey = (input) => input["wp:meta_key"][0];

const isHTML = (input) => /<\/p>/gi.test(input);
const isMD = (input) => /(\*\w|\_\w|#\s\w|\[\w)/i.test(input);

const escapify = (input) => input.replace(/('|:\s|\")/gi, "\\$1");

export {
  proMark,
  pickConstructor,
  pathify,
  isHTML,
  attrConstructor,
  firstVal,
  firstKey,
  isMD,
  escapify,
  month,
  uploadMutation,
};
