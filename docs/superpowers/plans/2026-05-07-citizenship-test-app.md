# US Citizenship Test Practice App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack US Citizenship Test practice app with Education, Practice, and Audio modes, JWT auth, and MongoDB Atlas progress tracking.

**Architecture:** Express (port 5000) serves a React (Vite) build at the same endpoint. In dev, Vite proxies `/api/*` to Express. In production, Express serves `client/dist` as static files and falls through to `index.html` for all non-API routes.

**Tech Stack:** Node.js, Express, Mongoose, bcryptjs, jsonwebtoken, React 18, Vite, Material UI v5, axios, Web Speech API, concurrently.

---

## File Map

```
/
├── package.json                        <- root scripts (dev, build, start)
├── .env                                <- MONGODB_URI, JWT_SECRET, PORT
├── .gitignore
├── data/
│   └── questions.js                    <- all 100 Q&A + fakeAnswers (static)
├── server/
│   ├── index.js                        <- Express entry, static serving, DB connect
│   ├── middleware/
│   │   └── auth.js                     <- JWT verify middleware
│   ├── models/
│   │   ├── User.js                     <- Mongoose User schema
│   │   └── Progress.js                 <- Mongoose Progress schema
│   └── routes/
│       ├── auth.js                     <- POST /api/auth/register, /api/auth/login
│       ├── progress.js                 <- GET/PUT /api/progress + session endpoints
│       └── questions.js                <- GET /api/questions
└── client/
    ├── index.html
    ├── vite.config.js                  <- proxy /api -> :5000 in dev
    └── src/
        ├── main.jsx
        ├── App.jsx                     <- React Router routes
        ├── theme.js                    <- MUI soft color theme
        ├── api.js                      <- axios instance with auth header
        ├── context/
        │   └── AuthContext.jsx         <- JWT state, login/logout
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── EducationMode.jsx
            ├── PracticeMode.jsx
            └── AudioMode.jsx
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json` (root)
- Create: `client/` (via Vite scaffold)
- Create: `.env`
- Create: `.gitignore`

