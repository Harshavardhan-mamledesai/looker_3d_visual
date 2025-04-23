// Minimal Hello World Looker visualization
looker.plugins.visualizations.add({
  id: "hello_world",
  label: "Hello World",
  create: function(element, config) {
    element.innerHTML = "<div>Hello, world!</div>";
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    done();
  }
});
