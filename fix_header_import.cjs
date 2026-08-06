const fs = require('fs');
let path = 'src/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/import { Flame, useState } from 'react';/, "import { useState } from 'react';");
code = code.replace(/Heart, Quote/g, 'Heart, Quote, Flame');

fs.writeFileSync(path, code);
