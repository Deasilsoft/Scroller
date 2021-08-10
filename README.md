# Deasilsoft/Scroller

Navigate your web page with a smooth scrolling animation.

Live demonstration on [our website](https://deasilsoft.com)
and [on GitHub pages](https://deasilsoft.github.io/Scroller/example/simple.html).

[![Code Inspector Score](https://www.code-inspector.com/project/26274/score/svg)](https://frontend.code-inspector.com/project/26274/dashboard)
[![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/deasilsoft/scroller/master?label=CodeFactor&logo=codefactor&logoWidth=18)](https://www.codefactor.io/repository/github/deasilsoft/scroller)
[![LGTM Alerts](https://img.shields.io/lgtm/alerts/github/Deasilsoft/Scroller?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Deasilsoft/Scroller/context:javascript)  
[![Github Watchers](https://img.shields.io/github/watchers/deasilsoft/Scroller?logo=github&logoWidth=18)](https://github.com/Deasilsoft/Scroller/watchers)
[![Github Stars](https://img.shields.io/github/stars/deasilsoft/Scroller?logo=github&logoWidth=18)](https://github.com/Deasilsoft/Scroller/stargazers)
[![Github Forks](https://img.shields.io/github/forks/deasilsoft/Scroller?logo=github&logoWidth=18)](https://github.com/Deasilsoft/Scroller/network/members)
[![Github Issues](https://img.shields.io/github/issues-raw/deasilsoft/Scroller?logo=github&logoWidth=18)](https://github.com/Deasilsoft/Scroller/issues)
[![Github Contributors](https://img.shields.io/github/contributors/deasilsoft/Scroller?logo=github&logoWidth=18)](https://github.com/Deasilsoft/Scroller/pulls)
[![Github Commits](https://img.shields.io/github/last-commit/deasilsoft/Scroller?logo=github&logoWidth=18)](https://github.com/Deasilsoft/Scroller/commits/master)

---

## Requirements

* jQuery 3.3.1< (not slim)

---

## Installation

1. Download [`dist/scroller.min.js`](https://raw.githubusercontent.com/Deasilsoft/Scroller/master/dist/scroller.min.js)
   from this GitHub Repository.
2. Place `scroller.min.js` in a public JavaScript directory.

---

## Usage

Load the library and initialize the `window.Deasilsoft.Scroller(links, userOptions)` function.

### Parameters

#### links (Required)

The array of `links`. A `link` is usually an octothorpe followed by a single word to describe the contents of that page.
The order of every `link` will matter, as the going to the previous or next page will strictly follow your `links`
order. The first and last `link` will loop.

#### userOptions (Optional)

##### Default values:

    {
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
    }

##### Navigation.Class.Active

The HTML class attribute that indicates which `link` is currently active.
`(default: "active")`

##### Navigation.Selector.ActiveParentLink

`true`: Apply `Navigation.Class.Active` to parent of `link` anchor.
`(default)`

`false`: Apply `Navigation.Class.Active` to `link` anchor.

##### Navigation.Selector.Active

The selector to the currently active `link`.
`(default: "body > header .nav-item.active")`

##### Navigation.Selector.Link

The selector to a particular `link`. This will replace `{{ link }}` with the `link`.
`(default: "body > header .nav-link[href^='{{link}}']")`

##### ResizeTimeout

The time in milliseconds between last `resize` event and our trigger to adjust to the current `link`.
`(default: 250)`

##### ScrollTimeout

The time in millisecond between `scroll` and our trigger to go to the previous or next `link`.
`(default: 100)`

##### TouchThreshold

The % of the screen mobile users need to swipe in order to go to previous or next `link`. A high % is adviced.
`(default: 0.66)`

##### LoadLink

The default `link` to start the document on. 0 is the first `link` in your array of `links`.
`(default: 0)`

### Example

    <!-- jQuery is required -->
    <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha384-tsQFqpEReu7ZLhBV2VZlAu7zcOV+rXbYlF2cqB8txI/8aZajjp4Bqd+V6D5IgvKT" crossorigin="anonymous"></script>
    
    <!-- Load the libarary -->
    <script type="text/javascript" src="scroller.min.js"></script>

    <!-- Initialize the instance -->
    <script type="text/javascript">
        window.Deasilsoft.Scroller(["#home", "#products", "#about", "#contact"]);
    </script>
