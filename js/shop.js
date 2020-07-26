var h = 'hyi';
localStorage.setItem("lastname", "Smith");
localStorage.setItem("Firstname", h);
var a = localStorage.getItem("lastname");
var b = localStorage.getItem("Firstname");
console.log(a);
console.log(b);
document.innerHTML = a;
