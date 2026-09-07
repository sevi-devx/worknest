var express = require('express');
var path = require('path');
const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.listen(port, () => {
    console.log(`Server is up and running at http://localhost:${port}`);
});
