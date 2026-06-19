const fs = require("fs/promises");
const path = require("path");

const inputDataPath = path.join(__dirname, "..", "data", "inputData.json");

const readInputData = async () => {
  const fileContent = await fs.readFile(inputDataPath, "utf8");
  const parsedData = JSON.parse(fileContent);

  return Array.isArray(parsedData) ? parsedData : [];
};

const writeInputData = async (items) => {
  await fs.writeFile(inputDataPath, `${JSON.stringify(items, null, 2)}\n`);
};

const appendInputData = async (data) => {
  const items = await readInputData();
  const nextItems = [...items, data];

  await writeInputData(nextItems);

  return nextItems;
};

module.exports = {
  appendInputData,
  readInputData,
};
