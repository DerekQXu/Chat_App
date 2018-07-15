module.exports = function(app,db) {
  app.post('/notes', (req, res) => {
    // create a note
    console.log(req.body)
    res.send('Hello')
  })
}