- [ ] **Step 1: Create root package.json**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
```

Create `package.json`:
```json
{
  "name": "citizenship-test",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "node server/index.js",
    "client": "cd client && npm run dev",
    "build": "cd client && npm run build",
    "start": "NODE_ENV=production node server/index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.3.1"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

- [ ] **Step 2: Install root dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Scaffold Vite React client**

```bash
npm create vite@latest client -- --template react
cd client
npm install
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material axios react-router-dom
cd ..
```

Expected: `client/src/` created with App.jsx, main.jsx.

- [ ] **Step 4: Create client/vite.config.js**

Replace `client/vite.config.js` with:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

- [ ] **Step 5: Create .env**

Create `.env` at project root:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/citizenship-test?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_long_random_secret_string
PORT=5000
```

> **Note:** Replace the MONGODB_URI with your actual MongoDB Atlas connection string before running.

- [ ] **Step 6: Create .gitignore**

Create `.gitignore`:
```
node_modules/
client/node_modules/
client/dist/
.env
```

- [ ] **Step 7: Create server directories**

```bash
mkdir -p server/routes server/models server/middleware data
```

- [ ] **Step 8: Commit scaffold**

```bash
git add package.json package-lock.json .gitignore client/vite.config.js client/package.json
git commit -m "feat: project scaffold — monorepo, Vite client, Express server"
```

---

## Task 2: Questions Data File

**Files:**
- Create: `data/questions.js`

- [ ] **Step 1: Create data/questions.js**

Create `data/questions.js` with all 100 civics Q&A and 5 fake answers per question:

```js
// All 100 USCIS civics questions. fakeAnswers: 5 wrong options for Practice/Audio modes.
const questions = [
  { id: 1, category: 'AMERICAN GOVERNMENT', section: 'A: Principles of American Democracy',
    question: 'What is the supreme law of the land?',
    answers: ['the Constitution'],
    fakeAnswers: ['the Declaration of Independence', 'the Bill of Rights', 'the Articles of Confederation', 'the Federalist Papers', 'the Magna Carta'] },
  { id: 2, category: 'AMERICAN GOVERNMENT', section: 'A: Principles of American Democracy',
    question: 'What does the Constitution do?',
    answers: ['sets up the government', 'defines the government', 'protects basic rights of Americans'],
    fakeAnswers: ['declares independence from Britain', 'establishes the military', 'creates the national currency', 'defines the electoral process', 'outlines foreign policy'] },
  { id: 3, category: 'AMERICAN GOVERNMENT', section: 'A: Principles of American Democracy',
    question: 'The idea of self-government is in the first three words of the Constitution. What are these words?',
    answers: ['We the People'],
    fakeAnswers: ['We the States', 'In God We', 'Life and Liberty', 'One Nation Indivisible', 'United We Stand'] },
  { id: 4, category: 'AMERICAN GOVERNMENT', section: 'A: Principles of American Democracy',
    question: 'What is an amendment?',
    answers: ['a change (to the Constitution)', 'an addition (to the Constitution)'],
    fakeAnswers: ['a presidential veto', 'a Supreme Court ruling', 'a congressional election', 'a type of federal law', 'a treaty with another country'] },
  { id: 5, category: 'AMERICAN GOVERNMENT', section: 'A: Principles of American Democracy',
    question: 'What do we call the first ten amendments to the Constitution?',
    answers: ['the Bill of Rights'],
    fakeAnswers: ['the Founding Principles', 'the Constitutional Amendments', 'the Federal Code', 'the Liberty Papers', 'the Rights Act'] },
  { id: 6, category: 'AMERICAN GOVERNMENT', section: 'A: Principles of American Democracy',
    question: 'What is one right or freedom from the First Amendment?',
    answers: ['speech', 'religion', 'assembly', 'press', 'petition the government'],
    fakeAnswers: ['right to bear arms', 'right to a fair trial', 'right to vote', 'right to education', 'right to privacy'] },
  { id: 7, category: 'AMERICAN GOVERNMENT', section: 'A: Principles of American Democracy',
    question: 'How many amendments does the Constitution have?',
    answers: ['twenty-seven (27)'],
    fakeAnswers: ['ten (10)', 'fifteen (15)', 'twenty (20)', 'thirty (30)', 'fifty (50)'] },
  { id: 8, category: 'AMERICAN GOVERNMENT', section: 'A: Principles of American Democracy',
    question: 'What did the Declaration of Independence do?',
    answers: ['announced our independence (from Great Britain)', 'declared our independence (from Great Britain)', 'said that the United States is free (from Great Britain)'],
    fakeAnswers: ['created the Constitution', 'ended the Civil War', 'established the Supreme Court', 'declared war on France', 'signed a peace treaty with Britain'] },
  { id: 9, category: 'AMERICAN GOVERNMENT', section: 'A: Principles of American Democracy',
    question: 'What are two rights in the Declaration of Independence?',
    answers: ['life', 'liberty', 'pursuit of happiness'],
    fakeAnswers: ['freedom and equality', 'justice and peace', 'freedom of speech and religion', 'happiness and wealth', 'justice and liberty'] },
  { id: 10, category: 'AMERICAN GOVERNMENT', section: 'A: Principles of American Democracy',
    question: 'What is freedom of religion?',
    answers: ['You can practice any religion, or not practice a religion.'],
    fakeAnswers: ['The government chooses the national religion.', 'Everyone must attend church.', 'Only one religion is allowed.', 'The President sets religious policy.', 'Religion is banned from public schools.'] },
  { id: 11, category: 'AMERICAN GOVERNMENT', section: 'A: Principles of American Democracy',
    question: 'What is the economic system in the United States?',
    answers: ['capitalist economy', 'market economy'],
    fakeAnswers: ['socialist economy', 'communist economy', 'monarchy economy', 'feudal economy', 'planned economy'] },
  { id: 12, category: 'AMERICAN GOVERNMENT', section: 'A: Principles of American Democracy',
    question: 'What is the "rule of law"?',
    answers: ['Everyone must follow the law.', 'Leaders must obey the law.', 'Government must obey the law.', 'No one is above the law.'],
    fakeAnswers: ['The President makes all the laws.', 'The military enforces the laws.', 'Congress can override any law.', 'Only judges can create laws.', 'The states make federal laws.'] },
  { id: 13, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Name one branch or part of the government.',
    answers: ['Congress', 'legislative', 'President', 'executive', 'the courts', 'judicial'],
    fakeAnswers: ['the Treasury', 'the FBI', 'the National Guard', 'the Electoral College', 'the Federal Reserve'] },
  { id: 14, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'What stops one branch of government from becoming too powerful?',
    answers: ['checks and balances', 'separation of powers'],
    fakeAnswers: ['the electoral college', 'the popular vote', 'the state legislatures', 'the national referendum', 'the Supreme Leader'] },
  { id: 15, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Who is in charge of the executive branch?',
    answers: ['the President'],
    fakeAnswers: ['the Supreme Court', 'the Speaker of the House', 'the Senate Majority Leader', 'the Chief Justice', 'Congress'] },
  { id: 16, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Who makes federal laws?',
    answers: ['Congress', 'Senate and House (of Representatives)', '(U.S. or national) legislature'],
    fakeAnswers: ['the President', 'the Supreme Court', 'the Governor', 'the Electoral College', 'state legislatures'] },
  { id: 17, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'What are the two parts of the U.S. Congress?',
    answers: ['the Senate and House (of Representatives)'],
    fakeAnswers: ['the President and Vice President', 'the Supreme Court and Congress', 'the House and the Cabinet', 'the Senate and the Cabinet', 'the House and the Electoral College'] },
  { id: 18, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'How many U.S. Senators are there?',
    answers: ['one hundred (100)'],
    fakeAnswers: ['fifty (50)', 'seventy-five (75)', 'two hundred (200)', 'four hundred thirty-five (435)', 'twenty-seven (27)'] },
  { id: 19, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'We elect a U.S. Senator for how many years?',
    answers: ['six (6)'],
    fakeAnswers: ['two (2)', 'four (4)', 'eight (8)', 'ten (10)', 'for life'] },
  { id: 20, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: "Who is one of your state's U.S. Senators now?",
    answers: ['Answers will vary.'],
    fakeAnswers: ['The President', 'The Governor', 'The Speaker of the House', 'The Chief Justice', 'The Secretary of State'] },
  { id: 21, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'The House of Representatives has how many voting members?',
    answers: ['four hundred thirty-five (435)'],
    fakeAnswers: ['one hundred (100)', 'two hundred (200)', 'three hundred (300)', 'five hundred (500)', 'fifty (50)'] },
  { id: 22, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'We elect a U.S. Representative for how many years?',
    answers: ['two (2)'],
    fakeAnswers: ['four (4)', 'six (6)', 'eight (8)', 'ten (10)', 'one (1)'] },
  { id: 23, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Name your U.S. Representative.',
    answers: ['Answers will vary.'],
    fakeAnswers: ['The Governor', 'The President', 'The State Senator', 'The Mayor', 'The Secretary of Defense'] },
  { id: 24, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Who does a U.S. Senator represent?',
    answers: ['all people of the state'],
    fakeAnswers: ['only voters in their district', 'the President', 'the Supreme Court', 'only party members', 'the federal government'] },
  { id: 25, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Why do some states have more Representatives than other states?',
    answers: ["(because of) the state's population", '(because) they have more people', '(because) some states have more people'],
    fakeAnswers: ["because of the state's size in land area", "because of the state's wealth", "because of how long they've been a state", "because of the state's military bases", 'because of the number of cities'] },
  { id: 26, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'We elect a President for how many years?',
    answers: ['four (4)'],
    fakeAnswers: ['two (2)', 'six (6)', 'eight (8)', 'ten (10)', 'three (3)'] },
  { id: 27, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'In what month do we vote for President?',
    answers: ['November'],
    fakeAnswers: ['October', 'September', 'January', 'March', 'December'] },
  { id: 28, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'What is the name of the President of the United States now?',
    answers: ['Visit uscis.gov/citizenship/testupdates for the name of the President of the United States.'],
    fakeAnswers: ['George Washington', 'Abraham Lincoln', 'Thomas Jefferson', 'John Adams', 'Franklin Roosevelt'] },
  { id: 29, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'What is the name of the Vice President of the United States now?',
    answers: ['Visit uscis.gov/citizenship/testupdates for the name of the Vice President of the United States.'],
    fakeAnswers: ['George Washington', 'Thomas Jefferson', 'John Adams', 'Benjamin Franklin', 'Alexander Hamilton'] },
  { id: 30, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'If the President can no longer serve, who becomes President?',
    answers: ['the Vice President'],
    fakeAnswers: ['the Speaker of the House', 'the Secretary of State', 'the Senate Majority Leader', 'the Chief Justice', 'the Attorney General'] },
  { id: 31, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'If both the President and the Vice President can no longer serve, who becomes President?',
    answers: ['the Speaker of the House'],
    fakeAnswers: ['the Senate Majority Leader', 'the Chief Justice', 'the Secretary of State', 'the Attorney General', 'the Secretary of Defense'] },
  { id: 32, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Who is the Commander in Chief of the military?',
    answers: ['the President'],
    fakeAnswers: ['the Secretary of Defense', 'the Chairman of the Joint Chiefs', 'the Senate Armed Services Committee', 'the Speaker of the House', 'the Vice President'] },
  { id: 33, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Who signs bills to become laws?',
    answers: ['the President'],
    fakeAnswers: ['Congress', 'the Supreme Court', 'the Vice President', 'the Senate Majority Leader', 'the Speaker of the House'] },
  { id: 34, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Who vetoes bills?',
    answers: ['the President'],
    fakeAnswers: ['the Supreme Court', 'Congress', 'the Speaker of the House', 'the Senate Majority Leader', 'the Chief Justice'] },
  { id: 35, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: "What does the President's Cabinet do?",
    answers: ['advises the President'],
    fakeAnswers: ['makes federal laws', 'signs treaties', 'elects the Vice President', 'controls the military budget', 'manages the national debt'] },
  { id: 36, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'What are two Cabinet-level positions?',
    answers: ['Secretary of Agriculture', 'Secretary of Commerce', 'Secretary of Defense', 'Secretary of Education', 'Secretary of Energy', 'Secretary of Health and Human Services', 'Secretary of Homeland Security', 'Secretary of Housing and Urban Development', 'Secretary of the Interior', 'Secretary of Labor', 'Secretary of State', 'Secretary of Transportation', 'Secretary of the Treasury', 'Secretary of Veterans Affairs', 'Attorney General', 'Vice President'],
    fakeAnswers: ['Chief Justice and Speaker of the House', 'President and Senate Majority Leader', 'Mayor and Governor', 'State Senator and Representative', 'Sheriff and Police Chief'] },
  { id: 37, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'What does the judicial branch do?',
    answers: ['reviews laws', 'explains laws', 'resolves disputes (disagreements)', 'decides if a law goes against the Constitution'],
    fakeAnswers: ['makes laws', 'collects taxes', 'commands the military', 'runs elections', 'manages foreign policy'] },
  { id: 38, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'What is the highest court in the United States?',
    answers: ['the Supreme Court'],
    fakeAnswers: ['the Court of Appeals', 'the District Court', 'the Federal Court', 'the State Supreme Court', 'the Constitutional Court'] },
  { id: 39, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'How many justices are on the Supreme Court?',
    answers: ['Visit uscis.gov/citizenship/testupdates for the number of justices on the Supreme Court.'],
    fakeAnswers: ['five (5)', 'seven (7)', 'eleven (11)', 'thirteen (13)', 'three (3)'] },
  { id: 40, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Who is the Chief Justice of the United States now?',
    answers: ['Visit uscis.gov/citizenship/testupdates for the name of the Chief Justice of the United States.'],
    fakeAnswers: ['John Adams', 'Abraham Lincoln', 'Benjamin Franklin', 'George Washington', 'Thomas Jefferson'] },
  { id: 41, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Under our Constitution, some powers belong to the federal government. What is one power of the federal government?',
    answers: ['to print money', 'to declare war', 'to create an army', 'to make treaties'],
    fakeAnswers: ["to issue driver's licenses", 'to approve zoning', 'to run local police departments', 'to manage state parks', 'to set local property taxes'] },
  { id: 42, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Under our Constitution, some powers belong to the states. What is one power of the states?',
    answers: ['provide schooling and education', 'provide protection (police)', 'provide safety (fire departments)', "give a driver's license", 'approve zoning and land use'],
    fakeAnswers: ['to print money', 'to declare war', 'to create an army', 'to make treaties with foreign countries', 'to regulate international trade'] },
  { id: 43, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'Who is the Governor of your state now?',
    answers: ['Answers will vary.'],
    fakeAnswers: ['The President', 'The Mayor', 'The U.S. Senator', 'The Chief Justice', 'The Secretary of State'] },
  { id: 44, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'What is the capital of your state?',
    answers: ['Answers will vary.'],
    fakeAnswers: ['Washington D.C.', 'New York City', 'Los Angeles', 'Chicago', 'Houston'] },
  { id: 45, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'What are the two major political parties in the United States?',
    answers: ['Democratic and Republican'],
    fakeAnswers: ['Republican and Libertarian', 'Democratic and Independent', 'Federalist and Anti-Federalist', 'Whig and Democrat', 'Progressive and Conservative'] },
  { id: 46, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'What is the political party of the President now?',
    answers: ['Visit uscis.gov/citizenship/testupdates for the political party of the President.'],
    fakeAnswers: ['the Federalist Party', 'the Whig Party', 'the Progressive Party', 'the Independence Party', 'the Liberty Party'] },
  { id: 47, category: 'AMERICAN GOVERNMENT', section: 'B: System of Government',
    question: 'What is the name of the Speaker of the House of Representatives now?',
    answers: ['Visit uscis.gov/citizenship/testupdates for the name of the Speaker of the House of Representatives.'],
    fakeAnswers: ['The President', 'The Vice President', 'The Senate Majority Leader', 'The Chief Justice', 'The Secretary of State'] },
  { id: 48, category: 'AMERICAN GOVERNMENT', section: 'C: Rights and Responsibilities',
    question: 'There are four amendments to the Constitution about who can vote. Describe one of them.',
    answers: ['Citizens eighteen (18) and older (can vote).', "You don't have to pay (a poll tax) to vote.", 'Any citizen can vote. (Women and men can vote.)', 'A male citizen of any race (can vote).'],
    fakeAnswers: ['Only landowners can vote.', 'Only men over 25 can vote.', 'Only people born in the U.S. can vote.', 'Voting requires a literacy test.', 'Only taxpayers can vote.'] },
  { id: 49, category: 'AMERICAN GOVERNMENT', section: 'C: Rights and Responsibilities',
    question: 'What is one responsibility that is only for United States citizens?',
    answers: ['serve on a jury', 'vote in a federal election'],
    fakeAnswers: ['pay taxes', 'obey the law', 'attend school', 'register for Selective Service', "respect others' rights"] },
  { id: 50, category: 'AMERICAN GOVERNMENT', section: 'C: Rights and Responsibilities',
    question: 'Name one right only for United States citizens.',
    answers: ['vote in a federal election', 'run for federal office'],
    fakeAnswers: ['freedom of speech', 'freedom of religion', 'the right to own property', 'freedom of the press', 'the right to a fair trial'] },
  { id: 51, category: 'AMERICAN GOVERNMENT', section: 'C: Rights and Responsibilities',
    question: 'What are two rights of everyone living in the United States?',
    answers: ['freedom of expression', 'freedom of speech', 'freedom of assembly', 'freedom to petition the government', 'freedom of religion', 'the right to bear arms'],
    fakeAnswers: ['the right to vote and hold office', 'the right to citizenship and a passport', 'the right to welfare and free education', 'the right to drive and own a gun', 'free healthcare and housing'] },
  { id: 52, category: 'AMERICAN GOVERNMENT', section: 'C: Rights and Responsibilities',
    question: 'What do we show loyalty to when we say the Pledge of Allegiance?',
    answers: ['the United States', 'the flag'],
    fakeAnswers: ['the President', 'the Constitution', 'the Declaration of Independence', 'the Congress', 'the Supreme Court'] },
  { id: 53, category: 'AMERICAN GOVERNMENT', section: 'C: Rights and Responsibilities',
    question: 'What is one promise you make when you become a United States citizen?',
    answers: ['give up loyalty to other countries', 'defend the Constitution and laws of the United States', 'obey the laws of the United States', 'serve in the U.S. military (if needed)', 'serve (do important work for) the nation (if needed)', 'be loyal to the United States'],
    fakeAnswers: ['give up your right to vote', 'never travel abroad', 'pay a citizenship tax every year', 'surrender your foreign passport immediately', 'apply for a new Social Security number'] },
  { id: 54, category: 'AMERICAN GOVERNMENT', section: 'C: Rights and Responsibilities',
    question: 'How old do citizens have to be to vote for President?',
    answers: ['eighteen (18) and older'],
    fakeAnswers: ['sixteen (16)', 'twenty-one (21)', 'twenty-five (25)', 'thirty (30)', 'fourteen (14)'] },
  { id: 55, category: 'AMERICAN GOVERNMENT', section: 'C: Rights and Responsibilities',
    question: 'What are two ways that Americans can participate in their democracy?',
    answers: ['vote', 'join a political party', 'help with a campaign', 'join a civic group', 'join a community group', 'give an elected official your opinion on an issue', 'call Senators and Representatives', 'publicly support or oppose an issue or policy', 'run for office', 'write to a newspaper'],
    fakeAnswers: ['pay taxes and obey laws', 'work and pay rent', 'watch the news and stay informed', 'attend school and get a job', 'buy American products'] },
  { id: 56, category: 'AMERICAN GOVERNMENT', section: 'C: Rights and Responsibilities',
    question: 'When is the last day you can send in federal income tax forms?',
    answers: ['April 15'],
    fakeAnswers: ['March 15', 'January 1', 'December 31', 'February 28', 'May 1'] },
  { id: 57, category: 'AMERICAN GOVERNMENT', section: 'C: Rights and Responsibilities',
    question: 'When must all men register for the Selective Service?',
    answers: ['at age eighteen (18)', 'between eighteen (18) and twenty-six (26)'],
    fakeAnswers: ['at age 16', 'at age 21', 'at age 25', 'at age 30', 'at age 13'] },
  { id: 58, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'What is one reason colonists came to America?',
    answers: ['freedom', 'political liberty', 'religious freedom', 'economic opportunity', 'practice their religion', 'escape persecution'],
    fakeAnswers: ['to escape debt collectors', 'to find gold in California', 'to trade with Native Americans', 'to establish a monarchy', 'to conquer new territory for Britain'] },
  { id: 59, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'Who lived in America before the Europeans arrived?',
    answers: ['American Indians', 'Native Americans'],
    fakeAnswers: ['the Pilgrims', 'the British colonists', 'the Puritans', 'the Spanish settlers', 'the French explorers'] },
  { id: 60, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'What group of people was taken to America and sold as slaves?',
    answers: ['Africans', 'people from Africa'],
    fakeAnswers: ['Irish immigrants', 'Chinese laborers', 'Native Americans', 'Jewish refugees', 'German prisoners of war'] },
  { id: 61, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'Why did the colonists fight the British?',
    answers: ['because of high taxes (taxation without representation)', 'because the British army stayed in their houses (boarding, quartering)', "because they didn't have self-government"],
    fakeAnswers: ['because of religious differences with Britain', 'because they wanted to expand westward', 'because of a trade dispute with France', 'because the British invaded Canada', 'because of conflicts over Native American lands'] },
  { id: 62, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'Who wrote the Declaration of Independence?',
    answers: ['(Thomas) Jefferson'],
    fakeAnswers: ['George Washington', 'Benjamin Franklin', 'Alexander Hamilton', 'John Adams', 'James Madison'] },
  { id: 63, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'When was the Declaration of Independence adopted?',
    answers: ['July 4, 1776'],
    fakeAnswers: ['July 4, 1789', 'July 4, 1783', 'July 4, 1787', 'July 4, 1812', 'July 4, 1800'] },
  { id: 64, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'There were 13 original states. Name three.',
    answers: ['New Hampshire', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New York', 'New Jersey', 'Pennsylvania', 'Delaware', 'Maryland', 'Virginia', 'North Carolina', 'South Carolina', 'Georgia'],
    fakeAnswers: ['California, Texas, and Florida', 'New York, Ohio, and Michigan', 'Alabama, Georgia, and Mississippi', 'Arizona, Nevada, and Utah', 'Hawaii, Alaska, and Oregon'] },
  { id: 65, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'What happened at the Constitutional Convention?',
    answers: ['The Constitution was written.', 'The Founding Fathers wrote the Constitution.'],
    fakeAnswers: ['The colonists declared independence from Britain.', 'The Civil War ended.', 'The President was elected for the first time.', 'The Supreme Court was founded.', 'The Declaration of Independence was signed.'] },
  { id: 66, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'When was the Constitution written?',
    answers: ['1787'],
    fakeAnswers: ['1776', '1812', '1865', '1783', '1800'] },
  { id: 67, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'The Federalist Papers supported the passage of the U.S. Constitution. Name one of the writers.',
    answers: ['(James) Madison', '(Alexander) Hamilton', '(John) Jay', 'Publius'],
    fakeAnswers: ['George Washington', 'John Adams', 'Thomas Jefferson', 'Patrick Henry', 'Samuel Adams'] },
  { id: 68, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'What is one thing Benjamin Franklin is famous for?',
    answers: ['U.S. diplomat', 'oldest member of the Constitutional Convention', 'first Postmaster General of the United States', 'writer of "Poor Richard\'s Almanac"', 'started the first free libraries'],
    fakeAnswers: ['He was the first President.', 'He wrote the Constitution alone.', 'He led the Continental Army.', 'He discovered penicillin.', 'He founded the Supreme Court.'] },
  { id: 69, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'Who is the "Father of Our Country"?',
    answers: ['(George) Washington'],
    fakeAnswers: ['Thomas Jefferson', 'Benjamin Franklin', 'John Adams', 'Alexander Hamilton', 'James Madison'] },
  { id: 70, category: 'AMERICAN HISTORY', section: 'A: Colonial Period and Independence',
    question: 'Who was the first President?',
    answers: ['(George) Washington'],
    fakeAnswers: ['Thomas Jefferson', 'Benjamin Franklin', 'John Adams', 'James Madison', 'Alexander Hamilton'] },
  { id: 71, category: 'AMERICAN HISTORY', section: 'B: 1800s',
    question: 'What territory did the United States buy from France in 1803?',
    answers: ['the Louisiana Territory', 'Louisiana'],
    fakeAnswers: ['the Oregon Territory', 'the Texas Territory', 'the California Territory', 'the Florida Territory', 'the Alaska Territory'] },
  { id: 72, category: 'AMERICAN HISTORY', section: 'B: 1800s',
    question: 'Name one war fought by the United States in the 1800s.',
    answers: ['War of 1812', 'Mexican-American War', 'Civil War', 'Spanish-American War'],
    fakeAnswers: ['World War I', 'World War II', 'the Korean War', 'the Vietnam War', 'the Gulf War'] },
  { id: 73, category: 'AMERICAN HISTORY', section: 'B: 1800s',
    question: 'Name the U.S. war between the North and the South.',
    answers: ['the Civil War', 'the War between the States'],
    fakeAnswers: ['the Revolutionary War', 'World War I', 'the War of 1812', 'the Mexican-American War', 'the Spanish-American War'] },
  { id: 74, category: 'AMERICAN HISTORY', section: 'B: 1800s',
    question: 'Name one problem that led to the Civil War.',
    answers: ['slavery', 'economic reasons', "states' rights"],
    fakeAnswers: ['the invasion of Canada by Britain', 'a trade dispute with France', 'the Spanish colonization of Florida', 'a conflict over the Louisiana Purchase', 'the annexation of Mexico'] },
  { id: 75, category: 'AMERICAN HISTORY', section: 'B: 1800s',
    question: 'What was one important thing that Abraham Lincoln did?',
    answers: ['freed the slaves (Emancipation Proclamation)', 'saved (or preserved) the Union', 'led the United States during the Civil War'],
    fakeAnswers: ['He wrote the Declaration of Independence.', 'He led the American Revolution.', 'He founded the Democratic Party.', 'He built the transcontinental railroad alone.', 'He created the Supreme Court.'] },
  { id: 76, category: 'AMERICAN HISTORY', section: 'B: 1800s',
    question: 'What did the Emancipation Proclamation do?',
    answers: ['freed the slaves', 'freed slaves in the Confederacy', 'freed slaves in the Confederate states', 'freed slaves in most Southern states'],
    fakeAnswers: ['ended the Civil War', 'gave women the right to vote', 'established the income tax', 'created the national park system', 'founded the Republican Party'] },
  { id: 77, category: 'AMERICAN HISTORY', section: 'B: 1800s',
    question: 'What did Susan B. Anthony do?',
    answers: ["fought for women's rights", 'fought for civil rights'],
    fakeAnswers: ['She was the first woman President.', 'She led the Civil War.', 'She wrote the Bill of Rights.', 'She was the first female Supreme Court Justice.', 'She founded the Democratic Party.'] },
  { id: 78, category: 'AMERICAN HISTORY', section: 'C: Recent American History and Other Important Historical Information',
    question: 'Name one war fought by the United States in the 1900s.',
    answers: ['World War I', 'World War II', 'Korean War', 'Vietnam War', '(Persian) Gulf War'],
    fakeAnswers: ['the Civil War', 'the Revolutionary War', 'the War of 1812', 'the Mexican-American War', 'the French and Indian War'] },
  { id: 79, category: 'AMERICAN HISTORY', section: 'C: Recent American History and Other Important Historical Information',
    question: 'Who was President during World War I?',
    answers: ['(Woodrow) Wilson'],
    fakeAnswers: ['Abraham Lincoln', 'Theodore Roosevelt', 'Franklin Roosevelt', 'Herbert Hoover', 'Harry Truman'] },
  { id: 80, category: 'AMERICAN HISTORY', section: 'C: Recent American History and Other Important Historical Information',
    question: 'Who was President during the Great Depression and World War II?',
    answers: ['(Franklin) Roosevelt'],
    fakeAnswers: ['Abraham Lincoln', 'Woodrow Wilson', 'Herbert Hoover', 'Harry Truman', 'Dwight Eisenhower'] },
  { id: 81, category: 'AMERICAN HISTORY', section: 'C: Recent American History and Other Important Historical Information',
    question: 'Who did the United States fight in World War II?',
    answers: ['Japan, Germany, and Italy'],
    fakeAnswers: ['Russia, China, and Korea', 'France, Spain, and Portugal', 'China, Vietnam, and Korea', 'Britain, Canada, and Australia', 'Mexico, Cuba, and Argentina'] },
  { id: 82, category: 'AMERICAN HISTORY', section: 'C: Recent American History and Other Important Historical Information',
    question: 'Before he was President, Eisenhower was a general. What war was he in?',
    answers: ['World War II'],
    fakeAnswers: ['the Korean War', 'the Vietnam War', 'the Civil War', 'World War I', 'the Spanish-American War'] },
  { id: 83, category: 'AMERICAN HISTORY', section: 'C: Recent American History and Other Important Historical Information',
    question: 'During the Cold War, what was the main concern of the United States?',
    answers: ['Communism'],
    fakeAnswers: ['nuclear war with China', 'the spread of democracy in Africa', 'trade wars with Europe', 'civil rights in America', 'colonization of South America'] },
  { id: 84, category: 'AMERICAN HISTORY', section: 'C: Recent American History and Other Important Historical Information',
    question: 'What movement tried to end racial discrimination?',
    answers: ['civil rights (movement)'],
    fakeAnswers: ["the Women's Suffrage Movement", 'the Labor Movement', 'the Progressive Movement', 'the Temperance Movement', 'the Environmental Movement'] },
  { id: 85, category: 'AMERICAN HISTORY', section: 'C: Recent American History and Other Important Historical Information',
    question: 'What did Martin Luther King, Jr. do?',
    answers: ['fought for civil rights', 'worked for equality for all Americans'],
    fakeAnswers: ['He was the first Black President.', 'He led the American Revolution.', 'He wrote the Civil Rights Act alone.', 'He founded the NAACP.', 'He signed the Emancipation Proclamation.'] },
  { id: 86, category: 'AMERICAN HISTORY', section: 'C: Recent American History and Other Important Historical Information',
    question: 'What major event happened on September 11, 2001, in the United States?',
    answers: ['Terrorists attacked the United States.'],
    fakeAnswers: ['A hurricane hit New York City.', 'The United States invaded Iraq.', 'A major financial crisis began.', 'The Space Shuttle Columbia crashed.', 'An earthquake destroyed San Francisco.'] },
  { id: 87, category: 'AMERICAN HISTORY', section: 'C: Recent American History and Other Important Historical Information',
    question: 'Name one American Indian tribe in the United States.',
    answers: ['Cherokee', 'Navajo', 'Sioux', 'Chippewa', 'Choctaw', 'Pueblo', 'Apache', 'Iroquois', 'Creek', 'Blackfeet', 'Seminole', 'Cheyenne', 'Arawak', 'Shawnee', 'Mohegan', 'Huron', 'Oneida', 'Lakota', 'Crow', 'Teton', 'Hopi', 'Inuit'],
    fakeAnswers: ['the Aztecs', 'the Mayans', 'the Incas', 'the Caribs', 'the Olmecs'] },
  { id: 88, category: 'INTEGRATED CIVICS', section: 'A: Geography',
    question: 'Name one of the two longest rivers in the United States.',
    answers: ['Missouri (River)', 'Mississippi (River)'],
    fakeAnswers: ['the Colorado River', 'the Hudson River', 'the Ohio River', 'the Potomac River', 'the Snake River'] },
  { id: 89, category: 'INTEGRATED CIVICS', section: 'A: Geography',
    question: 'What ocean is on the West Coast of the United States?',
    answers: ['Pacific (Ocean)'],
    fakeAnswers: ['the Atlantic Ocean', 'the Arctic Ocean', 'the Indian Ocean', 'the Southern Ocean', 'the Caribbean Sea'] },
  { id: 90, category: 'INTEGRATED CIVICS', section: 'A: Geography',
    question: 'What ocean is on the East Coast of the United States?',
    answers: ['Atlantic (Ocean)'],
    fakeAnswers: ['the Pacific Ocean', 'the Arctic Ocean', 'the Indian Ocean', 'the Gulf of Mexico', 'the Caribbean Sea'] },
  { id: 91, category: 'INTEGRATED CIVICS', section: 'A: Geography',
    question: 'Name one U.S. territory.',
    answers: ['Puerto Rico', 'U.S. Virgin Islands', 'American Samoa', 'Northern Mariana Islands', 'Guam'],
    fakeAnswers: ['Hawaii', 'Alaska', 'Oregon', 'Cuba', 'Canada'] },
  { id: 92, category: 'INTEGRATED CIVICS', section: 'A: Geography',
    question: 'Name one state that borders Canada.',
    answers: ['Maine', 'New Hampshire', 'Vermont', 'New York', 'Pennsylvania', 'Ohio', 'Michigan', 'Minnesota', 'North Dakota', 'Montana', 'Idaho', 'Washington', 'Alaska'],
    fakeAnswers: ['California', 'Texas', 'Florida', 'Georgia', 'Virginia'] },
  { id: 93, category: 'INTEGRATED CIVICS', section: 'A: Geography',
    question: 'Name one state that borders Mexico.',
    answers: ['California', 'Arizona', 'New Mexico', 'Texas'],
    fakeAnswers: ['New York', 'Oregon', 'Alaska', 'Montana', 'Colorado'] },
  { id: 94, category: 'INTEGRATED CIVICS', section: 'A: Geography',
    question: 'What is the capital of the United States?',
    answers: ['Washington, D.C.'],
    fakeAnswers: ['New York City', 'Los Angeles', 'Philadelphia', 'Boston', 'Chicago'] },
  { id: 95, category: 'INTEGRATED CIVICS', section: 'A: Geography',
    question: 'Where is the Statue of Liberty?',
    answers: ['New York (Harbor)', 'Liberty Island'],
    fakeAnswers: ['Washington D.C.', 'Philadelphia', 'Boston', 'Miami', 'Chicago'] },
  { id: 96, category: 'INTEGRATED CIVICS', section: 'B: Symbols',
    question: 'Why does the flag have 13 stripes?',
    answers: ['because there were 13 original colonies', 'because the stripes represent the original colonies'],
    fakeAnswers: ['because there are 13 Supreme Court justices', 'because there are 13 months in the colonial calendar', 'because the flag was designed by 13 people', 'because of the 13 Articles of Confederation', 'because 13 soldiers died in the Revolution'] },
  { id: 97, category: 'INTEGRATED CIVICS', section: 'B: Symbols',
    question: 'Why does the flag have 50 stars?',
    answers: ['because there is one star for each state', 'because each star represents a state', 'because there are 50 states'],
    fakeAnswers: ['because there are 50 senators', 'because there are 50 founding fathers', 'because the flag was made in 1950', 'because there are 50 amendments', 'because there are 50 federal laws'] },
  { id: 98, category: 'INTEGRATED CIVICS', section: 'B: Symbols',
    question: 'What is the name of the national anthem?',
    answers: ['The Star-Spangled Banner'],
    fakeAnswers: ['"God Bless America"', '"America the Beautiful"', '"My Country \'Tis of Thee"', '"Yankee Doodle"', '"The Stars and Stripes Forever"'] },
  { id: 99, category: 'INTEGRATED CIVICS', section: 'C: Holidays',
    question: 'When do we celebrate Independence Day?',
    answers: ['July 4'],
    fakeAnswers: ['July 14', 'June 4', 'September 17', 'November 11', 'January 1'] },
  { id: 100, category: 'INTEGRATED CIVICS', section: 'C: Holidays',
    question: 'Name two national U.S. holidays.',
    answers: ["New Year's Day", 'Martin Luther King, Jr. Day', "Presidents' Day", 'Memorial Day', 'Independence Day', 'Labor Day', 'Columbus Day', 'Veterans Day', 'Thanksgiving', 'Christmas'],
    fakeAnswers: ['Easter and Halloween', 'Super Bowl Sunday and Thanksgiving', "Valentine's Day and St. Patrick's Day", "April Fools' Day and Labor Day", 'Groundhog Day and Columbus Day'] },
];

module.exports = questions;
```

- [ ] **Step 2: Verify data file**

```bash
node -e "const q = require('./data/questions'); console.log('Total:', q.length); console.log('Q1:', q[0].question); console.log('Q100:', q[99].question);"
```

Expected:
```
Total: 100
Q1: What is the supreme law of the land?
Q100: Name two national U.S. holidays.
```

- [ ] **Step 3: Commit**

```bash
git add data/questions.js
git commit -m "feat: 100 civics Q&A with fake answers for practice/audio modes"
```

---

## Task 3: Express Server + MongoDB

**Files:**
- Create: `server/index.js`
- Create: `server/routes/auth.js` (stub)
- Create: `server/routes/questions.js` (stub)
- Create: `server/routes/progress.js` (stub)

- [ ] **Step 1: Create server/index.js**

```js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/progress', require('./routes/progress'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
```

- [ ] **Step 2: Create route stubs**

`server/routes/auth.js`:
```js
const router = require('express').Router();
module.exports = router;
```

`server/routes/questions.js`:
```js
const router = require('express').Router();
module.exports = router;
```

`server/routes/progress.js`:
```js
const router = require('express').Router();
module.exports = router;
```

- [ ] **Step 3: Verify server starts (requires real MONGODB_URI in .env)**

```bash
node server/index.js
# Expected: "MongoDB connected" then "Server running on port 5000"
# Ctrl+C to stop
```

- [ ] **Step 4: Commit**

```bash
git add server/
git commit -m "feat: Express server with MongoDB connection"
```

---

## Task 4: User Model + Auth Middleware + Auth Routes

**Files:**
- Create: `server/models/User.js`
- Create: `server/middleware/auth.js`
- Modify: `server/routes/auth.js`

- [ ] **Step 1: Create server/models/User.js**

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
```

- [ ] **Step 2: Create server/middleware/auth.js**

```js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
```

- [ ] **Step 3: Implement server/routes/auth.js**

```js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
```

- [ ] **Step 4: Test auth routes**

Start server (`node server/index.js &`), then:

```bash
# Register
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}' | python3 -m json.tool
```

Expected: `{ "token": "...", "user": { "name": "Test User", ... } }`

```bash
# Login
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | python3 -m json.tool
```

Expected: `{ "token": "...", "user": { ... } }`

- [ ] **Step 5: Commit**

```bash
git add server/models/User.js server/middleware/auth.js server/routes/auth.js
git commit -m "feat: User model, JWT middleware, register/login routes"
```

---

## Task 5: Progress Model + Routes

**Files:**
- Create: `server/models/Progress.js`
- Modify: `server/routes/progress.js`

- [ ] **Step 1: Create server/models/Progress.js**

```js
const mongoose = require('mongoose');

const practiceSessionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  score: Number,
  total: Number,
  passed: Boolean,
  questionIds: [Number],
});

const audioSessionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  score: Number,
  total: Number,
  passed: Boolean,
});

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  education: {
    lastQuestionIndex: { type: Number, default: 0 },
    completedSections: { type: [String], default: [] },
  },
  practice: {
    sessions: { type: [practiceSessionSchema], default: [] },
  },
  audio: {
    sessions: { type: [audioSessionSchema], default: [] },
  },
});

module.exports = mongoose.model('Progress', progressSchema);
```

- [ ] **Step 2: Implement server/routes/progress.js**

```js
const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const Progress = require('../models/Progress');

router.get('/', authMiddleware, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  const { education, practice, audio } = req.body;
  try {
    const update = {};
    if (education !== undefined) update.education = education;
    if (practice !== undefined) update.practice = practice;
    if (audio !== undefined) update.audio = audio;
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/practice/session', authMiddleware, async (req, res) => {
  const { score, total, passed, questionIds } = req.body;
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $push: { 'practice.sessions': { score, total, passed, questionIds } } },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/audio/session', authMiddleware, async (req, res) => {
  const { score, total, passed } = req.body;
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $push: { 'audio.sessions': { score, total, passed } } },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
```

- [ ] **Step 3: Commit**

```bash
git add server/models/Progress.js server/routes/progress.js
git commit -m "feat: Progress model with education/practice/audio tracking"
```

---

## Task 6: Questions Route

**Files:**
- Modify: `server/routes/questions.js`

- [ ] **Step 1: Implement server/routes/questions.js**

```js
const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const questions = require('../../data/questions');

router.get('/', authMiddleware, (req, res) => {
  res.json(questions);
});

module.exports = router;
```

- [ ] **Step 2: Test**

With server running and a valid token:
```bash
TOKEN="<paste token from login curl>"
curl -s "http://localhost:5000/api/questions" \
  -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; q=json.load(sys.stdin); print('Count:', len(q))"
```

Expected: `Count: 100`

- [ ] **Step 3: Commit**

```bash
git add server/routes/questions.js
git commit -m "feat: questions route — serves all 100 Q&A (auth required)"
```

---

## Task 7: React App Shell — Theme + Routing

**Files:**
- Modify: `client/index.html`
- Create: `client/src/theme.js`
- Modify: `client/src/main.jsx`
- Modify: `client/src/App.jsx`
- Create: stubs for all pages and context

- [ ] **Step 1: Replace client/index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>US Citizenship Test Practice</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create client/src/theme.js**

```js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f0f2ff', paper: '#ffffff' },
    primary: { main: '#6366f1', dark: '#3730a3', light: '#a5b4fc', contrastText: '#ffffff' },
    secondary: { main: '#10b981', dark: '#065f46', light: '#6ee7b7', contrastText: '#ffffff' },
    success: { main: '#10b981' },
    error: { main: '#f43f5e' },
    text: { primary: '#1e1b4b', secondary: '#6b7280' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: '0 4px 20px rgba(99,102,241,0.08)', borderRadius: 16 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 12, textTransform: 'none', fontWeight: 600 } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 12 } } } },
  },
});

export default theme;
```

- [ ] **Step 3: Replace client/src/main.jsx**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 4: Replace client/src/App.jsx**

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EducationMode from './pages/EducationMode';
import PracticeMode from './pages/PracticeMode';
import AudioMode from './pages/AudioMode';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/education" element={<ProtectedRoute><EducationMode /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><PracticeMode /></ProtectedRoute>} />
      <Route path="/audio" element={<ProtectedRoute><AudioMode /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

- [ ] **Step 5: Create stub files so app compiles**

`client/src/context/AuthContext.jsx`:
```jsx
import { createContext, useContext } from 'react';
export const AuthContext = createContext(null);
export function AuthProvider({ children }) { return <AuthContext.Provider value={{ token: null }}>{children}</AuthContext.Provider>; }
export function useAuth() { return useContext(AuthContext); }
```

`client/src/pages/Login.jsx`:
```jsx
export default function Login() { return <div>Login</div>; }
```

`client/src/pages/Register.jsx`:
```jsx
export default function Register() { return <div>Register</div>; }
```

`client/src/pages/Dashboard.jsx`:
```jsx
export default function Dashboard() { return <div>Dashboard</div>; }
```

`client/src/pages/EducationMode.jsx`:
```jsx
export default function EducationMode() { return <div>Education</div>; }
```

`client/src/pages/PracticeMode.jsx`:
```jsx
export default function PracticeMode() { return <div>Practice</div>; }
```

`client/src/pages/AudioMode.jsx`:
```jsx
export default function AudioMode() { return <div>Audio</div>; }
```

- [ ] **Step 6: Build to verify no errors**

```bash
cd client && npm run build && cd ..
```

Expected: Build succeeds, `client/dist/` created.

- [ ] **Step 7: Commit**

```bash
git add client/src/ client/index.html
git commit -m "feat: React shell — MUI theme, routing, page stubs"
```

---

## Task 8: AuthContext + API Helper

**Files:**
- Create: `client/src/api.js`
- Modify: `client/src/context/AuthContext.jsx`

- [ ] **Step 1: Create client/src/api.js**

```js
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

- [ ] **Step 2: Replace client/src/context/AuthContext.jsx**

```jsx
import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
```

- [ ] **Step 3: Commit**

```bash
git add client/src/api.js client/src/context/AuthContext.jsx
git commit -m "feat: AuthContext + axios API helper with JWT interceptors"
```

---

## Task 9: Login + Register Pages

**Files:**
- Modify: `client/src/pages/Login.jsx`
- Modify: `client/src/pages/Register.jsx`

- [ ] **Step 1: Replace client/src/pages/Login.jsx**

```jsx
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress, Link } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom color="primary">🇺🇸 Citizenship Test</Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>Sign in to continue your practice</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} to="/register" color="primary">Create one</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
```

- [ ] **Step 2: Replace client/src/pages/Register.jsx**

```jsx
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress, Link } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom color="primary">🇺🇸 Create Account</Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>Start practicing for your citizenship test</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required helperText="At least 6 characters" sx={{ mb: 3 }} />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" color="primary">Sign in</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/Login.jsx client/src/pages/Register.jsx
git commit -m "feat: Login and Register pages"
```

---

## Task 10: Dashboard

**Files:**
- Modify: `client/src/pages/Dashboard.jsx`

- [ ] **Step 1: Replace client/src/pages/Dashboard.jsx**

```jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardActionArea, Typography, Grid, Chip, AppBar, Toolbar, Button, LinearProgress } from '@mui/material';
import { School, Quiz, RecordVoiceOver, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const MODES = [
  { key: 'education', label: 'Education Mode', icon: <School sx={{ fontSize: 48 }} />, description: 'Study all 100 civics questions and official answers at your own pace.', color: '#6366f1', bg: '#eef2ff', path: '/education' },
  { key: 'practice', label: 'Practice Mode', icon: <Quiz sx={{ fontSize: 48 }} />, description: '20 random questions with 6 choices each. Pass with 12 or more correct.', color: '#10b981', bg: '#ecfdf5', path: '/practice' },
  { key: 'audio', label: 'Audio Mode', icon: <RecordVoiceOver sx={{ fontSize: 48 }} />, description: 'Listen to questions spoken aloud and answer verbally — just like the real interview.', color: '#a855f7', bg: '#faf5ff', path: '/audio' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    api.get('/progress').then((res) => setProgress(res.data)).catch(() => {});
  }, []);

  const educationPct = progress ? Math.round((progress.education.lastQuestionIndex / 100) * 100) : 0;
  const practiceSessions = progress?.practice?.sessions ?? [];
  const audioSessions = progress?.audio?.sessions ?? [];

  const modeStats = {
    education: `${educationPct}% complete`,
    practice: practiceSessions.length ? `${practiceSessions.length} session(s) — Best: ${Math.max(...practiceSessions.map((s) => s.score))}/20` : 'No sessions yet',
    audio: audioSessions.length ? `${audioSessions.length} session(s) — Best: ${Math.max(...audioSessions.map((s) => s.score))}/20` : 'No sessions yet',
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e5e7eb' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 700 }}>🇺🇸 US Citizenship Test</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>{user?.name}</Typography>
          <Button startIcon={<Logout />} onClick={logout} color="inherit" size="small">Sign Out</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
        <Typography variant="h4" gutterBottom>Welcome back, {user?.name?.split(' ')[0]}! 👋</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Choose a study mode to continue your preparation.</Typography>
        <Grid container spacing={3}>
          {MODES.map((mode) => (
            <Grid item xs={12} md={4} key={mode.key}>
              <Card sx={{ height: '100%', borderTop: `4px solid ${mode.color}` }}>
                <CardActionArea onClick={() => navigate(mode.path)} sx={{ height: '100%', p: 1 }}>
                  <CardContent>
                    <Box sx={{ color: mode.color, mb: 2 }}>{mode.icon}</Box>
                    <Typography variant="h6" gutterBottom>{mode.label}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{mode.description}</Typography>
                    <Chip label={modeStats[mode.key]} size="small" sx={{ bgcolor: mode.bg, color: mode.color, fontWeight: 600 }} />
                    {mode.key === 'education' && (
                      <LinearProgress variant="determinate" value={educationPct}
                        sx={{ mt: 2, borderRadius: 4, bgcolor: mode.bg, '& .MuiLinearProgress-bar': { bgcolor: mode.color } }} />
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/Dashboard.jsx
git commit -m "feat: Dashboard with mode cards and progress stats"
```

---

## Task 11: Education Mode

**Files:**
- Modify: `client/src/pages/EducationMode.jsx`

- [ ] **Step 1: Replace client/src/pages/EducationMode.jsx**

```jsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, LinearProgress, Chip, IconButton, Divider, List, ListItem, ListItemText } from '@mui/material';
import { ArrowBack, ArrowForward, Home } from '@mui/icons-material';
import api from '../api';

export default function EducationMode() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/questions'), api.get('/progress')])
      .then(([qRes, pRes]) => {
        setQuestions(qRes.data);
        setIndex(pRes.data.education?.lastQuestionIndex ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveProgress = useCallback((newIndex) => {
    api.put('/progress', { education: { lastQuestionIndex: newIndex } }).catch(() => {});
  }, []);

  const goTo = (newIndex) => { setIndex(newIndex); saveProgress(newIndex); };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><LinearProgress sx={{ width: 300 }} /></Box>;

  const q = questions[index];
  const progress = Math.round(((index + 1) / questions.length) * 100);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/')} size="small"><Home /></IconButton>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Education Mode</Typography>
      </Box>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Question {index + 1} of {questions.length}</Typography>
            <Typography variant="body2" color="primary" fontWeight={600}>{progress}% complete</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ borderRadius: 4, height: 8, bgcolor: '#eef2ff', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
        </Box>
        <Chip label={q.section} size="small" sx={{ mb: 2, bgcolor: '#eef2ff', color: '#6366f1', fontWeight: 600 }} />
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 1 }}>Question {q.id}</Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.5 }}>{q.question}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Official Answer{q.answers.length > 1 ? 's' : ''} (any one is acceptable):
            </Typography>
            <Divider sx={{ my: 1 }} />
            <List dense>
              {q.answers.map((ans, i) => (
                <ListItem key={i} sx={{ py: 0.5 }}>
                  <ListItemText primary={ans} primaryTypographyProps={{ color: 'text.primary', fontWeight: 500 }} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0}>Previous</Button>
          <Button variant="contained" endIcon={<ArrowForward />} onClick={() => goTo(Math.min(questions.length - 1, index + 1))} disabled={index === questions.length - 1}>Next</Button>
        </Box>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/EducationMode.jsx
git commit -m "feat: Education mode — flashcards with progress resume"
```

---

## Task 12: Practice Mode

**Files:**
- Modify: `client/src/pages/PracticeMode.jsx`

- [ ] **Step 1: Replace client/src/pages/PracticeMode.jsx**

```jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Grid, LinearProgress, Chip, IconButton } from '@mui/material';
import { Home, Refresh, CheckCircle, Cancel } from '@mui/icons-material';
import api from '../api';

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function buildSession(questions) {
  return shuffle(questions).slice(0, 20).map((q) => {
    const correct = q.answers[Math.floor(Math.random() * q.answers.length)];
    return { ...q, correct, choices: shuffle([correct, ...q.fakeAnswers]) };
  });
}

export default function PracticeMode() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [session, setSession] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/questions').then((res) => { setQuestions(res.data); setSession(buildSession(res.data)); }).finally(() => setLoading(false));
  }, []);

  const handleSelect = (choice) => {
    if (selected !== null) return;
    setSelected(choice);
    const correct = choice === session[current].correct;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 >= session.length) {
        const finalScore = score + (correct ? 1 : 0);
        api.post('/progress/practice/session', { score: finalScore, total: session.length, passed: finalScore >= 12, questionIds: session.map((q) => q.id) }).catch(() => {});
        setScore(finalScore);
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
      }
    }, 1200);
  };

  const restart = () => { setSession(buildSession(questions)); setCurrent(0); setSelected(null); setScore(0); setDone(false); };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><LinearProgress sx={{ width: 300 }} /></Box>;

  if (done) {
    const passed = score >= 12;
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Card sx={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h2" sx={{ mb: 1 }}>{passed ? '🎉' : '📚'}</Typography>
            <Typography variant="h4" gutterBottom color={passed ? 'success.main' : 'error.main'}>{passed ? 'Passed!' : 'Keep Practicing'}</Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>{score} / {session.length}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {passed ? 'Great work! You met the passing threshold.' : `You need ${12 - score} more correct to pass.`}
            </Typography>
            <LinearProgress variant="determinate" value={(score / session.length) * 100}
              sx={{ mb: 3, height: 12, borderRadius: 6, bgcolor: '#ecfdf5', '& .MuiLinearProgress-bar': { bgcolor: passed ? '#10b981' : '#f43f5e' } }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" startIcon={<Home />} onClick={() => navigate('/')}>Dashboard</Button>
              <Button variant="contained" color="secondary" startIcon={<Refresh />} onClick={restart}>Try Again</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const q = session[current];
  const progress = Math.round(((current + 1) / session.length) * 100);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/')} size="small"><Home /></IconButton>
        <Typography variant="h6" color="secondary" sx={{ fontWeight: 700, flexGrow: 1 }}>Practice Mode</Typography>
        <Chip label={`${score} correct`} color="success" size="small" variant="outlined" />
        <Chip label={`Need ${Math.max(0, 12 - score)} more`} size="small" sx={{ ml: 1 }} />
      </Box>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Question {current + 1} of {session.length}</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>{progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ borderRadius: 4, height: 8, bgcolor: '#ecfdf5', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
        </Box>
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 1 }}>Question {q.id}</Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.5 }}>{q.question}</Typography>
          </CardContent>
        </Card>
        <Grid container spacing={2}>
          {q.choices.map((choice, i) => {
            let bgcolor = 'white', borderColor = '#e5e7eb', textColor = 'text.primary';
            if (selected !== null) {
              if (choice === q.correct) { bgcolor = '#ecfdf5'; borderColor = '#10b981'; textColor = '#065f46'; }
              else if (choice === selected) { bgcolor = '#fff1f2'; borderColor = '#f43f5e'; textColor = '#9f1239'; }
            }
            return (
              <Grid item xs={12} sm={6} key={i}>
                <Card onClick={() => handleSelect(choice)}
                  sx={{ cursor: selected ? 'default' : 'pointer', border: `2px solid ${borderColor}`, bgcolor, transition: 'all 0.2s',
                    '&:hover': selected ? {} : { borderColor: '#10b981', transform: 'translateY(-2px)' } }}>
                  <CardContent sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selected !== null && choice === q.correct && <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />}
                    {selected !== null && choice === selected && choice !== q.correct && <Cancel sx={{ color: '#f43f5e', fontSize: 20 }} />}
                    <Typography variant="body2" fontWeight={500} color={textColor}>{choice}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/PracticeMode.jsx
git commit -m "feat: Practice mode — 20 Q, 6 choices, pass/fail, session saved to DB"
```

---

## Task 13: Audio Mode

**Files:**
- Modify: `client/src/pages/AudioMode.jsx`

- [ ] **Step 1: Replace client/src/pages/AudioMode.jsx**

```jsx
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, LinearProgress, IconButton, FormControl, InputLabel, Select, MenuItem, Chip, Alert } from '@mui/material';
import { Home, VolumeUp, Refresh } from '@mui/icons-material';
import api from '../api';

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function isAnswerCorrect(transcript, answers) {
  const t = transcript.toLowerCase().trim();
  return answers.some((ans) => {
    const a = ans.toLowerCase();
    return t.includes(a) || a.includes(t) || t.split(' ').some((word) => word.length > 3 && a.includes(word));
  });
}

export default function AudioMode() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [session, setSession] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [status, setStatus] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const recognitionRef = useRef(null);
  const scoreRef = useRef(0);

  useEffect(() => {
    api.get('/questions').then((res) => { setQuestions(res.data); setSession(shuffle(res.data).slice(0, 20)); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { scoreRef.current = score; }, [score]);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) { setVoices(v); setSelectedVoice((prev) => prev || v[0]?.name || ''); }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = useCallback((text) => new Promise((resolve) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    utter.rate = 0.9;
    utter.onend = resolve;
    window.speechSynthesis.speak(utter);
  }), [voices, selectedVoice]);

  const listen = useCallback(() => new Promise((resolve) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { resolve(''); return; }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => resolve(e.results[0][0].transcript);
    recognition.onerror = () => resolve('');
    recognition.onend = () => {};
    recognition.start();
  }), []);

  const askQuestion = useCallback(async () => {
    if (current >= session.length) return;
    const q = session[current];
    setStatus('speaking');
    setTranscript('');
    setIsCorrect(null);
    await speak(`Question ${current + 1}. ${q.question}`);
    setStatus('listening');
    const heard = await listen();
    setTranscript(heard);
    const correct = isAnswerCorrect(heard, q.answers);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setStatus('result');
    setTimeout(() => {
      if (current + 1 >= session.length) {
        const finalScore = scoreRef.current + (correct ? 1 : 0);
        api.post('/progress/audio/session', { score: finalScore, total: session.length, passed: finalScore >= 12 }).catch(() => {});
        setScore(finalScore);
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
        setStatus('idle');
      }
    }, 2500);
  }, [current, session, speak, listen]);

  const restart = () => {
    window.speechSynthesis.cancel();
    recognitionRef.current?.abort();
    setSession(shuffle(questions).slice(0, 20));
    setCurrent(0); setScore(0); setDone(false); setStatus('idle'); setTranscript(''); setIsCorrect(null);
    scoreRef.current = 0;
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><LinearProgress sx={{ width: 300 }} /></Box>;

  if (done) {
    const passed = score >= 12;
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Card sx={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h2" sx={{ mb: 1 }}>{passed ? '🎉' : '🎤'}</Typography>
            <Typography variant="h4" gutterBottom color={passed ? 'success.main' : 'error.main'}>{passed ? 'Interview Passed!' : 'Keep Practicing'}</Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>{score} / {session.length}</Typography>
            <LinearProgress variant="determinate" value={(score / session.length) * 100}
              sx={{ mb: 3, height: 12, borderRadius: 6, bgcolor: '#faf5ff', '& .MuiLinearProgress-bar': { bgcolor: passed ? '#a855f7' : '#f43f5e' } }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" startIcon={<Home />} onClick={() => navigate('/')}>Dashboard</Button>
              <Button variant="contained" sx={{ bgcolor: '#a855f7', '&:hover': { bgcolor: '#9333ea' } }} startIcon={<Refresh />} onClick={restart}>Try Again</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const q = session[current] || {};
  const progress = Math.round(((current + 1) / session.length) * 100);
  const hasSpeechRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/')} size="small"><Home /></IconButton>
        <Typography variant="h6" sx={{ color: '#a855f7', fontWeight: 700, flexGrow: 1 }}>Audio Mode</Typography>
        <Chip label={`${score} correct`} size="small" sx={{ bgcolor: '#faf5ff', color: '#a855f7' }} />
      </Box>
      <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
        {!hasSpeechRecognition && (
          <Alert severity="warning" sx={{ mb: 2 }}>Your browser does not support speech recognition. Try Chrome or Edge for the full experience.</Alert>
        )}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <FormControl fullWidth size="small">
              <InputLabel>Voice / Accent</InputLabel>
              <Select value={selectedVoice} label="Voice / Accent" onChange={(e) => setSelectedVoice(e.target.value)}>
                {voices.map((v) => <MenuItem key={v.name} value={v.name}>{v.name} ({v.lang})</MenuItem>)}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Question {current + 1} of {session.length}</Typography>
            <Typography variant="body2" sx={{ color: '#a855f7' }} fontWeight={600}>{progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ borderRadius: 4, height: 8, bgcolor: '#faf5ff', '& .MuiLinearProgress-bar': { bgcolor: '#a855f7' } }} />
        </Box>
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)', textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography sx={{ fontSize: 64, mb: 1 }}>👮</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 1 }}>USCIS Officer</Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.5 }}>
              {status === 'idle' ? 'Press "Ask Question" to begin' : q.question}
            </Typography>
          </CardContent>
        </Card>
        {status === 'speaking' && <Typography align="center" color="#a855f7" sx={{ mb: 2 }}>🔊 Speaking question...</Typography>}
        {status === 'listening' && <Typography align="center" color="#10b981" sx={{ mb: 2 }}>�� Listening... speak your answer now</Typography>}
        {status === 'result' && (
          <Card sx={{ mb: 2, border: `2px solid ${isCorrect ? '#10b981' : '#f43f5e'}`, bgcolor: isCorrect ? '#ecfdf5' : '#fff1f2' }}>
            <CardContent>
              <Typography variant="subtitle2" color={isCorrect ? 'success.main' : 'error.main'} gutterBottom>
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </Typography>
              {transcript && <Typography variant="body2" color="text.secondary">You said: &ldquo;{transcript}&rdquo;</Typography>}
              {!isCorrect && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Accepted: {q.answers?.slice(0, 3).join(' / ')}</Typography>}
            </CardContent>
          </Card>
        )}
        {status === 'idle' && (
          <Button variant="contained" fullWidth size="large" startIcon={<VolumeUp />} onClick={askQuestion}
            sx={{ bgcolor: '#a855f7', '&:hover': { bgcolor: '#9333ea' } }}>Ask Question</Button>
        )}
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/AudioMode.jsx
git commit -m "feat: Audio mode — TTS, STT via Web Speech API, accent switching"
```

---

## Task 14: Production Build + Verification

**Files:**
- Verify `server/index.js` already serves static build
- Verify `package.json` has `build` and `start` scripts

- [ ] **Step 1: Remove Vite boilerplate files**

```bash
rm -f client/src/App.css client/src/index.css
```

In `client/src/main.jsx`, remove any `import './index.css'` line if present.

- [ ] **Step 2: Build the React client**

```bash
npm run build
```

Expected: `client/dist/` created with `index.html` and hashed JS/CSS assets.

- [ ] **Step 3: Start production server**

```bash
npm start
```

Expected:
```
MongoDB connected
Server running on port 5000
```

- [ ] **Step 4: Smoke test**

```bash
# Check root serves HTML
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/
# Expected: 200

# Check API auth rejects unauthenticated
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" -d '{"email":"bad@test.com","password":"bad"}'
# Expected: 401

# Check React routes serve index.html (SPA fallthrough)
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/practice
# Expected: 200
```

- [ ] **Step 5: End-to-end browser check**

Navigate to `http://localhost:5000` and verify:
1. Redirects to `/login`
2. Register creates account → lands on Dashboard
3. Dashboard shows 3 mode cards with real progress data
4. Education Mode — Q1 shown, navigation works, resumes on refresh
5. Practice Mode — 20 Qs, 6 choices, score tracked, result saved
6. Audio Mode — voice selector populated, speaks Q, captures answer

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: full app complete — Education, Practice, Audio modes with auth and progress tracking"
```

---

## Self-Review

**Spec coverage:**
- ✅ Node.js/Express backend
- ✅ MongoDB Atlas via Mongoose
- ✅ Register + Login with JWT (bcrypt passwords)
- ✅ Progress stored in DB, resumable (education lastQuestionIndex)
- ✅ Education Mode: Q+A display, prev/next, resume
- ✅ Practice Mode: 20 random Q, 6 choices (1 correct + 5 fake), pass at 12/20
- ✅ Audio Mode: TTS via SpeechSynthesis, STT via SpeechRecognition, accent switching
- ✅ Same endpoint (Express serves React build)
- ✅ Material UI with soft indigo/emerald/purple palette
- ✅ All 100 questions from Questions.md with 5 fake answers each

**Type/method consistency:**
- `api.post('/progress/practice/session')` → `router.post('/practice/session')` at `/api/progress` ✅
- `api.post('/progress/audio/session')` → `router.post('/audio/session')` at `/api/progress` ✅
- `progress.education.lastQuestionIndex` used consistently in both model and frontend ✅
- `useAuth()` returns `{ token, user, login, register, logout }` — used correctly in all pages ✅
