import fs from "fs/promises";
import path from "path";

const inputDataPath = path.join(__dirname, "..", "data", "inputData.json");

export interface InputDataItem {
  date: string;
  input: string;
}

export const readInputData = async (): Promise<InputDataItem[]> => {
  const fileContent = await fs.readFile(inputDataPath, "utf8");
  const parsedData = JSON.parse(fileContent);

  return Array.isArray(parsedData) ? parsedData : [];
};

const writeInputData = async (items: InputDataItem[]): Promise<void> => {
  await fs.writeFile(inputDataPath, `${JSON.stringify(items, null, 2)}\n`);
};

export const appendInputData = async (
  data: InputDataItem
): Promise<InputDataItem[]> => {
  const items = await readInputData();
  const nextItems = [...items, data];

  await writeInputData(nextItems);

  return nextItems;
};
