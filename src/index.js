'use strict';
var jquery = require('jquery');
window.$ = window.jQuery = jquery;
require('jquery-ui-dist/jquery-ui.js');

var navMenuItems = $('#nav-menu li a');
var experienceTab = $('#experienceTab');
var educationTab = $('#educationTab');
var switchEdu = $('#switch-edu');
var switchExp = $('#switch-exp');
var contactForm = $('form');
var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

var routes = [
    {
        route: 'about',
        container: $('#aboutSection')
    },
    // {
    //     route: 'resume',
    //     container: $('#resumeSection')
    // },
    {
        route: 'projects',
        container: $('#projectsSection')
    },
    {
        route: 'contact',
        container: $('#contactSection')
    }
    // {
    //     route: 'blog',
    //     container: $('#blogSection')
    // }
];
$(function () {
    contactForm.on('submit', function (e) {
        e.preventDefault();
        const formInputs = contactForm.serializeArray();
        const object = {};
        formInputs.forEach(input => {
            object[input.name] = input.value;
        });
        sendMessage(object);
    });

    if (!window.location.href.includes('#')) {
        init('about');
    } else {
        const route = routes
            .filter(r => r.route == window.location.href.split('#')[1])
            .map(function (r) {
                return r.route;
            })[0];
        if (route) {
            init(route);
        }
    }

    function init(initRoute) {
        $.each(routes, function (i, route) {
            if (route.route != initRoute) {
                route.container.hide();
            } else {
                route.container.show();
            }
        });
    }

    switchEdu.on('click', function () {
        switchTo('educationTab');
    });

    switchExp.on('click', function () {
        switchTo('experienceTab');
    });

    function switchTo(tab) {
        switch (tab) {
            case 'experienceTab':
                educationTab.hide();
                switchEdu.removeClass('active');
                switchExp.addClass('active');
                break;
            case 'educationTab':
                switchExp.removeClass('active');
                switchEdu.addClass('active');
                experienceTab.hide();
                break;
        }
        $('#' + tab).show();
    }

    navMenuItems.each((i, nav) => {
        $(nav).on('click', function (event) {
            const isRoute = $(event.currentTarget).attr('data-route') != null ? true : false;
            if (isRoute) {
                event.preventDefault();
                const clickedItem = $(event.currentTarget).attr('data-route').trim().toLowerCase();
                const a = routes.find(r => r.route == clickedItem);

                routes
                    .filter(r => r.route != clickedItem)
                    .forEach(function (i, r) {
                        if (i.container) i.container.hide();
                    });

                a.container.show();
                window.location.href = '/#' + a.route;
                navMenuItems.each((i, nav) => nav.classList.remove('active'));
                nav.classList.add('active');
            }
        });
    });
});

function sendMessage(message) {
    if (!emailRegex.test(message._replyto)) {
        openModal(`Please provide a valid e-mail address.`);
    } else {
        var fd = new FormData();
        fd.append('_replyto', message._replyto);
        fd.append('message', message.message);
        $.ajax({
            method: 'post',
            processData: false,
            contentType: false,
            headers: {
                accept: ' application/json, text/plain, */*'
            },
            cache: false,
            data: fd,
            enctype: 'multipart/form-data',
            url: 'https://formspree.io/f/mqkwjppn',
            success: function (response) {
                openModal(
                    'message has been sent, thank you for reaching me, i will get back to you soon as possible.'
                );
                contactForm[0].reset();
            }
        });
    }
}

function openModal(text) {
    $('.window').remove();
    const body = $('body');
    body.append(/*html */ `
    <div class="modal-backdrop"></div>
    <section class="window">
            <header class="window-header">
                <nav class="window-controls">
                    <span class="control-item control-close js-close">&times;</span>
                </nav>
            </header>
            <main class="window-content">
                <div class="window-cursor">
                    <span class="i-cursor-indicator">&gt;${text}</span
                    ><span class="i-cursor-underscore"></span>
                </div>
            </main>
        </section>`);
    const modal = $('.window');
    modal.find('.js-close').on('click', function () {
        modal.remove();
        body.find('.modal-backdrop').remove();
    });
}
