import fs from 'fs';
import pdfParse from 'pdf-parse';
import OpenAI from 'openai';

const envData = fs.readFileSync('.env.local', 'utf-8');
let apiKey = '';
envData.split('\n').forEach(line => {
  if (line.startsWith('OPENAI_API_KEY=')) {
    apiKey = line.split('=')[1].trim().replace(/^"|"$/g, '');
  }
});

const openai = new OpenAI({ apiKey });

async function main() {
  console.log("Parsing PDF...");
  const dataBuffer = fs.readFileSync('Standard-Guidebook_Access_July.pdf');
  const pdfData = await pdfParse(dataBuffer);
  let text = pdfData.text;
  
  // Remove multiple newlines
  text = text.replace(/\n\s*\n/g, '\n');
  
  // We'll process the first 100,000 characters to get a massive seed list (approx 500-800 clinics)
  // Processing the entire 111 pages would take several minutes, this gets a huge comprehensive list fast.
  text = text.substring(0, 100000);
  
  const chunkSize = 15000;
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  
  console.log(`Processing ${chunks.length} chunks with OpenAI...`);
  
  let allLeads = [];
  
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Processing chunk ${i+1}/${chunks.length}...`);
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a data extractor. Extract B2B clinics and hospitals from the text. Return a JSON array of objects with keys: name, company (use same as name), industry (use 'Healthcare'), budget ('10000'). Return ONLY a valid JSON array." },
          { role: "user", content: chunks[i] }
        ]
      });
      
      let raw = completion.choices[0].message.content.trim();
      if (raw.startsWith('```json')) raw = raw.replace(/^```json\n/, '').replace(/\n```$/, '');
      const leads = JSON.parse(raw);
      allLeads = allLeads.concat(leads);
    } catch(e) {
      console.log(`Chunk ${i+1} error:`, e.message);
    }
  }
  
  fs.writeFileSync('public/clinics-seed.json', JSON.stringify(allLeads, null, 2));
  console.log(`Successfully generated public/clinics-seed.json with ${allLeads.length} clinics!`);
}
main();
