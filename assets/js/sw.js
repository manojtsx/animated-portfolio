self.addEventListener("install", function (e) {
    console.log("Service Worker installed");
  });
  
  self.addEventListener("fetch", function (event) {
    // You can cache and serve content here if needed
  });
  