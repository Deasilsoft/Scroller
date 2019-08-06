/**
 * Deasilsoft/Scroller v2.1
 * https://deasilsoft.com
 *
 * Copyright (c) 2018-2019 Deasilsoft
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @param {Array} links
 * @param {Object} options
 * @return {number} error code (-1: no jQuery, -2 invalid links parameter, -3 invalid options parameter)
 */
let DeasilsoftScroller = function (links, options = {}) {

    /* VALIDATION */

    // detect jQuery as it is required
    if (typeof ($) === "undefined") return -1;

    // links has to be an array
    if (!Array.isArray(links)) return -2;

    // options has to be an object
    if (!(options instanceof Object)) return -3;

    /* DEFINITIONS */

    // default options
    const OPTIONS_DEFAULT = {
        "nav": {
            "classes": {
                "active": "active",
            },
            "paths": {
                "active": "body > header > nav .nav-item.active",
                "link": "body > header > nav .nav-item > .nav-link[href^=\"${link}\"]",
            },
        },
        "resize": {
            "timer": 250,
        },
        "touch": {
            "percentage": 0.66,
        },
    };

    /* INITIALIZATION */

    // initialize variables
    let isScrolling, currentIndex, resizeAction, touchBegin;

    // resolve options
    options = $.extend(true, OPTIONS_DEFAULT, options);

    /* EVENTS */

    // on document loaded
    $(document).ready(function () {

        // scroll to link defined by web address to fix any issues
        if (location.hash !== "") scrollTo(location.hash);

    });

    // on window resize
    $(window).on("resize", function () {

        // clear previous resize action
        clearTimeout(resizeAction);

        // set pending resize action
        resizeAction = setTimeout(function () {

            // scroll to current link to adjust to new window size
            scrollTo(links[currentIndex]);

        }, options.resize.timer);

    });

    // on window mouse wheel
    $(window).bind("mousewheel", function (e) {

        let mousewheel = e.originalEvent.wheelDelta;

        // if mouse wheel is scrolling up: scroll to previous link
        if (mousewheel > 0) scrollPrevious();

        // if mouse wheel is scrolling down: scroll to next link
        else if (mousewheel < 0) scrollNext();

    });

    // on document touch start
    $(document).on("touchstart", function (e) {

        // set location touch started
        touchBegin = e.originalEvent.touches[0].clientY;

    });

    // on document touch end
    $(document).on("touchend", function (e) {

        // set location touch ended
        let touchEnd = e.originalEvent.changedTouches[0].clientY;

        // if distance between touches is less than negative threshold: scroll to previous link
        if (touchBegin - touchEnd < $(window).height() * -options.touch.percentage) scrollPrevious();

        // if distance between touches is greater than threshold: scroll to next link
        else if (touchBegin - touchEnd > $(window).height() * options.touch.percentage) scrollNext();

    });

    // on navigation link click
    $(navLink("#")).on("click", function (e) {

        // set link
        let link = $(this).attr("href");

        // scroll to link
        scrollTo(link);

        // prevent default behaviour
        e.preventDefault();

    });

    // on document scroll
    $(document).on("scroll", function () {

        // if scrolling is rogue, snap to current link
        if (!isScrolling) $("html,body").scrollTop($(links[currentIndex]).offset().top);

    });

    /* FUNCTIONS */

    /**
     * Scroll to previous link.
     */
    function scrollPrevious() {

        // decrement current index
        currentIndex--;

        // if current index is less than 0: go to final element in array
        if (currentIndex < 0) currentIndex = links.length - 1;

        // scroll to current index
        scrollTo(links[currentIndex]);

    }

    /**
     * Scroll to next link.
     */
    function scrollNext() {

        // increment current index
        currentIndex++;

        // if current index is greater than or equals array length: go to first element in array
        if (currentIndex >= links.length) currentIndex = 0;

        // scroll to current index
        scrollTo(links[currentIndex]);

    }

    /**
     * Scroll to link.
     *
     * @param {String} link
     */
    function scrollTo(link) {

        // link has to be valid and no scrolling can be under progress
        if (links.includes(link) && !isScrolling) {

            // declare scrolling is under progress
            isScrolling = true;

            $("html,body").animate({
                scrollTop: $(link).offset().top,
            }, {
                queue: false,
                complete: function () {

                    // declare scrolling has finished
                    isScrolling = false;

                    // set current index
                    currentIndex = links.indexOf(link);

                    // update navigation
                    $(options.nav.paths.active).removeClass(options.nav.classes.active);
                    $(navLink(link)).parent().addClass(options.nav.classes.active);

                    // update web address
                    history.pushState(null, null, link);

                },
            });

        }

    }

    /**
     * Get path to navigation link.
     *
     * @param link
     * @returns {string}
     */
    function navLink(link) {

        return options.nav.paths.link.replace("${link}", link);

    }

    return 1;

};
