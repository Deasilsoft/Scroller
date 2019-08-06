# Deasilsoft/Scroller

A tiny library to handle navigation between HTML IDs.

## Example of implementation

    <script type="text/javascript" src="jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="deasilsoft-scroller-2.0.js"></script>
    <script type="text/javascript">
        DeasilsoftScroller(["#home", "#products", "#about", "#contact"]);
    </script>

## Requirements

jQuery is required, version 3.3.1 or later is supported.

## Usage

### Parameters

`DeasilsoftScroller` accepts two parameters, respectively `links` and `options`.

`links` is a simple array of HTML IDs prefixed with `#`.

`options` is an object with values used to configure the library.

#### Options

##### Explanations

* `nav.classes.active` The class to add to targeted navigation link on page ID arrival.
* `nav.paths.active` Path to active element to remove previously assigned class.
* `nav.paths.link` Path to targeted navigation link associated with page ID found in `${link}`.
* `resize.timer` In milliseconds, the time between window resize to scroll action.
* `touch.percentage` Percentage of page height required to scroll to previous/next page ID.

##### Default options

    let options = {
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

##### Example usage

Change `nav.classes.active` from `active` to `clicked`.

    <script type="text/javascript">
        let options = {
            "nav": {
                "classes": {
                    "active": "clicked",
                },
            },
        };

        DeasilsoftScroller(["#home", "#products", "#about", "#contact"], options);
    </script>

### Return values

`DeasilsoftScroller` returns a `Number`.

* `-1` jQuery is undefined.
* `-2` `links` is invalid.
* `-3` `options` is invalid.
* `1` Successfully loaded.

## Demonstration

Page navigation is handled by Deasilsoft/Scroller on https://deasilsoft.com.
