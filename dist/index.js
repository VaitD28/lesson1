"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const port = 4444;
settings_1.app.listen(port, () => {
    console.log('App starter on ${port} port');
});
