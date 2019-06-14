var breakfast = '#breakfast';
var lunch = '#lunch';
var dinner = '#dinner';
var searchResults = "#searchResults";

var containers = [
    document.querySelector(breakfast),
    document.querySelector(lunch),
    document.querySelector(dinner),
    document.querySelector(searchResults),
    document.querySelector(".carousel-item"),
    document.querySelector("#firstSlide"),
    document.querySelector("#secondSlide"),
    document.querySelector("#thirdSlide"),
];

var drake = dragula({
    containers: containers,
    //  revertOnSpill: true,
    //   copy: true
    copy: function (el, containers) {
        return $(containers).attr('class').match('carousel-item');
    },
    removeOnSpill: true,
});

