import $ from "$";
import document from "document";
import window from "window";

window.Deasilsoft = window.Deasilsoft !== undefined ? window.Deasilsoft : {};

$.extend(window.Deasilsoft, {
    /**
     * Deasilsoft/Scroller version 2021.8.0
     * Navigate your web page with a smooth scrolling animation.
     *
     * Copyright (c) 2018-2021 Deasilsoft
     * https://deasilsoft.com
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
     * @param {String[]} links
     * @param {Object} userOptions
     * @return {Number} error code (-1 invalid links parameter, -2 invalid userOptions parameter)
     * @preserve
     */
    Scroller: (links, userOptions = {}) =>
    {
        /* VALIDATION */

        // links has to be an array
        if (!Array.isArray(links)) return -1;

        // options has to be an object
        if (!(userOptions instanceof Object)) return -2;

        /* DEFINITIONS */

        // default options
        const DEFAULTS = {
            Navigation: {
                Class: {
                    Active: "active"
                },
                Selector: {
                    ActiveParentLink: true,
                    Active: "body > header .nav-item.active",
                    Link: "body > header .nav-link[href^='{{link}}']"
                }
            },
            ResizeTimeout: 250,
            ScrollTimeout: 100,
            TouchThreshold: 0.66,
            LoadLink: 0
        };

        /* INITIALIZATION */

        // resolve options
        const options = $.extend(true, DEFAULTS, userOptions);

        // initialize variables
        let scrollAction = null;
        let resizeAction = null;
        let currentIndex = options.LoadLink;
        let touchBegin;

        /* FUNCTIONS */

        /**
         * Get path to navigation link.
         *
         * @param link
         * @returns {string}
         */
        const NavigationLink = (link) =>
        {
            return options.Navigation.Selector.Link.replace(/{{ ?link ?}}/gi, link);
        };

        /**
         * Scroll to link.
         *
         * @param {String} link
         */
        const ScrollToLink = (link) =>
        {
            // link has to be valid and no scrolling can be under progress
            if (links.includes(link) && scrollAction === null)
            {
                // set scroll action
                scrollAction = setTimeout(() =>
                {
                    // do animation
                    $("html,body").animate({
                        scrollTop: $(link).offset().top
                    }, {
                        queue: false,
                        complete: () =>
                        {
                            // clear previous scroll action
                            clearTimeout(scrollAction);
                            scrollAction = null;

                            // set current index
                            currentIndex = links.indexOf(link);

                            // remove class from active selector
                            $(options.Navigation.Selector.Active).removeClass(options.Navigation.Class.Active);

                            // get parent or link and add active class
                            if (options.Navigation.Selector.ActiveParentLink)
                            {
                                $(NavigationLink(link)).parent().addClass(options.Navigation.Class.Active);
                            }
                            else
                            {
                                $(NavigationLink(link)).addClass(options.Navigation.Class.Active);
                            }

                            // update web address
                            window.history.pushState(null, null, link);
                        }
                    });
                }, options.ScrollTimeout);
            }
        };

        /**
         * Scroll to previous link.
         */
        const ScrollToPreviousLink = () =>
        {
            // set previous index
            let previousIndex = currentIndex - 1;

            // if current index is less than 0: go to final element in array
            if (previousIndex < 0) previousIndex = links.length - 1;

            // scroll to current index
            ScrollToLink(links[previousIndex]);
        };

        /**
         * Scroll to next link.
         */
        const ScrollToNextLink = () =>
        {
            // set next index
            let nextIndex = currentIndex + 1;

            // if current index is greater than or equals array length: go to first element in array
            if (nextIndex >= links.length) nextIndex = 0;

            // scroll to current index
            ScrollToLink(links[nextIndex]);
        };

        /* EVENTS */

        // on document loaded
        $(document).ready(() =>
        {
            // scroll to link defined by web address to fix any issues
            if (window.location.hash !== "") ScrollToLink(window.location.hash);
            else if (options.LoadLink >= 0) window.location.hash = links[options.LoadLink];
        });

        // on window resize
        $(window).on("resize", () =>
        {
            // clear previous resize resizeAction
            clearTimeout(resizeAction);

            // set pending resize resizeAction
            resizeAction = setTimeout(() =>
            {
                // clear previous resize resizeAction
                clearTimeout(resizeAction);
                resizeAction = null;

                // scroll to current link to adjust to new window size
                ScrollToLink(links[currentIndex]);
            }, options.ResizeTimeout);
        });

        // on element scrolling
        $("*").on("scroll", () =>
        {
            // clear previous scroll action
            clearTimeout(scrollAction);
            scrollAction = null;
        });

        // on wheel scrolling
        $(window).on("wheel", (event) =>
        {
            // if mouse wheel is scrolling up: scroll to previous link, otherwise scroll to next link
            if (event.originalEvent.deltaY < 0) ScrollToPreviousLink();
            else ScrollToNextLink();
        });

        // on document touch start
        $(document).on("touchstart", (event) =>
        {
            // set location touch started
            touchBegin = event.originalEvent.touches[0].clientY;
        });

        // on document touch end
        $(document).on("touchend", (event) =>
        {
            // set location touch ended
            const touchEnd = event.originalEvent.changedTouches[0].clientY;

            // if distance between touches is less than threshold: scroll to previous link
            if (touchBegin - touchEnd < $(window).height() * -options.TouchThreshold) ScrollToPreviousLink();

            // if distance between touches is more than threshold: scroll to next link
            else if (touchBegin - touchEnd > $(window).height() * options.TouchThreshold) ScrollToNextLink();
        });

        // on navigation link click
        $(NavigationLink("#")).on("click", function (event)
        {
            // set link
            const link = $(this).attr("href");

            // scroll to link
            ScrollToLink(link);

            // prevent default behaviour
            event.preventDefault();
        });

        return 1;
    }
});
