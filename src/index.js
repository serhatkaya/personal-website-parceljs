'user strict';
var jquery = require('jquery');
window.$ = window.jQuery = jquery; // notice the definition of global variables here
require('jquery-ui-dist/jquery-ui.js');
var navMenuItems = $('#nav-menu li a');
var sections = ['about', 'resume', 'projects', 'contact', 'blog'];

$(function () {
    navMenuItems.each((i, nav) => {
        $(nav).on('click', function (event) {
            event.preventDefault();
        });
    });
});
const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element);

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {
            once: true
        });
    });
