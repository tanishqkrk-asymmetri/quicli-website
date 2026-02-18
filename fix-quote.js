const fs = require("fs");
const path = "components/quicli-landing.tsx";
let s = fs.readFileSync(path, "utf8");
// Curly apostrophe in "son's" is U+2019
const old = "\"For my son\u2019s fever, I didn't";
const new_ = "\"When my son had a fever, I didn't";
if (s.includes(old)) {
  s = s.replace(old, new_);
  fs.writeFileSync(path, s);
  console.log("Replaced");
} else {
  const idx = s.indexOf("For my son");
  if (idx >= 0) {
    const snippet = s.slice(idx, idx + 25);
    console.log("Snippet:", JSON.stringify(snippet));
    console.log(
      "Codes:",
      [...snippet].map((c) => c.charCodeAt(0)),
    );
  } else {
    console.log("Phrase not found");
  }
}
