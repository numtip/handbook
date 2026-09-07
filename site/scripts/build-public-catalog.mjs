import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(scriptDirectory, '../../handbook-catalog-initial.csv');
const outputPath = resolve(scriptDirectory, '../public/data/manuals.csv');

function parseCsv(text) {
  const records = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"' && quoted && text[index + 1] === '"') {
      cell += character;
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      row.push(cell);
      if (row.some(Boolean)) records.push(row);
      row = [];
      cell = '';
    } else {
      cell += character;
    }
  }

  row.push(cell);
  if (row.some(Boolean)) records.push(row);
  return records;
}

function encodeCell(value) {
  const text = value ?? '';
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const lineEnding = process.platform === 'win32' ? '\r\n' : '\n';
const source = await readFile(sourcePath, 'utf8');
const [header, ...rows] = parseCsv(source);
const urlIndex = header.indexOf('ลิงก์ PDF');
const runtimeRows = rows.map((row) => [...row]);
const retainedLinks = runtimeRows.filter((row) => row[urlIndex]).length;
const output = [header, ...runtimeRows]
  .map((row) => row.map(encodeCell).join(','))
  .join(lineEnding) + lineEnding;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, output, 'utf8');
console.log(`Generated runtime catalog: ${runtimeRows.length} records, ${retainedLinks} source links.`);
