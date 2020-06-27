/**
 * Deasilsoft/Scroller v3.2
 * https://deasilsoft.com
 *
 * Copyright (c) 2018-2020 Deasilsoft
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
var Deasilsoft = (typeof Deasilsoft === "undefined") ? {} : Deasilsoft;
$.extend(Deasilsoft, {
    Scroller: function (links, options = {})
    {
        /* VALIDATION */

        // detect jQuery as it is required
        if (typeof $ === "undefined") return -1;

        // links has to be an array
        if (!Array.isArray(links)) return -2;

        // options has to be an object
        if (!(options instanceof Object)) return -3;

        /* DEFINITIONS */

        // default options
        const DEFAULTS = {
            Navigation: {
                Class: {
                    Active: "active",
                },
                Selector: {
                    ActiveParentLink: true,
                    Active: "body > header .nav-item.active",
                    Link: "body > header .nav-link[href^=\"${link}\"]",
                },
            },
            ResizeTimeout: 250,
            ScrollTimeout: 100,
            TouchThreshold: 0.66,
            LoadLink: 0
        };

        /* INITIALIZATION */

        // resolve options
        options = $.extend(true, DEFAULTS, options);

        // initialize variables
        let scrollAction = null, resizeAction = null, currentIndex = options.LoadLink, touchBegin;

        /* EVENTS */

        // on document loaded
        $(document).ready(function ()
        {
            // scroll to link defined by web address to fix any issues
            if (location.hash !== "") ScrollToLink(location.hash);
            else if (options.LoadLink >= 0) location.hash = links[options.LoadLink];
        });

        // on window resize
        $(window).on("resize", function ()
        {
            // clear previous resize resizeAction
            clearTimeout(resizeAction);

            // set pending resize resizeAction
            resizeAction = setTimeout(function ()
            {
                // clear previous resize resizeAction
                clearTimeout(resizeAction);
                resizeAction = null;

                // scroll to current link to adjust to new window size
                ScrollToLink(links[currentIndex]);
            }, options.ResizeTimeout);
        });

        // on element scrolling
        $("*").on("scroll", function (e)
        {
            // clear previous scroll action
            clearTimeout(scrollAction)
            scrollAction = null;
        });

        // on wheel scrolling
        $(window).on("wheel", function (e)
        {
            // if mouse wheel is scrolling up: scroll to previous link, otherwise scroll to next link
            if (e.originalEvent.deltaY < 0) ScrollToPreviousLink();
            else ScrollToNextLink();
        });

        // on document touch start
        $(document).on("touchstart", function (e)
        {
            // set location touch started
            touchBegin = e.originalEvent.touches[0].clientY;
        });

        // on document touch end
        $(document).on("touchend", function (e)
        {
            // set location touch ended
            let touchEnd = e.originalEvent.changedTouches[0].clientY;

            // if distance between touches is less than threshold: scroll to previous link
            if (touchBegin - touchEnd < $(window).height() * -options.TouchThreshold) ScrollToPreviousLink();

            // if distance between touches is more than threshold: scroll to next link
            else if (touchBegin - touchEnd > $(window).height() * options.TouchThreshold) ScrollToNextLink();
        });

        // on navigation link click
        $(NavigationLink("#")).on("click", function (e)
        {
            // set link
            let link = $(this).attr("href");

            // scroll to link
            ScrollToLink(link);

            // prevent default behaviour
            e.preventDefault();
        });

        /* FUNCTIONS */

        /**
         * Scroll to previous link.
         */
        function ScrollToPreviousLink()
        {
            // set previous index
            let previousIndex = currentIndex - 1;

            // if current index is less than 0: go to final element in array
            if (previousIndex < 0) previousIndex = links.length - 1;

            // scroll to current index
            ScrollToLink(links[previousIndex]);
        }

        /**
         * Scroll to next link.
         */
        function ScrollToNextLink()
        {
            // set next index
            let nextIndex = currentIndex + 1;

            // if current index is greater than or equals array length: go to first element in array
            if (nextIndex >= links.length) nextIndex = 0;

            // scroll to current index
            ScrollToLink(links[nextIndex]);
        }

        /**
         * Scroll to link.
         *
         * @param {String} link
         */
        function ScrollToLink(link)
        {
            // link has to be valid and no scrolling can be under progress
            if (links.includes(link))
            {
                // clear previous scroll action
                clearTimeout(scrollAction);

                // set scroll action
                scrollAction = setTimeout(
                    function ()
                    {
                        // clear previous scroll action
                        clearTimeout(scrollAction);

                        // do animation
                        $("html,body").animate({
                            scrollTop: $(link).offset().top,
                        }, {
                            queue: false,
                            complete: function ()
                            {
                                // null previous scroll action
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
                                history.pushState(null, null, link);
                            },
                        });
                    }, options.ScrollTimeout
                );
            }
        }

        /**
         * Get path to navigation link.
         *
         * @param link
         * @returns {string}
         */
        function NavigationLink(link)
        {
            return options.Navigation.Selector.Link.replace("${link}", link);
        }

        return 1;
    }
});
