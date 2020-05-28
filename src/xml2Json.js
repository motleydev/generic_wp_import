const fs = require("fs").promises;
const xml2js = require("xml2js");

const run = async () => {
  const file = await fs.readFile("./data/data.xml");
  const parser = new xml2js.Parser(/* options */);
  const data = await parser.parseStringPromise(file);
  await fs.writeFile("./data/data.json", JSON.stringify(data.rss.channel), {
    encoding: "utf-8",
  });
};

try {
  run();
} catch (error) {
  console.log(error);
}
