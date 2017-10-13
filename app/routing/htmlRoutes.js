// Routes
// =============================================================
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/app/public/home.html");
});
app.get("/survey", function(req, res) {
  res.sendFile(path.join(__dirname, "/app/public/survey.html"));
});

// Get all characters
app.get("/all", function(req, res) {
  res.json(characters);
});