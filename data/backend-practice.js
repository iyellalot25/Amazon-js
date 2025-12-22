const xhr = new XMLHttpRequest();

//Wait for loading
xhr.addEventListener('load',() => {
  console.log(xhr.response);
});

//Setting up the request
xhr.open('GET','https://supersimplebackend.dev/hello');
xhr.send();