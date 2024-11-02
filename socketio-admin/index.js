const express = require("express");

const app = express();

app.use(express.static("./node_modules/@socket.io/admin-ui/ui/dist"));

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
