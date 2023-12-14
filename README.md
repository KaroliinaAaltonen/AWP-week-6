Advanced web applications week 6 assignment: TypeScript

NOTES TO SELF

Starting the project:
npm install nodemon
npm install express
npm i -D typescript @types/express @types/node
npx tsc --init
npm install tsc-watch --save-dev

In package.json:
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "tsc-watch --noClear -p ./tsconfig.json --onSuccess \"nodemon ./dist/index.js --ignore node_modules\"",
    "dev-server": "tsc-watch --noClear -p ./tsconfig.json --onSuccess \"nodemon ./dist/index.js --ignore node_modules\""
  },

  "start" and "dev-server" scripts needed to be added manually so that npm start / npm dev-server commands start the code.

In tsconfig.json:
Comment out manually
1.    "outDir": "./dist",   
2.    "noEmitOnError": true,


