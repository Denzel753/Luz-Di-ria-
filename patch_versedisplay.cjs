const fs = require('fs');
let content = fs.readFileSync('src/components/VerseDisplay.tsx', 'utf8');

const oldScaleLogic = `      // Smart sizing: scale down long texts to prevent excessive line breaks (very vertical text)
      const textLen = verse.text.length;
      if (window.innerWidth < 640 && textLen > 100) {
        const lenScale = Math.max(0.6, Math.sqrt(100 / textLen));
        scale = Math.min(scale, lenScale);
      } else if (window.innerWidth >= 640 && textLen > 200) {
        const lenScale = Math.max(0.7, Math.sqrt(200 / textLen));
        scale = Math.min(scale, lenScale);
      }`;

const newScaleLogic = `      // Smart sizing: only scale down slightly for very long texts if they haven't been scaled by height,
      // allowing them to occupy more vertical space as requested.
      const textLen = verse.text.length;
      if (window.innerWidth < 640 && textLen > 150) {
        // Less aggressive scaling, rely more on height calculation
        const lenScale = Math.max(0.85, Math.sqrt(150 / textLen));
        scale = Math.min(scale, lenScale);
      } else if (window.innerWidth >= 640 && textLen > 300) {
        const lenScale = Math.max(0.9, Math.sqrt(300 / textLen));
        scale = Math.min(scale, lenScale);
      }`;

if (content.includes(oldScaleLogic)) {
  content = content.replace(oldScaleLogic, newScaleLogic);
  fs.writeFileSync('src/components/VerseDisplay.tsx', content);
  console.log("Updated dynamic scale logic");
} else {
  console.log("Could not find scale logic");
}
