/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 * local.carl
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
    var
    // The deferred used on DOM ready
        readyList,

    // A central reference to the root jQuery(document)
        rootjQuery,

    // Support: IE<9
    // For `typeof node.method` instead of `node.method !== undefined`
        core_strundefined = typeof undefined,

    // Use the correct document accordingly with window argument (sandbox)
        document = window.document,
        location = window.location,

    // Map over jQuery in case of overwrite
        _jQuery = window.jQuery,

    // Map over the $ in case of overwrite
        _$ = window.$,

    // [[Class]] -> type pairs
        class2type = {},

    // List of deleted data cache ids, so we can reuse them
        core_deletedIds = [],

        core_version = "1.9.1",

    // Save a reference to some core methods
        core_concat = core_deletedIds.concat,
        core_push = core_deletedIds.push,
        core_slice = core_deletedIds.slice,
        core_indexOf = core_deletedIds.indexOf,
        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty,
        core_trim = core_version.trim,

    // Define a local copy of jQuery
        jQuery = function( selector, context ) {
            // The jQuery object is actually just the init constructor 'enhanced'
            return new jQuery.fn.init( selector, context, rootjQuery );
        },

    // Used for matching numbers
        core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

    // Used for splitting on whitespace
        core_rnotwhite = /\S+/g,

    // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

    // A simple way to check for HTML strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    // Strict HTML recognition (#11290: must start with <)
        rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

    // Match a standalone tag
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

    // JSON RegExp
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

    // Matches dashed string for camelizing
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,

    // Used by jQuery.camelCase as callback to replace()
        fcamelCase = function( all, letter ) {
            return letter.toUpperCase();
        },

    // The ready event handler
        completed = function( event ) {

            // readyState === "complete" is good enough for us to call the dom ready in oldIE
            if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
                detach();
                jQuery.ready();
            }
        },
    // Clean-up method for dom ready events
        detach = function() {
            if ( document.addEventListener ) {
                document.removeEventListener( "DOMContentLoaded", completed, false );
                window.removeEventListener( "load", completed, false );

            } else {
                document.detachEvent( "onreadystatechange", completed );
                window.detachEvent( "onload", completed );
            }
        };

    jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: core_version,

        constructor: jQuery,
        init: function( selector, context, rootjQuery ) {
            var match, elem;

            // HANDLE: $(""), $(null), $(undefined), $(false)
            if ( !selector ) {
                return this;
            }

            // Handle HTML strings
            if ( typeof selector === "string" ) {
                if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
                    // Assume that strings that start and end with <> are HTML and skip the regex check
                    match = [ null, selector, null ];

                } else {
                    match = rquickExpr.exec( selector );
                }

                // Match html or make sure no context is specified for #id
                if ( match && (match[1] || !context) ) {

                    // HANDLE: $(html) -> $(array)
                    if ( match[1] ) {
                        context = context instanceof jQuery ? context[0] : context;

                        // scripts is true for back-compat
                        jQuery.merge( this, jQuery.parseHTML(
                            match[1],
                            context && context.nodeType ? context.ownerDocument || context : document,
                            true
                        ) );

                        // HANDLE: $(html, props)
                        if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
                            for ( match in context ) {
                                // Properties of context are called as methods if possible
                                if ( jQuery.isFunction( this[ match ] ) ) {
                                    this[ match ]( context[ match ] );

                                    // ...and otherwise set as attributes
                                } else {
                                    this.attr( match, context[ match ] );
                                }
                            }
                        }

                        return this;

                        // HANDLE: $(#id)
                    } else {
                        elem = document.getElementById( match[2] );

                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if ( elem && elem.parentNode ) {
                            // Handle the case where IE and Opera return items
                            // by name instead of ID
                            if ( elem.id !== match[2] ) {
                                return rootjQuery.find( selector );
                            }

                            // Otherwise, we inject the element directly into the jQuery object
                            this.length = 1;
                            this[0] = elem;
                        }

                        this.context = document;
                        this.selector = selector;
                        return this;
                    }

                    // HANDLE: $(expr, $(...))
                } else if ( !context || context.jquery ) {
                    return ( context || rootjQuery ).find( selector );

                    // HANDLE: $(expr, context)
                    // (which is just equivalent to: $(context).find(expr)
                } else {
                    return this.constructor( context ).find( selector );
                }

                // HANDLE: $(DOMElement)
            } else if ( selector.nodeType ) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;

                // HANDLE: $(function)
                // Shortcut for document ready
            } else if ( jQuery.isFunction( selector ) ) {
                return rootjQuery.ready( selector );
            }

            if ( selector.selector !== undefined ) {
                this.selector = selector.selector;
                this.context = selector.context;
            }

            return jQuery.makeArray( selector, this );
        },

        // Start with an empty selector
        selector: "",

        // The default length of a jQuery object is 0
        length: 0,

        // The number of elements contained in the matched element set
        size: function() {
            return this.length;
        },

        toArray: function() {
            return core_slice.call( this );
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function( num ) {
            return num == null ?

                // Return a 'clean' array
                this.toArray() :

                // Return just the object
                ( num < 0 ? this[ this.length + num ] : this[ num ] );
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function( elems ) {

            // Build a new jQuery matched element set
            var ret = jQuery.merge( this.constructor(), elems );

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;
            ret.context = this.context;

            // Return the newly-formed element set
            return ret;
        },

        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function( callback, args ) {
            return jQuery.each( this, callback, args );
        },

        ready: function( fn ) {
            // Add the callback
            jQuery.ready.promise().done( fn );

            return this;
        },

        slice: function() {
            return this.pushStack( core_slice.apply( this, arguments ) );
        },

        first: function() {
            return this.eq( 0 );
        },

        last: function() {
            return this.eq( -1 );
        },

        eq: function( i ) {
            var len = this.length,
                j = +i + ( i < 0 ? len : 0 );
            return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
        },

        map: function( callback ) {
            return this.pushStack( jQuery.map(this, function( elem, i ) {
                return callback.call( elem, i, elem );
            }));
        },

        end: function() {
            return this.prevObject || this.constructor(null);
        },

        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: core_push,
        sort: [].sort,
        splice: [].splice
    };

// Give the init function the jQuery prototype for later instantiation
    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.extend = jQuery.fn.extend = function() {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if ( length === i ) {
            target = this;
            --i;
        }

        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = jQuery.extend( deep, clone, copy );

                        // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    jQuery.extend({
        noConflict: function( deep ) {
            if ( window.$ === jQuery ) {
                window.$ = _$;
            }

            if ( deep && window.jQuery === jQuery ) {
                window.jQuery = _jQuery;
            }

            return jQuery;
        },

        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,

        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,

        // Hold (or release) the ready event
        holdReady: function( hold ) {
            if ( hold ) {
                jQuery.readyWait++;
            } else {
                jQuery.ready( true );
            }
        },

        // Handle when the DOM is ready
        ready: function( wait ) {

            // Abort if there are pending holds or we're already ready
            if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
                return;
            }

            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( !document.body ) {
                return setTimeout( jQuery.ready );
            }

            // Remember that the DOM is ready
            jQuery.isReady = true;

            // If a normal DOM Ready event fired, decrement, and wait if need be
            if ( wait !== true && --jQuery.readyWait > 0 ) {
                return;
            }

            // If there are functions bound, to execute
            readyList.resolveWith( document, [ jQuery ] );

            // Trigger any bound ready events
            if ( jQuery.fn.trigger ) {
                jQuery( document ).trigger("ready").off("ready");
            }
        },

        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
        isFunction: function( obj ) {
            return jQuery.type(obj) === "function";
        },

        isArray: Array.isArray || function( obj ) {
            return jQuery.type(obj) === "array";
        },

        isWindow: function( obj ) {
            return obj != null && obj == obj.window;
        },

        isNumeric: function( obj ) {
            return !isNaN( parseFloat(obj) ) && isFinite( obj );
        },

        type: function( obj ) {
            if ( obj == null ) {
                return String( obj );
            }
            return typeof obj === "object" || typeof obj === "function" ?
            class2type[ core_toString.call(obj) ] || "object" :
                typeof obj;
        },

        isPlainObject: function( obj ) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
                return false;
            }

            try {
                // Not own constructor property must be Object
                if ( obj.constructor &&
                    !core_hasOwn.call(obj, "constructor") &&
                    !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                    return false;
                }
            } catch ( e ) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.

            var key;
            for ( key in obj ) {}

            return key === undefined || core_hasOwn.call( obj, key );
        },

        isEmptyObject: function( obj ) {
            var name;
            for ( name in obj ) {
                return false;
            }
            return true;
        },

        error: function( msg ) {
            throw new Error( msg );
        },

        // data: string of html
        // context (optional): If specified, the fragment will be created in this context, defaults to document
        // keepScripts (optional): If true, will include scripts passed in the html string
        parseHTML: function( data, context, keepScripts ) {
            if ( !data || typeof data !== "string" ) {
                return null;
            }
            if ( typeof context === "boolean" ) {
                keepScripts = context;
                context = false;
            }
            context = context || document;

            var parsed = rsingleTag.exec( data ),
                scripts = !keepScripts && [];

            // Single tag
            if ( parsed ) {
                return [ context.createElement( parsed[1] ) ];
            }

            parsed = jQuery.buildFragment( [ data ], context, scripts );
            if ( scripts ) {
                jQuery( scripts ).remove();
            }
            return jQuery.merge( [], parsed.childNodes );
        },

        parseJSON: function( data ) {
            // Attempt to parse using the native JSON parser first
            if ( window.JSON && window.JSON.parse ) {
                return window.JSON.parse( data );
            }

            if ( data === null ) {
                return data;
            }

            if ( typeof data === "string" ) {

                // Make sure leading/trailing whitespace is removed (IE can't handle it)
                data = jQuery.trim( data );

                if ( data ) {
                    // Make sure the incoming data is actual JSON
                    // Logic borrowed from http://json.org/json2.js
                    if ( rvalidchars.test( data.replace( rvalidescape, "@" )
                            .replace( rvalidtokens, "]" )
                            .replace( rvalidbraces, "")) ) {

                        return ( new Function( "return " + data ) )();
                    }
                }
            }

            jQuery.error( "Invalid JSON: " + data );
        },

        // Cross-browser xml parsing
        parseXML: function( data ) {
            var xml, tmp;
            if ( !data || typeof data !== "string" ) {
                return null;
            }
            try {
                if ( window.DOMParser ) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString( data , "text/xml" );
                } else { // IE
                    xml = new ActiveXObject( "Microsoft.XMLDOM" );
                    xml.async = "false";
                    xml.loadXML( data );
                }
            } catch( e ) {
                xml = undefined;
            }
            if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
                jQuery.error( "Invalid XML: " + data );
            }
            return xml;
        },

        noop: function() {},

        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        globalEval: function( data ) {
            if ( data && jQuery.trim( data ) ) {
                // We use execScript on Internet Explorer
                // We use an anonymous function so that context is window
                // rather than jQuery in Firefox
                ( window.execScript || function( data ) {
                    window[ "eval" ].call( window, data );
                } )( data );
            }
        },

        // Convert dashed to camelCase; used by the css and data modules
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function( string ) {
            return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
        },

        nodeName: function( elem, name ) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },

        // args is for internal usage only
        each: function( obj, callback, args ) {
            var value,
                i = 0,
                length = obj.length,
                isArray = isArraylike( obj );

            if ( args ) {
                if ( isArray ) {
                    for ( ; i < length; i++ ) {
                        value = callback.apply( obj[ i ], args );

                        if ( value === false ) {
                            break;
                        }
                    }
                } else {
                    for ( i in obj ) {
                        value = callback.apply( obj[ i ], args );

                        if ( value === false ) {
                            break;
                        }
                    }
                }

                // A special, fast, case for the most common use of each
            } else {
                if ( isArray ) {
                    for ( ; i < length; i++ ) {
                        value = callback.call( obj[ i ], i, obj[ i ] );

                        if ( value === false ) {
                            break;
                        }
                    }
                } else {
                    for ( i in obj ) {
                        value = callback.call( obj[ i ], i, obj[ i ] );

                        if ( value === false ) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },

        // Use native String.trim function wherever possible
        trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
            function( text ) {
                return text == null ?
                    "" :
                    core_trim.call( text );
            } :

            // Otherwise use our own trimming functionality
            function( text ) {
                return text == null ?
                    "" :
                    ( text + "" ).replace( rtrim, "" );
            },

        // results is for internal usage only
        makeArray: function( arr, results ) {
            var ret = results || [];

            if ( arr != null ) {
                if ( isArraylike( Object(arr) ) ) {
                    jQuery.merge( ret,
                        typeof arr === "string" ?
                            [ arr ] : arr
                    );
                } else {
                    core_push.call( ret, arr );
                }
            }

            return ret;
        },

        inArray: function( elem, arr, i ) {
            var len;

            if ( arr ) {
                if ( core_indexOf ) {
                    return core_indexOf.call( arr, elem, i );
                }

                len = arr.length;
                i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

                for ( ; i < len; i++ ) {
                    // Skip accessing in sparse arrays
                    if ( i in arr && arr[ i ] === elem ) {
                        return i;
                    }
                }
            }

            return -1;
        },

        merge: function( first, second ) {
            var l = second.length,
                i = first.length,
                j = 0;

            if ( typeof l === "number" ) {
                for ( ; j < l; j++ ) {
                    first[ i++ ] = second[ j ];
                }
            } else {
                while ( second[j] !== undefined ) {
                    first[ i++ ] = second[ j++ ];
                }
            }

            first.length = i;

            return first;
        },

        grep: function( elems, callback, inv ) {
            var retVal,
                ret = [],
                i = 0,
                length = elems.length;
            inv = !!inv;

            // Go through the array, only saving the items
            // that pass the validator function
            for ( ; i < length; i++ ) {
                retVal = !!callback( elems[ i ], i );
                if ( inv !== retVal ) {
                    ret.push( elems[ i ] );
                }
            }

            return ret;
        },

        // arg is for internal usage only
        map: function( elems, callback, arg ) {
            var value,
                i = 0,
                length = elems.length,
                isArray = isArraylike( elems ),
                ret = [];

            // Go through the array, translating each of the items to their
            if ( isArray ) {
                for ( ; i < length; i++ ) {
                    value = callback( elems[ i ], i, arg );

                    if ( value != null ) {
                        ret[ ret.length ] = value;
                    }
                }

                // Go through every key on the object,
            } else {
                for ( i in elems ) {
                    value = callback( elems[ i ], i, arg );

                    if ( value != null ) {
                        ret[ ret.length ] = value;
                    }
                }
            }

            // Flatten any nested arrays
            return core_concat.apply( [], ret );
        },

        // A global GUID counter for objects
        guid: 1,

        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function( fn, context ) {
            var args, proxy, tmp;

            if ( typeof context === "string" ) {
                tmp = fn[ context ];
                context = fn;
                fn = tmp;
            }

            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if ( !jQuery.isFunction( fn ) ) {
                return undefined;
            }

            // Simulated bind
            args = core_slice.call( arguments, 2 );
            proxy = function() {
                return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
            };

            // Set the guid of unique handler to the same of original handler, so it can be removed
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;

            return proxy;
        },

        // Multifunctional method to get and set values of a collection
        // The value/s can optionally be executed if it's a function
        access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
            var i = 0,
                length = elems.length,
                bulk = key == null;

            // Sets many values
            if ( jQuery.type( key ) === "object" ) {
                chainable = true;
                for ( i in key ) {
                    jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
                }

                // Sets one value
            } else if ( value !== undefined ) {
                chainable = true;

                if ( !jQuery.isFunction( value ) ) {
                    raw = true;
                }

                if ( bulk ) {
                    // Bulk operations run against the entire set
                    if ( raw ) {
                        fn.call( elems, value );
                        fn = null;

                        // ...except when executing function values
                    } else {
                        bulk = fn;
                        fn = function( elem, key, value ) {
                            return bulk.call( jQuery( elem ), value );
                        };
                    }
                }

                if ( fn ) {
                    for ( ; i < length; i++ ) {
                        fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
                    }
                }
            }

            return chainable ?
                elems :

                // Gets
                bulk ?
                    fn.call( elems ) :
                    length ? fn( elems[0], key ) : emptyGet;
        },

        now: function() {
            return ( new Date() ).getTime();
        }
    });

    jQuery.ready.promise = function( obj ) {
        if ( !readyList ) {

            readyList = jQuery.Deferred();

            // Catch cases where $(document).ready() is called after the browser event has already occurred.
            // we once tried to use readyState "interactive" here, but it caused issues like the one
            // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
            if ( document.readyState === "complete" ) {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                setTimeout( jQuery.ready );

                // Standards-based browsers support DOMContentLoaded
            } else if ( document.addEventListener ) {
                // Use the handy event callback
                document.addEventListener( "DOMContentLoaded", completed, false );

                // A fallback to window.onload, that will always work
                window.addEventListener( "load", completed, false );

                // If IE event model is used
            } else {
                // Ensure firing before onload, maybe late but safe also for iframes
                document.attachEvent( "onreadystatechange", completed );

                // A fallback to window.onload, that will always work
                window.attachEvent( "onload", completed );

                // If IE and not a frame
                // continually check to see if the document is ready
                var top = false;

                try {
                    top = window.frameElement == null && document.documentElement;
                } catch(e) {}

                if ( top && top.doScroll ) {
                    (function doScrollCheck() {
                        if ( !jQuery.isReady ) {

                            try {
                                // Use the trick by Diego Perini
                                // http://javascript.nwbox.com/IEContentLoaded/
                                top.doScroll("left");
                            } catch(e) {
                                return setTimeout( doScrollCheck, 50 );
                            }

                            // detach all dom ready events
                            detach();

                            // and execute any waiting functions
                            jQuery.ready();
                        }
                    })();
                }
            }
        }
        return readyList.promise( obj );
    };

// Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
    });

    function isArraylike( obj ) {
        var length = obj.length,
            type = jQuery.type( obj );

        if ( jQuery.isWindow( obj ) ) {
            return false;
        }

        if ( obj.nodeType === 1 && length ) {
            return true;
        }

        return type === "array" || type !== "function" &&
            ( length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in obj );
    }

// All jQuery objects should point back to these
    rootjQuery = jQuery(document);
// String to Object options format cache
    var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
    function createOptions( options ) {
        var object = optionsCache[ options ] = {};
        jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
            object[ flag ] = true;
        });
        return object;
    }

    /*
     * Create a callback list using the following parameters:
     *
     *	options: an optional list of space-separated options that will change how
     *			the callback list behaves or a more traditional option object
     *
     * By default a callback list will act like an event callback list and can be
     * "fired" multiple times.
     *
     * Possible options:
     *
     *	once:			will ensure the callback list can only be fired once (like a Deferred)
     *
     *	memory:			will keep track of previous values and will call any callback added
     *					after the list has been fired right away with the latest "memorized"
     *					values (like a Deferred)
     *
     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
     *
     *	stopOnFalse:	interrupt callings when a callback returns false
     *
     */
    jQuery.Callbacks = function( options ) {

        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === "string" ?
            ( optionsCache[ options ] || createOptions( options ) ) :
            jQuery.extend( {}, options );

        var // Flag to know if list is currently firing
            firing,
        // Last fire value (for non-forgettable lists)
            memory,
        // Flag to know if list was already fired
            fired,
        // End of the loop when firing
            firingLength,
        // Index of currently firing callback (modified by remove if needed)
            firingIndex,
        // First callback to fire (used internally by add and fireWith)
            firingStart,
        // Actual callback list
            list = [],
        // Stack of fire calls for repeatable lists
            stack = !options.once && [],
        // Fire callbacks
            fire = function( data ) {
                memory = options.memory && data;
                fired = true;
                firingIndex = firingStart || 0;
                firingStart = 0;
                firingLength = list.length;
                firing = true;
                for ( ; list && firingIndex < firingLength; firingIndex++ ) {
                    if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
                        memory = false; // To prevent further calls using add
                        break;
                    }
                }
                firing = false;
                if ( list ) {
                    if ( stack ) {
                        if ( stack.length ) {
                            fire( stack.shift() );
                        }
                    } else if ( memory ) {
                        list = [];
                    } else {
                        self.disable();
                    }
                }
            },
        // Actual Callbacks object
            self = {
                // Add a callback or a collection of callbacks to the list
                add: function() {
                    if ( list ) {
                        // First, we save the current length
                        var start = list.length;
                        (function add( args ) {
                            jQuery.each( args, function( _, arg ) {
                                var type = jQuery.type( arg );
                                if ( type === "function" ) {
                                    if ( !options.unique || !self.has( arg ) ) {
                                        list.push( arg );
                                    }
                                } else if ( arg && arg.length && type !== "string" ) {
                                    // Inspect recursively
                                    add( arg );
                                }
                            });
                        })( arguments );
                        // Do we need to add the callbacks to the
                        // current firing batch?
                        if ( firing ) {
                            firingLength = list.length;
                            // With memory, if we're not firing then
                            // we should call right away
                        } else if ( memory ) {
                            firingStart = start;
                            fire( memory );
                        }
                    }
                    return this;
                },
                // Remove a callback from the list
                remove: function() {
                    if ( list ) {
                        jQuery.each( arguments, function( _, arg ) {
                            var index;
                            while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
                                list.splice( index, 1 );
                                // Handle firing indexes
                                if ( firing ) {
                                    if ( index <= firingLength ) {
                                        firingLength--;
                                    }
                                    if ( index <= firingIndex ) {
                                        firingIndex--;
                                    }
                                }
                            }
                        });
                    }
                    return this;
                },
                // Check if a given callback is in the list.
                // If no argument is given, return whether or not list has callbacks attached.
                has: function( fn ) {
                    return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
                },
                // Remove all callbacks from the list
                empty: function() {
                    list = [];
                    return this;
                },
                // Have the list do nothing anymore
                disable: function() {
                    list = stack = memory = undefined;
                    return this;
                },
                // Is it disabled?
                disabled: function() {
                    return !list;
                },
                // Lock the list in its current state
                lock: function() {
                    stack = undefined;
                    if ( !memory ) {
                        self.disable();
                    }
                    return this;
                },
                // Is it locked?
                locked: function() {
                    return !stack;
                },
                // Call all callbacks with the given context and arguments
                fireWith: function( context, args ) {
                    args = args || [];
                    args = [ context, args.slice ? args.slice() : args ];
                    if ( list && ( !fired || stack ) ) {
                        if ( firing ) {
                            stack.push( args );
                        } else {
                            fire( args );
                        }
                    }
                    return this;
                },
                // Call all the callbacks with the given arguments
                fire: function() {
                    self.fireWith( this, arguments );
                    return this;
                },
                // To know if the callbacks have already been called at least once
                fired: function() {
                    return !!fired;
                }
            };

        return self;
    };
    jQuery.extend({

        Deferred: function( func ) {
            var tuples = [
                    // action, add listener, listener list, final state
                    [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
                    [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
                    [ "notify", "progress", jQuery.Callbacks("memory") ]
                ],
                state = "pending",
                promise = {
                    state: function() {
                        return state;
                    },
                    always: function() {
                        deferred.done( arguments ).fail( arguments );
                        return this;
                    },
                    then: function( /* fnDone, fnFail, fnProgress */ ) {
                        var fns = arguments;
                        return jQuery.Deferred(function( newDefer ) {
                            jQuery.each( tuples, function( i, tuple ) {
                                var action = tuple[ 0 ],
                                    fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
                                // deferred[ done | fail | progress ] for forwarding actions to newDefer
                                deferred[ tuple[1] ](function() {
                                    var returned = fn && fn.apply( this, arguments );
                                    if ( returned && jQuery.isFunction( returned.promise ) ) {
                                        returned.promise()
                                            .done( newDefer.resolve )
                                            .fail( newDefer.reject )
                                            .progress( newDefer.notify );
                                    } else {
                                        newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
                                    }
                                });
                            });
                            fns = null;
                        }).promise();
                    },
                    // Get a promise for this deferred
                    // If obj is provided, the promise aspect is added to the object
                    promise: function( obj ) {
                        return obj != null ? jQuery.extend( obj, promise ) : promise;
                    }
                },
                deferred = {};

            // Keep pipe for back-compat
            promise.pipe = promise.then;

            // Add list-specific methods
            jQuery.each( tuples, function( i, tuple ) {
                var list = tuple[ 2 ],
                    stateString = tuple[ 3 ];

                // promise[ done | fail | progress ] = list.add
                promise[ tuple[1] ] = list.add;

                // Handle state
                if ( stateString ) {
                    list.add(function() {
                        // state = [ resolved | rejected ]
                        state = stateString;

                        // [ reject_list | resolve_list ].disable; progress_list.lock
                    }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
                }

                // deferred[ resolve | reject | notify ]
                deferred[ tuple[0] ] = function() {
                    deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
                    return this;
                };
                deferred[ tuple[0] + "With" ] = list.fireWith;
            });

            // Make the deferred a promise
            promise.promise( deferred );

            // Call given func if any
            if ( func ) {
                func.call( deferred, deferred );
            }

            // All done!
            return deferred;
        },

        // Deferred helper
        when: function( subordinate /* , ..., subordinateN */ ) {
            var i = 0,
                resolveValues = core_slice.call( arguments ),
                length = resolveValues.length,

            // the count of uncompleted subordinates
                remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

            // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
                deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

            // Update function for both resolve and progress values
                updateFunc = function( i, contexts, values ) {
                    return function( value ) {
                        contexts[ i ] = this;
                        values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
                        if( values === progressValues ) {
                            deferred.notifyWith( contexts, values );
                        } else if ( !( --remaining ) ) {
                            deferred.resolveWith( contexts, values );
                        }
                    };
                },

                progressValues, progressContexts, resolveContexts;

            // add listeners to Deferred subordinates; treat others as resolved
            if ( length > 1 ) {
                progressValues = new Array( length );
                progressContexts = new Array( length );
                resolveContexts = new Array( length );
                for ( ; i < length; i++ ) {
                    if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
                        resolveValues[ i ].promise()
                            .done( updateFunc( i, resolveContexts, resolveValues ) )
                            .fail( deferred.reject )
                            .progress( updateFunc( i, progressContexts, progressValues ) );
                    } else {
                        --remaining;
                    }
                }
            }

            // if we're not waiting on anything, resolve the master
            if ( !remaining ) {
                deferred.resolveWith( resolveContexts, resolveValues );
            }

            return deferred.promise();
        }
    });
    jQuery.support = (function() {

        var support, all, a,
            input, select, fragment,
            opt, eventName, isSupported, i,
            div = document.createElement("div");

        // Setup
        div.setAttribute( "className", "t" );
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

        // Support tests won't run in some limited or non-browser environments
        all = div.getElementsByTagName("*");
        a = div.getElementsByTagName("a")[ 0 ];
        if ( !all || !a || !all.length ) {
            return {};
        }

        // First batch of tests
        select = document.createElement("select");
        opt = select.appendChild( document.createElement("option") );
        input = div.getElementsByTagName("input")[ 0 ];

        a.style.cssText = "top:1px;float:left;opacity:.5";
        support = {
            // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
            getSetAttribute: div.className !== "t",

            // IE strips leading whitespace when .innerHTML is used
            leadingWhitespace: div.firstChild.nodeType === 3,

            // Make sure that tbody elements aren't automatically inserted
            // IE will insert them into empty tables
            tbody: !div.getElementsByTagName("tbody").length,

            // Make sure that link elements get serialized correctly by innerHTML
            // This requires a wrapper element in IE
            htmlSerialize: !!div.getElementsByTagName("link").length,

            // Get the style information from getAttribute
            // (IE uses .cssText instead)
            style: /top/.test( a.getAttribute("style") ),

            // Make sure that URLs aren't manipulated
            // (IE normalizes it by default)
            hrefNormalized: a.getAttribute("href") === "/a",

            // Make sure that element opacity exists
            // (IE uses filter instead)
            // Use a regex to work around a WebKit issue. See #5145
            opacity: /^0.5/.test( a.style.opacity ),

            // Verify style float existence
            // (IE uses styleFloat instead of cssFloat)
            cssFloat: !!a.style.cssFloat,

            // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
            checkOn: !!input.value,

            // Make sure that a selected-by-default option has a working selected property.
            // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
            optSelected: opt.selected,

            // Tests for enctype support on a form (#6743)
            enctype: !!document.createElement("form").enctype,

            // Makes sure cloning an html5 element does not cause problems
            // Where outerHTML is undefined, this still works
            html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

            // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
            boxModel: document.compatMode === "CSS1Compat",

            // Will be defined later
            deleteExpando: true,
            noCloneEvent: true,
            inlineBlockNeedsLayout: false,
            shrinkWrapBlocks: false,
            reliableMarginRight: true,
            boxSizingReliable: true,
            pixelPosition: false
        };

        // Make sure checked status is properly cloned
        input.checked = true;
        support.noCloneChecked = input.cloneNode( true ).checked;

        // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as disabled)
        select.disabled = true;
        support.optDisabled = !opt.disabled;

        // Support: IE<9
        try {
            delete div.test;
        } catch( e ) {
            support.deleteExpando = false;
        }

        // Check if we can trust getAttribute("value")
        input = document.createElement("input");
        input.setAttribute( "value", "" );
        support.input = input.getAttribute( "value" ) === "";

        // Check if an input maintains its value after becoming a radio
        input.value = "t";
        input.setAttribute( "type", "radio" );
        support.radioValue = input.value === "t";

        // #11217 - WebKit loses check when the name is after the checked attribute
        input.setAttribute( "checked", "t" );
        input.setAttribute( "name", "t" );

        fragment = document.createDocumentFragment();
        fragment.appendChild( input );

        // Check if a disconnected checkbox will retain its checked
        // value of true after appended to the DOM (IE6/7)
        support.appendChecked = input.checked;

        // WebKit doesn't clone checked state correctly in fragments
        support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

        // Support: IE<9
        // Opera does not clone events (and typeof div.attachEvent === undefined).
        // IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
        if ( div.attachEvent ) {
            div.attachEvent( "onclick", function() {
                support.noCloneEvent = false;
            });

            div.cloneNode( true ).click();
        }

        // Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
        // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
        for ( i in { submit: true, change: true, focusin: true }) {
            div.setAttribute( eventName = "on" + i, "t" );

            support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
        }

        div.style.backgroundClip = "content-box";
        div.cloneNode( true ).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";

        // Run tests that need a body at doc ready
        jQuery(function() {
            var container, marginDiv, tds,
                divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
                body = document.getElementsByTagName("body")[0];

            if ( !body ) {
                // Return for frameset docs that don't have a body
                return;
            }

            container = document.createElement("div");
            container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

            body.appendChild( container ).appendChild( div );

            // Support: IE8
            // Check if table cells still have offsetWidth/Height when they are set
            // to display:none and there are still other visible table cells in a
            // table row; if so, offsetWidth/Height are not reliable for use when
            // determining if an element has been hidden directly using
            // display:none (it is still safe to use offsets if a parent element is
            // hidden; don safety goggles and see bug #4512 for more information).
            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
            tds = div.getElementsByTagName("td");
            tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
            isSupported = ( tds[ 0 ].offsetHeight === 0 );

            tds[ 0 ].style.display = "";
            tds[ 1 ].style.display = "none";

            // Support: IE8
            // Check if empty table cells still have offsetWidth/Height
            support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

            // Check box-sizing and margin behavior
            div.innerHTML = "";
            div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
            support.boxSizing = ( div.offsetWidth === 4 );
            support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

            // Use window.getComputedStyle because jsdom on node.js will break without it.
            if ( window.getComputedStyle ) {
                support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
                support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

                // Check if div with explicit width and no margin-right incorrectly
                // gets computed margin-right based on width of container. (#3333)
                // Fails in WebKit before Feb 2011 nightlies
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                marginDiv = div.appendChild( document.createElement("div") );
                marginDiv.style.cssText = div.style.cssText = divReset;
                marginDiv.style.marginRight = marginDiv.style.width = "0";
                div.style.width = "1px";

                support.reliableMarginRight =
                    !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
            }

            if ( typeof div.style.zoom !== core_strundefined ) {
                // Support: IE<8
                // Check if natively block-level elements act like inline-block
                // elements when setting their display to 'inline' and giving
                // them layout
                div.innerHTML = "";
                div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
                support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

                // Support: IE6
                // Check if elements with layout shrink-wrap their children
                div.style.display = "block";
                div.innerHTML = "<div></div>";
                div.firstChild.style.width = "5px";
                support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

                if ( support.inlineBlockNeedsLayout ) {
                    // Prevent IE 6 from affecting layout for positioned elements #11048
                    // Prevent IE from shrinking the body in IE 7 mode #12869
                    // Support: IE<8
                    body.style.zoom = 1;
                }
            }

            body.removeChild( container );

            // Null elements to avoid leaks in IE
            container = div = tds = marginDiv = null;
        });

        // Null elements to avoid leaks in IE
        all = select = fragment = opt = a = input = null;

        return support;
    })();

    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        rmultiDash = /([A-Z])/g;

    function internalData( elem, name, data, pvt /* Internal Use Only */ ){
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }

        var thisCache, ret,
            internalKey = jQuery.expando,
            getByName = typeof name === "string",

        // We have to handle DOM nodes and JS objects differently because IE6-7
        // can't GC object references properly across the DOM-JS boundary
            isNode = elem.nodeType,

        // Only DOM nodes need the global jQuery cache; JS object data is
        // attached directly to the object so GC can occur automatically
            cache = isNode ? jQuery.cache : elem,

        // Only defining an ID for JS objects if its cache already exists allows
        // the code to shortcut on the same path as a DOM node with no cache
            id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

        // Avoid doing any more work than we need to when trying to get data on an
        // object that has no data at all
        if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
            return;
        }

        if ( !id ) {
            // Only DOM nodes need a new unique ID for each element since their data
            // ends up in the global cache
            if ( isNode ) {
                elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
            } else {
                id = internalKey;
            }
        }

        if ( !cache[ id ] ) {
            cache[ id ] = {};

            // Avoids exposing jQuery metadata on plain JS objects when the object
            // is serialized using JSON.stringify
            if ( !isNode ) {
                cache[ id ].toJSON = jQuery.noop;
            }
        }

        // An object can be passed to jQuery.data instead of a key/value pair; this gets
        // shallow copied over onto the existing cache
        if ( typeof name === "object" || typeof name === "function" ) {
            if ( pvt ) {
                cache[ id ] = jQuery.extend( cache[ id ], name );
            } else {
                cache[ id ].data = jQuery.extend( cache[ id ].data, name );
            }
        }

        thisCache = cache[ id ];

        // jQuery data() is stored in a separate object inside the object's internal data
        // cache in order to avoid key collisions between internal data and user-defined
        // data.
        if ( !pvt ) {
            if ( !thisCache.data ) {
                thisCache.data = {};
            }

            thisCache = thisCache.data;
        }

        if ( data !== undefined ) {
            thisCache[ jQuery.camelCase( name ) ] = data;
        }

        // Check for both converted-to-camel and non-converted data property names
        // If a data property was specified
        if ( getByName ) {

            // First Try to find as-is property data
            ret = thisCache[ name ];

            // Test for null|undefined property data
            if ( ret == null ) {

                // Try to find the camelCased property
                ret = thisCache[ jQuery.camelCase( name ) ];
            }
        } else {
            ret = thisCache;
        }

        return ret;
    }

    function internalRemoveData( elem, name, pvt ) {
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }

        var i, l, thisCache,
            isNode = elem.nodeType,

        // See jQuery.data for more information
            cache = isNode ? jQuery.cache : elem,
            id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

        // If there is already no cache entry for this object, there is no
        // purpose in continuing
        if ( !cache[ id ] ) {
            return;
        }

        if ( name ) {

            thisCache = pvt ? cache[ id ] : cache[ id ].data;

            if ( thisCache ) {

                // Support array or space separated string names for data keys
                if ( !jQuery.isArray( name ) ) {

                    // try the string as a key before any manipulation
                    if ( name in thisCache ) {
                        name = [ name ];
                    } else {

                        // split the camel cased version by spaces unless a key with the spaces exists
                        name = jQuery.camelCase( name );
                        if ( name in thisCache ) {
                            name = [ name ];
                        } else {
                            name = name.split(" ");
                        }
                    }
                } else {
                    // If "name" is an array of keys...
                    // When data is initially created, via ("key", "val") signature,
                    // keys will be converted to camelCase.
                    // Since there is no way to tell _how_ a key was added, remove
                    // both plain key and camelCase key. #12786
                    // This will only penalize the array argument path.
                    name = name.concat( jQuery.map( name, jQuery.camelCase ) );
                }

                for ( i = 0, l = name.length; i < l; i++ ) {
                    delete thisCache[ name[i] ];
                }

                // If there is no data left in the cache, we want to continue
                // and let the cache object itself get destroyed
                if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
                    return;
                }
            }
        }

        // See jQuery.data for more information
        if ( !pvt ) {
            delete cache[ id ].data;

            // Don't destroy the parent cache unless the internal data object
            // had been the only thing left in it
            if ( !isEmptyDataObject( cache[ id ] ) ) {
                return;
            }
        }

        // Destroy the cache
        if ( isNode ) {
            jQuery.cleanData( [ elem ], true );

            // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
        } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
            delete cache[ id ];

            // When all else fails, null
        } else {
            cache[ id ] = null;
        }
    }

    jQuery.extend({
        cache: {},

        // Unique for each copy of jQuery on the page
        // Non-digits removed to match rinlinejQuery
        expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            "embed": true,
            // Ban all objects except for Flash (which handle expandos)
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            "applet": true
        },

        hasData: function( elem ) {
            elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
            return !!elem && !isEmptyDataObject( elem );
        },

        data: function( elem, name, data ) {
            return internalData( elem, name, data );
        },

        removeData: function( elem, name ) {
            return internalRemoveData( elem, name );
        },

        // For internal use only.
        _data: function( elem, name, data ) {
            return internalData( elem, name, data, true );
        },

        _removeData: function( elem, name ) {
            return internalRemoveData( elem, name, true );
        },

        // A method for determining if a DOM node can handle the data expando
        acceptData: function( elem ) {
            // Do not set data on non-element because it will not be cleared (#8335).
            if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
                return false;
            }

            var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

            // nodes accept data unless otherwise specified; rejection can be conditional
            return !noData || noData !== true && elem.getAttribute("classid") === noData;
        }
    });

    jQuery.fn.extend({
        data: function( key, value ) {
            var attrs, name,
                elem = this[0],
                i = 0,
                data = null;

            // Gets all values
            if ( key === undefined ) {
                if ( this.length ) {
                    data = jQuery.data( elem );

                    if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
                        attrs = elem.attributes;
                        for ( ; i < attrs.length; i++ ) {
                            name = attrs[i].name;

                            if ( !name.indexOf( "data-" ) ) {
                                name = jQuery.camelCase( name.slice(5) );

                                dataAttr( elem, name, data[ name ] );
                            }
                        }
                        jQuery._data( elem, "parsedAttrs", true );
                    }
                }

                return data;
            }

            // Sets multiple values
            if ( typeof key === "object" ) {
                return this.each(function() {
                    jQuery.data( this, key );
                });
            }

            return jQuery.access( this, function( value ) {

                if ( value === undefined ) {
                    // Try to fetch any internally stored data first
                    return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
                }

                this.each(function() {
                    jQuery.data( this, key, value );
                });
            }, null, value, arguments.length > 1, null, true );
        },

        removeData: function( key ) {
            return this.each(function() {
                jQuery.removeData( this, key );
            });
        }
    });

    function dataAttr( elem, key, data ) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if ( data === undefined && elem.nodeType === 1 ) {

            var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

            data = elem.getAttribute( name );

            if ( typeof data === "string" ) {
                try {
                    data = data === "true" ? true :
                        data === "false" ? false :
                            data === "null" ? null :
                                // Only convert to a number if it doesn't change the string
                                +data + "" === data ? +data :
                                    rbrace.test( data ) ? jQuery.parseJSON( data ) :
                                        data;
                } catch( e ) {}

                // Make sure we set the data so it isn't changed later
                jQuery.data( elem, key, data );

            } else {
                data = undefined;
            }
        }

        return data;
    }

// checks a cache object for emptiness
    function isEmptyDataObject( obj ) {
        var name;
        for ( name in obj ) {

            // if the public data object is empty, the private is still empty
            if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
                continue;
            }
            if ( name !== "toJSON" ) {
                return false;
            }
        }

        return true;
    }
    jQuery.extend({
        queue: function( elem, type, data ) {
            var queue;

            if ( elem ) {
                type = ( type || "fx" ) + "queue";
                queue = jQuery._data( elem, type );

                // Speed up dequeue by getting out quickly if this is just a lookup
                if ( data ) {
                    if ( !queue || jQuery.isArray(data) ) {
                        queue = jQuery._data( elem, type, jQuery.makeArray(data) );
                    } else {
                        queue.push( data );
                    }
                }
                return queue || [];
            }
        },

        dequeue: function( elem, type ) {
            type = type || "fx";

            var queue = jQuery.queue( elem, type ),
                startLength = queue.length,
                fn = queue.shift(),
                hooks = jQuery._queueHooks( elem, type ),
                next = function() {
                    jQuery.dequeue( elem, type );
                };

            // If the fx queue is dequeued, always remove the progress sentinel
            if ( fn === "inprogress" ) {
                fn = queue.shift();
                startLength--;
            }

            hooks.cur = fn;
            if ( fn ) {

                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if ( type === "fx" ) {
                    queue.unshift( "inprogress" );
                }

                // clear up the last queue stop function
                delete hooks.stop;
                fn.call( elem, next, hooks );
            }

            if ( !startLength && hooks ) {
                hooks.empty.fire();
            }
        },

        // not intended for public consumption - generates a queueHooks object, or returns the current one
        _queueHooks: function( elem, type ) {
            var key = type + "queueHooks";
            return jQuery._data( elem, key ) || jQuery._data( elem, key, {
                    empty: jQuery.Callbacks("once memory").add(function() {
                        jQuery._removeData( elem, type + "queue" );
                        jQuery._removeData( elem, key );
                    })
                });
        }
    });

    jQuery.fn.extend({
        queue: function( type, data ) {
            var setter = 2;

            if ( typeof type !== "string" ) {
                data = type;
                type = "fx";
                setter--;
            }

            if ( arguments.length < setter ) {
                return jQuery.queue( this[0], type );
            }

            return data === undefined ?
                this :
                this.each(function() {
                    var queue = jQuery.queue( this, type, data );

                    // ensure a hooks for this queue
                    jQuery._queueHooks( this, type );

                    if ( type === "fx" && queue[0] !== "inprogress" ) {
                        jQuery.dequeue( this, type );
                    }
                });
        },
        dequeue: function( type ) {
            return this.each(function() {
                jQuery.dequeue( this, type );
            });
        },
        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function( time, type ) {
            time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
            type = type || "fx";

            return this.queue( type, function( next, hooks ) {
                var timeout = setTimeout( next, time );
                hooks.stop = function() {
                    clearTimeout( timeout );
                };
            });
        },
        clearQueue: function( type ) {
            return this.queue( type || "fx", [] );
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function( type, obj ) {
            var tmp,
                count = 1,
                defer = jQuery.Deferred(),
                elements = this,
                i = this.length,
                resolve = function() {
                    if ( !( --count ) ) {
                        defer.resolveWith( elements, [ elements ] );
                    }
                };

            if ( typeof type !== "string" ) {
                obj = type;
                type = undefined;
            }
            type = type || "fx";

            while( i-- ) {
                tmp = jQuery._data( elements[ i ], type + "queueHooks" );
                if ( tmp && tmp.empty ) {
                    count++;
                    tmp.empty.add( resolve );
                }
            }
            resolve();
            return defer.promise( obj );
        }
    });
    var nodeHook, boolHook,
        rclass = /[\t\r\n]/g,
        rreturn = /\r/g,
        rfocusable = /^(?:input|select|textarea|button|object)$/i,
        rclickable = /^(?:a|area)$/i,
        rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
        ruseDefault = /^(?:checked|selected)$/i,
        getSetAttribute = jQuery.support.getSetAttribute,
        getSetInput = jQuery.support.input;

    jQuery.fn.extend({
        attr: function( name, value ) {
            return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
        },

        removeAttr: function( name ) {
            return this.each(function() {
                jQuery.removeAttr( this, name );
            });
        },

        prop: function( name, value ) {
            return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
        },

        removeProp: function( name ) {
            name = jQuery.propFix[ name ] || name;
            return this.each(function() {
                // try/catch handles cases where IE balks (such as removing a property on window)
                try {
                    this[ name ] = undefined;
                    delete this[ name ];
                } catch( e ) {}
            });
        },

        addClass: function( value ) {
            var classes, elem, cur, clazz, j,
                i = 0,
                len = this.length,
                proceed = typeof value === "string" && value;

            if ( jQuery.isFunction( value ) ) {
                return this.each(function( j ) {
                    jQuery( this ).addClass( value.call( this, j, this.className ) );
                });
            }

            if ( proceed ) {
                // The disjunction here is for better compressibility (see removeClass)
                classes = ( value || "" ).match( core_rnotwhite ) || [];

                for ( ; i < len; i++ ) {
                    elem = this[ i ];
                    cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace( rclass, " " ) :
                        " "
                    );

                    if ( cur ) {
                        j = 0;
                        while ( (clazz = classes[j++]) ) {
                            if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
                                cur += clazz + " ";
                            }
                        }
                        elem.className = jQuery.trim( cur );

                    }
                }
            }

            return this;
        },

        removeClass: function( value ) {
            var classes, elem, cur, clazz, j,
                i = 0,
                len = this.length,
                proceed = arguments.length === 0 || typeof value === "string" && value;

            if ( jQuery.isFunction( value ) ) {
                return this.each(function( j ) {
                    jQuery( this ).removeClass( value.call( this, j, this.className ) );
                });
            }
            if ( proceed ) {
                classes = ( value || "" ).match( core_rnotwhite ) || [];

                for ( ; i < len; i++ ) {
                    elem = this[ i ];
                    // This expression is here for better compressibility (see addClass)
                    cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace( rclass, " " ) :
                        ""
                    );

                    if ( cur ) {
                        j = 0;
                        while ( (clazz = classes[j++]) ) {
                            // Remove *all* instances
                            while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
                                cur = cur.replace( " " + clazz + " ", " " );
                            }
                        }
                        elem.className = value ? jQuery.trim( cur ) : "";
                    }
                }
            }

            return this;
        },

        toggleClass: function( value, stateVal ) {
            var type = typeof value,
                isBool = typeof stateVal === "boolean";

            if ( jQuery.isFunction( value ) ) {
                return this.each(function( i ) {
                    jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
                });
            }

            return this.each(function() {
                if ( type === "string" ) {
                    // toggle individual class names
                    var className,
                        i = 0,
                        self = jQuery( this ),
                        state = stateVal,
                        classNames = value.match( core_rnotwhite ) || [];

                    while ( (className = classNames[ i++ ]) ) {
                        // check each className given, space separated list
                        state = isBool ? state : !self.hasClass( className );
                        self[ state ? "addClass" : "removeClass" ]( className );
                    }

                    // Toggle whole class name
                } else if ( type === core_strundefined || type === "boolean" ) {
                    if ( this.className ) {
                        // store className if set
                        jQuery._data( this, "__className__", this.className );
                    }

                    // If the element has a class name or if we're passed "false",
                    // then remove the whole classname (if there was one, the above saved it).
                    // Otherwise bring back whatever was previously saved (if anything),
                    // falling back to the empty string if nothing was stored.
                    this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
                }
            });
        },

        hasClass: function( selector ) {
            var className = " " + selector + " ",
                i = 0,
                l = this.length;
            for ( ; i < l; i++ ) {
                if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
                    return true;
                }
            }

            return false;
        },

        val: function( value ) {
            var ret, hooks, isFunction,
                elem = this[0];

            if ( !arguments.length ) {
                if ( elem ) {
                    hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

                    if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
                        return ret;
                    }

                    ret = elem.value;

                    return typeof ret === "string" ?
                        // handle most common string cases
                        ret.replace(rreturn, "") :
                        // handle cases where value is null/undef or number
                        ret == null ? "" : ret;
                }

                return;
            }

            isFunction = jQuery.isFunction( value );

            return this.each(function( i ) {
                var val,
                    self = jQuery(this);

                if ( this.nodeType !== 1 ) {
                    return;
                }

                if ( isFunction ) {
                    val = value.call( this, i, self.val() );
                } else {
                    val = value;
                }

                // Treat null/undefined as ""; convert numbers to string
                if ( val == null ) {
                    val = "";
                } else if ( typeof val === "number" ) {
                    val += "";
                } else if ( jQuery.isArray( val ) ) {
                    val = jQuery.map(val, function ( value ) {
                        return value == null ? "" : value + "";
                    });
                }

                hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

                // If set returns undefined, fall back to normal setting
                if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
                    this.value = val;
                }
            });
        }
    });

    jQuery.extend({
        valHooks: {
            option: {
                get: function( elem ) {
                    // attributes.value is undefined in Blackberry 4.7 but
                    // uses .value. See #6932
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function( elem ) {
                    var value, option,
                        options = elem.options,
                        index = elem.selectedIndex,
                        one = elem.type === "select-one" || index < 0,
                        values = one ? null : [],
                        max = one ? index + 1 : options.length,
                        i = index < 0 ?
                            max :
                            one ? index : 0;

                    // Loop through all the selected options
                    for ( ; i < max; i++ ) {
                        option = options[ i ];

                        // oldIE doesn't update selected after form reset (#2551)
                        if ( ( option.selected || i === index ) &&
                                // Don't return options that are disabled or in a disabled optgroup
                            ( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
                            ( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

                            // Get the specific value for the option
                            value = jQuery( option ).val();

                            // We don't need an array for one selects
                            if ( one ) {
                                return value;
                            }

                            // Multi-Selects return an array
                            values.push( value );
                        }
                    }

                    return values;
                },

                set: function( elem, value ) {
                    var values = jQuery.makeArray( value );

                    jQuery(elem).find("option").each(function() {
                        this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
                    });

                    if ( !values.length ) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        },

        attr: function( elem, name, value ) {
            var hooks, notxml, ret,
                nType = elem.nodeType;

            // don't get/set attributes on text, comment and attribute nodes
            if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
                return;
            }

            // Fallback to prop when attributes are not supported
            if ( typeof elem.getAttribute === core_strundefined ) {
                return jQuery.prop( elem, name, value );
            }

            notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

            // All attributes are lowercase
            // Grab necessary hook if one is defined
            if ( notxml ) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
            }

            if ( value !== undefined ) {

                if ( value === null ) {
                    jQuery.removeAttr( elem, name );

                } else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
                    return ret;

                } else {
                    elem.setAttribute( name, value + "" );
                    return value;
                }

            } else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
                return ret;

            } else {

                // In IE9+, Flash objects don't have .getAttribute (#12945)
                // Support: IE9+
                if ( typeof elem.getAttribute !== core_strundefined ) {
                    ret =  elem.getAttribute( name );
                }

                // Non-existent attributes return null, we normalize to undefined
                return ret == null ?
                    undefined :
                    ret;
            }
        },

        removeAttr: function( elem, value ) {
            var name, propName,
                i = 0,
                attrNames = value && value.match( core_rnotwhite );

            if ( attrNames && elem.nodeType === 1 ) {
                while ( (name = attrNames[i++]) ) {
                    propName = jQuery.propFix[ name ] || name;

                    // Boolean attributes get special treatment (#10870)
                    if ( rboolean.test( name ) ) {
                        // Set corresponding property to false for boolean attributes
                        // Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
                        if ( !getSetAttribute && ruseDefault.test( name ) ) {
                            elem[ jQuery.camelCase( "default-" + name ) ] =
                                elem[ propName ] = false;
                        } else {
                            elem[ propName ] = false;
                        }

                        // See #9699 for explanation of this approach (setting first, then removal)
                    } else {
                        jQuery.attr( elem, name, "" );
                    }

                    elem.removeAttribute( getSetAttribute ? name : propName );
                }
            }
        },

        attrHooks: {
            type: {
                set: function( elem, value ) {
                    if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
                        // Setting the type on a radio button after the value resets the value in IE6-9
                        // Reset value to default in case type is set after value during creation
                        var val = elem.value;
                        elem.setAttribute( "type", value );
                        if ( val ) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            }
        },

        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },

        prop: function( elem, name, value ) {
            var ret, hooks, notxml,
                nType = elem.nodeType;

            // don't get/set properties on text, comment and attribute nodes
            if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
                return;
            }

            notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

            if ( notxml ) {
                // Fix name and attach hooks
                name = jQuery.propFix[ name ] || name;
                hooks = jQuery.propHooks[ name ];
            }

            if ( value !== undefined ) {
                if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
                    return ret;

                } else {
                    return ( elem[ name ] = value );
                }

            } else {
                if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
                    return ret;

                } else {
                    return elem[ name ];
                }
            }
        },

        propHooks: {
            tabIndex: {
                get: function( elem ) {
                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    var attributeNode = elem.getAttributeNode("tabindex");

                    return attributeNode && attributeNode.specified ?
                        parseInt( attributeNode.value, 10 ) :
                        rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                            0 :
                            undefined;
                }
            }
        }
    });

// Hook for boolean attributes
    boolHook = {
        get: function( elem, name ) {
            var
            // Use .prop to determine if this attribute is understood as boolean
                prop = jQuery.prop( elem, name ),

            // Fetch it accordingly
                attr = typeof prop === "boolean" && elem.getAttribute( name ),
                detail = typeof prop === "boolean" ?

                    getSetInput && getSetAttribute ?
                    attr != null :
                        // oldIE fabricates an empty string for missing boolean attributes
                        // and conflates checked/selected into attroperties
                        ruseDefault.test( name ) ?
                            elem[ jQuery.camelCase( "default-" + name ) ] :
                            !!attr :

                    // fetch an attribute node for properties not recognized as boolean
                    elem.getAttributeNode( name );

            return detail && detail.value !== false ?
                name.toLowerCase() :
                undefined;
        },
        set: function( elem, value, name ) {
            if ( value === false ) {
                // Remove boolean attributes when set to false
                jQuery.removeAttr( elem, name );
            } else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
                // IE<8 needs the *property* name
                elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

                // Use defaultChecked and defaultSelected for oldIE
            } else {
                elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
            }

            return name;
        }
    };

// fix oldIE value attroperty
    if ( !getSetInput || !getSetAttribute ) {
        jQuery.attrHooks.value = {
            get: function( elem, name ) {
                var ret = elem.getAttributeNode( name );
                return jQuery.nodeName( elem, "input" ) ?

                    // Ignore the value *property* by using defaultValue
                    elem.defaultValue :

                    ret && ret.specified ? ret.value : undefined;
            },
            set: function( elem, value, name ) {
                if ( jQuery.nodeName( elem, "input" ) ) {
                    // Does not return so that setAttribute is also used
                    elem.defaultValue = value;
                } else {
                    // Use nodeHook if defined (#1954); otherwise setAttribute is fine
                    return nodeHook && nodeHook.set( elem, value, name );
                }
            }
        };
    }

// IE6/7 do not support getting/setting some attributes with get/setAttribute
    if ( !getSetAttribute ) {

        // Use this for any attribute in IE6/7
        // This fixes almost every IE6/7 issue
        nodeHook = jQuery.valHooks.button = {
            get: function( elem, name ) {
                var ret = elem.getAttributeNode( name );
                return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
                    ret.value :
                    undefined;
            },
            set: function( elem, value, name ) {
                // Set the existing or create a new attribute node
                var ret = elem.getAttributeNode( name );
                if ( !ret ) {
                    elem.setAttributeNode(
                        (ret = elem.ownerDocument.createAttribute( name ))
                    );
                }

                ret.value = value += "";

                // Break association with cloned elements by also using setAttribute (#9646)
                return name === "value" || value === elem.getAttribute( name ) ?
                    value :
                    undefined;
            }
        };

        // Set contenteditable to false on removals(#10429)
        // Setting to empty string throws an error as an invalid value
        jQuery.attrHooks.contenteditable = {
            get: nodeHook.get,
            set: function( elem, value, name ) {
                nodeHook.set( elem, value === "" ? false : value, name );
            }
        };

        // Set width and height to auto instead of 0 on empty string( Bug #8150 )
        // This is for removals
        jQuery.each([ "width", "height" ], function( i, name ) {
            jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
                set: function( elem, value ) {
                    if ( value === "" ) {
                        elem.setAttribute( name, "auto" );
                        return value;
                    }
                }
            });
        });
    }


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if ( !jQuery.support.hrefNormalized ) {
        jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
            jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
                get: function( elem ) {
                    var ret = elem.getAttribute( name, 2 );
                    return ret == null ? undefined : ret;
                }
            });
        });

        // href/src property should get the full normalized URL (#10299/#12915)
        jQuery.each([ "href", "src" ], function( i, name ) {
            jQuery.propHooks[ name ] = {
                get: function( elem ) {
                    return elem.getAttribute( name, 4 );
                }
            };
        });
    }

    if ( !jQuery.support.style ) {
        jQuery.attrHooks.style = {
            get: function( elem ) {
                // Return undefined in the case of empty string
                // Note: IE uppercases css property names, but if we were to .toLowerCase()
                // .cssText, that would destroy case senstitivity in URL's, like in "background"
                return elem.style.cssText || undefined;
            },
            set: function( elem, value ) {
                return ( elem.style.cssText = value + "" );
            }
        };
    }

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
    if ( !jQuery.support.optSelected ) {
        jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
            get: function( elem ) {
                var parent = elem.parentNode;

                if ( parent ) {
                    parent.selectedIndex;

                    // Make sure that it also works with optgroups, see #5701
                    if ( parent.parentNode ) {
                        parent.parentNode.selectedIndex;
                    }
                }
                return null;
            }
        });
    }

// IE6/7 call enctype encoding
    if ( !jQuery.support.enctype ) {
        jQuery.propFix.enctype = "encoding";
    }

// Radios and checkboxes getter/setter
    if ( !jQuery.support.checkOn ) {
        jQuery.each([ "radio", "checkbox" ], function() {
            jQuery.valHooks[ this ] = {
                get: function( elem ) {
                    // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                    return elem.getAttribute("value") === null ? "on" : elem.value;
                }
            };
        });
    }
    jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
            set: function( elem, value ) {
                if ( jQuery.isArray( value ) ) {
                    return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
                }
            }
        });
    });
    var rformElems = /^(?:input|select|textarea)$/i,
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    /*
     * Helper functions for managing events -- not part of the public interface.
     * Props to Dean Edwards' addEvent library for many of the ideas.
     */
    jQuery.event = {

        global: {},

        add: function( elem, types, handler, data, selector ) {
            var tmp, events, t, handleObjIn,
                special, eventHandle, handleObj,
                handlers, type, namespaces, origType,
                elemData = jQuery._data( elem );

            // Don't attach events to noData or text/comment nodes (but allow plain objects)
            if ( !elemData ) {
                return;
            }

            // Caller can pass in an object of custom data in lieu of the handler
            if ( handler.handler ) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }

            // Make sure that the handler has a unique ID, used to find/remove it later
            if ( !handler.guid ) {
                handler.guid = jQuery.guid++;
            }

            // Init the element's event structure and main handler, if this is the first
            if ( !(events = elemData.events) ) {
                events = elemData.events = {};
            }
            if ( !(eventHandle = elemData.handle) ) {
                eventHandle = elemData.handle = function( e ) {
                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
                        jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
                        undefined;
                };
                // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
                eventHandle.elem = elem;
            }

            // Handle multiple events separated by a space
            // jQuery(...).bind("mouseover mouseout", fn);
            types = ( types || "" ).match( core_rnotwhite ) || [""];
            t = types.length;
            while ( t-- ) {
                tmp = rtypenamespace.exec( types[t] ) || [];
                type = origType = tmp[1];
                namespaces = ( tmp[2] || "" ).split( "." ).sort();

                // If event changes its type, use the special event handlers for the changed type
                special = jQuery.event.special[ type ] || {};

                // If selector defined, determine special event api type, otherwise given type
                type = ( selector ? special.delegateType : special.bindType ) || type;

                // Update special based on newly reset type
                special = jQuery.event.special[ type ] || {};

                // handleObj is passed to all event handlers
                handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
                    namespace: namespaces.join(".")
                }, handleObjIn );

                // Init the event handler queue if we're the first
                if ( !(handlers = events[ type ]) ) {
                    handlers = events[ type ] = [];
                    handlers.delegateCount = 0;

                    // Only use addEventListener/attachEvent if the special events handler returns false
                    if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                        // Bind the global event handler to the element
                        if ( elem.addEventListener ) {
                            elem.addEventListener( type, eventHandle, false );

                        } else if ( elem.attachEvent ) {
                            elem.attachEvent( "on" + type, eventHandle );
                        }
                    }
                }

                if ( special.add ) {
                    special.add.call( elem, handleObj );

                    if ( !handleObj.handler.guid ) {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                // Add to the element's handler list, delegates in front
                if ( selector ) {
                    handlers.splice( handlers.delegateCount++, 0, handleObj );
                } else {
                    handlers.push( handleObj );
                }

                // Keep track of which events have ever been used, for event optimization
                jQuery.event.global[ type ] = true;
            }

            // Nullify elem to prevent memory leaks in IE
            elem = null;
        },

        // Detach an event or set of events from an element
        remove: function( elem, types, handler, selector, mappedTypes ) {
            var j, handleObj, tmp,
                origCount, t, events,
                special, handlers, type,
                namespaces, origType,
                elemData = jQuery.hasData( elem ) && jQuery._data( elem );

            if ( !elemData || !(events = elemData.events) ) {
                return;
            }

            // Once for each type.namespace in types; type may be omitted
            types = ( types || "" ).match( core_rnotwhite ) || [""];
            t = types.length;
            while ( t-- ) {
                tmp = rtypenamespace.exec( types[t] ) || [];
                type = origType = tmp[1];
                namespaces = ( tmp[2] || "" ).split( "." ).sort();

                // Unbind all events (on this namespace, if provided) for the element
                if ( !type ) {
                    for ( type in events ) {
                        jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
                    }
                    continue;
                }

                special = jQuery.event.special[ type ] || {};
                type = ( selector ? special.delegateType : special.bindType ) || type;
                handlers = events[ type ] || [];
                tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

                // Remove matching events
                origCount = j = handlers.length;
                while ( j-- ) {
                    handleObj = handlers[ j ];

                    if ( ( mappedTypes || origType === handleObj.origType ) &&
                        ( !handler || handler.guid === handleObj.guid ) &&
                        ( !tmp || tmp.test( handleObj.namespace ) ) &&
                        ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
                        handlers.splice( j, 1 );

                        if ( handleObj.selector ) {
                            handlers.delegateCount--;
                        }
                        if ( special.remove ) {
                            special.remove.call( elem, handleObj );
                        }
                    }
                }

                // Remove generic event handler if we removed something and no more handlers exist
                // (avoids potential for endless recursion during removal of special event handlers)
                if ( origCount && !handlers.length ) {
                    if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
                        jQuery.removeEvent( elem, type, elemData.handle );
                    }

                    delete events[ type ];
                }
            }

            // Remove the expando if it's no longer used
            if ( jQuery.isEmptyObject( events ) ) {
                delete elemData.handle;

                // removeData also checks for emptiness and clears the expando if empty
                // so use it instead of delete
                jQuery._removeData( elem, "events" );
            }
        },

        trigger: function( event, data, elem, onlyHandlers ) {
            var handle, ontype, cur,
                bubbleType, special, tmp, i,
                eventPath = [ elem || document ],
                type = core_hasOwn.call( event, "type" ) ? event.type : event,
                namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

            cur = tmp = elem = elem || document;

            // Don't do events on text and comment nodes
            if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
                return;
            }

            // focus/blur morphs to focusin/out; ensure we're not firing them right now
            if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
                return;
            }

            if ( type.indexOf(".") >= 0 ) {
                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;

            // Caller can pass in a jQuery.Event object, Object, or just an event type string
            event = event[ jQuery.expando ] ?
                event :
                new jQuery.Event( type, typeof event === "object" && event );

            event.isTrigger = true;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ?
                new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
                null;

            // Clean up the event in case it is being reused
            event.result = undefined;
            if ( !event.target ) {
                event.target = elem;
            }

            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data == null ?
                [ event ] :
                jQuery.makeArray( data, [ event ] );

            // Allow special events to draw outside the lines
            special = jQuery.event.special[ type ] || {};
            if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
                return;
            }

            // Determine event propagation path in advance, per W3C events spec (#9951)
            // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
            if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

                bubbleType = special.delegateType || type;
                if ( !rfocusMorph.test( bubbleType + type ) ) {
                    cur = cur.parentNode;
                }
                for ( ; cur; cur = cur.parentNode ) {
                    eventPath.push( cur );
                    tmp = cur;
                }

                // Only add window if we got to document (e.g., not plain obj or detached DOM)
                if ( tmp === (elem.ownerDocument || document) ) {
                    eventPath.push( tmp.defaultView || tmp.parentWindow || window );
                }
            }

            // Fire handlers on the event path
            i = 0;
            while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

                event.type = i > 1 ?
                    bubbleType :
                special.bindType || type;

                // jQuery handler
                handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
                if ( handle ) {
                    handle.apply( cur, data );
                }

                // Native handler
                handle = ontype && cur[ ontype ];
                if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
                    event.preventDefault();
                }
            }
            event.type = type;

            // If nobody prevented the default action, do it now
            if ( !onlyHandlers && !event.isDefaultPrevented() ) {

                if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
                    !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

                    // Call a native DOM method on the target with the same name name as the event.
                    // Can't use an .isFunction() check here because IE6/7 fails that test.
                    // Don't do default actions on window, that's where global variables be (#6170)
                    if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

                        // Don't re-trigger an onFOO event when we call its FOO() method
                        tmp = elem[ ontype ];

                        if ( tmp ) {
                            elem[ ontype ] = null;
                        }

                        // Prevent re-triggering of the same event, since we already bubbled it above
                        jQuery.event.triggered = type;
                        try {
                            elem[ type ]();
                        } catch ( e ) {
                            // IE<9 dies on focus/blur to hidden element (#1486,#12518)
                            // only reproducible on winXP IE8 native, not IE9 in IE8 mode
                        }
                        jQuery.event.triggered = undefined;

                        if ( tmp ) {
                            elem[ ontype ] = tmp;
                        }
                    }
                }
            }

            return event.result;
        },

        dispatch: function( event ) {

            // Make a writable jQuery.Event from the native event object
            event = jQuery.event.fix( event );

            var i, ret, handleObj, matched, j,
                handlerQueue = [],
                args = core_slice.call( arguments ),
                handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
                special = jQuery.event.special[ event.type ] || {};

            // Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[0] = event;
            event.delegateTarget = this;

            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
                return;
            }

            // Determine handlers
            handlerQueue = jQuery.event.handlers.call( this, event, handlers );

            // Run delegates first; they may want to stop propagation beneath us
            i = 0;
            while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
                event.currentTarget = matched.elem;

                j = 0;
                while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

                    // Triggered event must either 1) have no namespace, or
                    // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                    if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

                        event.handleObj = handleObj;
                        event.data = handleObj.data;

                        ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
                            .apply( matched.elem, args );

                        if ( ret !== undefined ) {
                            if ( (event.result = ret) === false ) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }

            // Call the postDispatch hook for the mapped type
            if ( special.postDispatch ) {
                special.postDispatch.call( this, event );
            }

            return event.result;
        },

        handlers: function( event, handlers ) {
            var sel, handleObj, matches, i,
                handlerQueue = [],
                delegateCount = handlers.delegateCount,
                cur = event.target;

            // Find delegate handlers
            // Black-hole SVG <use> instance trees (#13180)
            // Avoid non-left-click bubbling in Firefox (#3861)
            if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

                for ( ; cur != this; cur = cur.parentNode || this ) {

                    // Don't check non-elements (#13208)
                    // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                    if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
                        matches = [];
                        for ( i = 0; i < delegateCount; i++ ) {
                            handleObj = handlers[ i ];

                            // Don't conflict with Object.prototype properties (#13203)
                            sel = handleObj.selector + " ";

                            if ( matches[ sel ] === undefined ) {
                                matches[ sel ] = handleObj.needsContext ?
                                jQuery( sel, this ).index( cur ) >= 0 :
                                    jQuery.find( sel, this, null, [ cur ] ).length;
                            }
                            if ( matches[ sel ] ) {
                                matches.push( handleObj );
                            }
                        }
                        if ( matches.length ) {
                            handlerQueue.push({ elem: cur, handlers: matches });
                        }
                    }
                }
            }

            // Add the remaining (directly-bound) handlers
            if ( delegateCount < handlers.length ) {
                handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
            }

            return handlerQueue;
        },

        fix: function( event ) {
            if ( event[ jQuery.expando ] ) {
                return event;
            }

            // Create a writable copy of the event object and normalize some properties
            var i, prop, copy,
                type = event.type,
                originalEvent = event,
                fixHook = this.fixHooks[ type ];

            if ( !fixHook ) {
                this.fixHooks[ type ] = fixHook =
                    rmouseEvent.test( type ) ? this.mouseHooks :
                        rkeyEvent.test( type ) ? this.keyHooks :
                        {};
            }
            copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

            event = new jQuery.Event( originalEvent );

            i = copy.length;
            while ( i-- ) {
                prop = copy[ i ];
                event[ prop ] = originalEvent[ prop ];
            }

            // Support: IE<9
            // Fix target property (#1925)
            if ( !event.target ) {
                event.target = originalEvent.srcElement || document;
            }

            // Support: Chrome 23+, Safari?
            // Target should not be a text node (#504, #13143)
            if ( event.target.nodeType === 3 ) {
                event.target = event.target.parentNode;
            }

            // Support: IE<9
            // For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
            event.metaKey = !!event.metaKey;

            return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
        },

        // Includes some event props shared by KeyEvent and MouseEvent
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

        fixHooks: {},

        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function( event, original ) {

                // Add which for key events
                if ( event.which == null ) {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }

                return event;
            }
        },

        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function( event, original ) {
                var body, eventDoc, doc,
                    button = original.button,
                    fromElement = original.fromElement;

                // Calculate pageX/Y if missing and clientX/Y available
                if ( event.pageX == null && original.clientX != null ) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;

                    event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                    event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
                }

                // Add relatedTarget, if necessary
                if ( !event.relatedTarget && fromElement ) {
                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                }

                // Add which for click: 1 === left; 2 === middle; 3 === right
                // Note: button is not normalized, so don't use it
                if ( !event.which && button !== undefined ) {
                    event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
                }

                return event;
            }
        },

        special: {
            load: {
                // Prevent triggered image.load events from bubbling to window.load
                noBubble: true
            },
            click: {
                // For checkbox, fire native event so checked state will be right
                trigger: function() {
                    if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
                        this.click();
                        return false;
                    }
                }
            },
            focus: {
                // Fire native event if possible so blur/focus sequence is correct
                trigger: function() {
                    if ( this !== document.activeElement && this.focus ) {
                        try {
                            this.focus();
                            return false;
                        } catch ( e ) {
                            // Support: IE<9
                            // If we error on focus to hidden element (#1486, #12518),
                            // let .trigger() run the handlers
                        }
                    }
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if ( this === document.activeElement && this.blur ) {
                        this.blur();
                        return false;
                    }
                },
                delegateType: "focusout"
            },

            beforeunload: {
                postDispatch: function( event ) {

                    // Even when returnValue equals to undefined Firefox will still show alert
                    if ( event.result !== undefined ) {
                        event.originalEvent.returnValue = event.result;
                    }
                }
            }
        },

        simulate: function( type, elem, event, bubble ) {
            // Piggyback on a donor event to simulate a different one.
            // Fake originalEvent to avoid donor's stopPropagation, but if the
            // simulated event prevents default then we do the same on the donor.
            var e = jQuery.extend(
                new jQuery.Event(),
                event,
                { type: type,
                    isSimulated: true,
                    originalEvent: {}
                }
            );
            if ( bubble ) {
                jQuery.event.trigger( e, null, elem );
            } else {
                jQuery.event.dispatch.call( elem, e );
            }
            if ( e.isDefaultPrevented() ) {
                event.preventDefault();
            }
        }
    };

    jQuery.removeEvent = document.removeEventListener ?
        function( elem, type, handle ) {
            if ( elem.removeEventListener ) {
                elem.removeEventListener( type, handle, false );
            }
        } :
        function( elem, type, handle ) {
            var name = "on" + type;

            if ( elem.detachEvent ) {

                // #8545, #7054, preventing memory leaks for custom events in IE6-8
                // detachEvent needed property on element, by name of that event, to properly expose it to GC
                if ( typeof elem[ name ] === core_strundefined ) {
                    elem[ name ] = null;
                }

                elem.detachEvent( name, handle );
            }
        };

    jQuery.Event = function( src, props ) {
        // Allow instantiation without the 'new' keyword
        if ( !(this instanceof jQuery.Event) ) {
            return new jQuery.Event( src, props );
        }

        // Event object
        if ( src && src.type ) {
            this.originalEvent = src;
            this.type = src.type;

            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
            src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

            // Event type
        } else {
            this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if ( props ) {
            jQuery.extend( this, props );
        }

        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || jQuery.now();

        // Mark it as fixed
        this[ jQuery.expando ] = true;
    };

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,

        preventDefault: function() {
            var e = this.originalEvent;

            this.isDefaultPrevented = returnTrue;
            if ( !e ) {
                return;
            }

            // If preventDefault exists, run it on the original event
            if ( e.preventDefault ) {
                e.preventDefault();

                // Support: IE
                // Otherwise set the returnValue property of the original event to false
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function() {
            var e = this.originalEvent;

            this.isPropagationStopped = returnTrue;
            if ( !e ) {
                return;
            }
            // If stopPropagation exists, run it on the original event
            if ( e.stopPropagation ) {
                e.stopPropagation();
            }

            // Support: IE
            // Set the cancelBubble property of the original event to true
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        }
    };

// Create mouseenter/leave events using mouseover/out and event-time checks
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function( orig, fix ) {
        jQuery.event.special[ orig ] = {
            delegateType: fix,
            bindType: fix,

            handle: function( event ) {
                var ret,
                    target = this,
                    related = event.relatedTarget,
                    handleObj = event.handleObj;

                // For mousenter/leave call the handler if related is outside the target.
                // NB: No relatedTarget if the mouse left/entered the browser window
                if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply( this, arguments );
                    event.type = fix;
                }
                return ret;
            }
        };
    });

// IE submit delegation
    if ( !jQuery.support.submitBubbles ) {

        jQuery.event.special.submit = {
            setup: function() {
                // Only need this for delegated form submit events
                if ( jQuery.nodeName( this, "form" ) ) {
                    return false;
                }

                // Lazy-add a submit handler when a descendant form may potentially be submitted
                jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
                    // Node name check avoids a VML-related crash in IE (#9807)
                    var elem = e.target,
                        form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
                    if ( form && !jQuery._data( form, "submitBubbles" ) ) {
                        jQuery.event.add( form, "submit._submit", function( event ) {
                            event._submit_bubble = true;
                        });
                        jQuery._data( form, "submitBubbles", true );
                    }
                });
                // return undefined since we don't need an event listener
            },

            postDispatch: function( event ) {
                // If form was submitted by the user, bubble the event up the tree
                if ( event._submit_bubble ) {
                    delete event._submit_bubble;
                    if ( this.parentNode && !event.isTrigger ) {
                        jQuery.event.simulate( "submit", this.parentNode, event, true );
                    }
                }
            },

            teardown: function() {
                // Only need this for delegated form submit events
                if ( jQuery.nodeName( this, "form" ) ) {
                    return false;
                }

                // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
                jQuery.event.remove( this, "._submit" );
            }
        };
    }

// IE change delegation and checkbox/radio fix
    if ( !jQuery.support.changeBubbles ) {

        jQuery.event.special.change = {

            setup: function() {

                if ( rformElems.test( this.nodeName ) ) {
                    // IE doesn't fire change on a check/radio until blur; trigger it on click
                    // after a propertychange. Eat the blur-change in special.change.handle.
                    // This still fires onchange a second time for check/radio after blur.
                    if ( this.type === "checkbox" || this.type === "radio" ) {
                        jQuery.event.add( this, "propertychange._change", function( event ) {
                            if ( event.originalEvent.propertyName === "checked" ) {
                                this._just_changed = true;
                            }
                        });
                        jQuery.event.add( this, "click._change", function( event ) {
                            if ( this._just_changed && !event.isTrigger ) {
                                this._just_changed = false;
                            }
                            // Allow triggered, simulated change events (#11500)
                            jQuery.event.simulate( "change", this, event, true );
                        });
                    }
                    return false;
                }
                // Delegated event; lazy-add a change handler on descendant inputs
                jQuery.event.add( this, "beforeactivate._change", function( e ) {
                    var elem = e.target;

                    if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
                        jQuery.event.add( elem, "change._change", function( event ) {
                            if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
                                jQuery.event.simulate( "change", this.parentNode, event, true );
                            }
                        });
                        jQuery._data( elem, "changeBubbles", true );
                    }
                });
            },

            handle: function( event ) {
                var elem = event.target;

                // Swallow native change events from checkbox/radio, we already triggered them above
                if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
                    return event.handleObj.handler.apply( this, arguments );
                }
            },

            teardown: function() {
                jQuery.event.remove( this, "._change" );

                return !rformElems.test( this.nodeName );
            }
        };
    }

// Create "bubbling" focus and blur events
    if ( !jQuery.support.focusinBubbles ) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

            // Attach a single capturing handler while someone wants focusin/focusout
            var attaches = 0,
                handler = function( event ) {
                    jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
                };

            jQuery.event.special[ fix ] = {
                setup: function() {
                    if ( attaches++ === 0 ) {
                        document.addEventListener( orig, handler, true );
                    }
                },
                teardown: function() {
                    if ( --attaches === 0 ) {
                        document.removeEventListener( orig, handler, true );
                    }
                }
            };
        });
    }

    jQuery.fn.extend({

        on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
            var type, origFn;

            // Types can be a map of types/handlers
            if ( typeof types === "object" ) {
                // ( types-Object, selector, data )
                if ( typeof selector !== "string" ) {
                    // ( types-Object, data )
                    data = data || selector;
                    selector = undefined;
                }
                for ( type in types ) {
                    this.on( type, selector, data, types[ type ], one );
                }
                return this;
            }

            if ( data == null && fn == null ) {
                // ( types, fn )
                fn = selector;
                data = selector = undefined;
            } else if ( fn == null ) {
                if ( typeof selector === "string" ) {
                    // ( types, selector, fn )
                    fn = data;
                    data = undefined;
                } else {
                    // ( types, data, fn )
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }
            if ( fn === false ) {
                fn = returnFalse;
            } else if ( !fn ) {
                return this;
            }

            if ( one === 1 ) {
                origFn = fn;
                fn = function( event ) {
                    // Can use an empty set, since event contains the info
                    jQuery().off( event );
                    return origFn.apply( this, arguments );
                };
                // Use same guid so caller can remove using origFn
                fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
            }
            return this.each( function() {
                jQuery.event.add( this, types, fn, data, selector );
            });
        },
        one: function( types, selector, data, fn ) {
            return this.on( types, selector, data, fn, 1 );
        },
        off: function( types, selector, fn ) {
            var handleObj, type;
            if ( types && types.preventDefault && types.handleObj ) {
                // ( event )  dispatched jQuery.Event
                handleObj = types.handleObj;
                jQuery( types.delegateTarget ).off(
                    handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                    handleObj.selector,
                    handleObj.handler
                );
                return this;
            }
            if ( typeof types === "object" ) {
                // ( types-object [, selector] )
                for ( type in types ) {
                    this.off( type, selector, types[ type ] );
                }
                return this;
            }
            if ( selector === false || typeof selector === "function" ) {
                // ( types [, fn] )
                fn = selector;
                selector = undefined;
            }
            if ( fn === false ) {
                fn = returnFalse;
            }
            return this.each(function() {
                jQuery.event.remove( this, types, fn, selector );
            });
        },

        bind: function( types, data, fn ) {
            return this.on( types, null, data, fn );
        },
        unbind: function( types, fn ) {
            return this.off( types, null, fn );
        },

        delegate: function( selector, types, data, fn ) {
            return this.on( types, selector, data, fn );
        },
        undelegate: function( selector, types, fn ) {
            // ( namespace ) or ( selector, types [, fn] )
            return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
        },

        trigger: function( type, data ) {
            return this.each(function() {
                jQuery.event.trigger( type, data, this );
            });
        },
        triggerHandler: function( type, data ) {
            var elem = this[0];
            if ( elem ) {
                return jQuery.event.trigger( type, data, elem, true );
            }
        }
    });
    /*!
     * Sizzle CSS Selector Engine
     * Copyright 2012 jQuery Foundation and other contributors
     * Released under the MIT license
     * http://sizzlejs.com/
     */
    (function( window, undefined ) {

        var i,
            cachedruns,
            Expr,
            getText,
            isXML,
            compile,
            hasDuplicate,
            outermostContext,

        // Local document vars
            setDocument,
            document,
            docElem,
            documentIsXML,
            rbuggyQSA,
            rbuggyMatches,
            matches,
            contains,
            sortOrder,

        // Instance-specific data
            expando = "sizzle" + -(new Date()),
            preferredDoc = window.document,
            support = {},
            dirruns = 0,
            done = 0,
            classCache = createCache(),
            tokenCache = createCache(),
            compilerCache = createCache(),

        // General-purpose constants
            strundefined = typeof undefined,
            MAX_NEGATIVE = 1 << 31,

        // Array methods
            arr = [],
            pop = arr.pop,
            push = arr.push,
            slice = arr.slice,
        // Use a stripped-down indexOf if we can't use a native one
            indexOf = arr.indexOf || function( elem ) {
                    var i = 0,
                        len = this.length;
                    for ( ; i < len; i++ ) {
                        if ( this[i] === elem ) {
                            return i;
                        }
                    }
                    return -1;
                },


        // Regular expressions

        // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
            whitespace = "[\\x20\\t\\r\\n\\f]",
        // http://www.w3.org/TR/css3-syntax/#characters
            characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

        // Loosely modeled on CSS identifier characters
        // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
        // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
            identifier = characterEncoding.replace( "w", "w#" ),

        // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
            operators = "([*^$|!~]?=)",
            attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
                "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

        // Prefer arguments quoted,
        //   then not containing pseudos/brackets,
        //   then attribute selectors/non-parenthetical expressions,
        //   then anything else
        // These preferences are here to reduce the number of selectors
        //   needing tokenize in the PSEUDO preFilter
            pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

        // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
            rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

            rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
            rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
            rpseudo = new RegExp( pseudos ),
            ridentifier = new RegExp( "^" + identifier + "$" ),

            matchExpr = {
                "ID": new RegExp( "^#(" + characterEncoding + ")" ),
                "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
                "NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
                "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
                "ATTR": new RegExp( "^" + attributes ),
                "PSEUDO": new RegExp( "^" + pseudos ),
                "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
                // For use in libraries implementing .is()
                // We use this for POS matching in `select`
                "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
            },

            rsibling = /[\x20\t\r\n\f]*[+~]/,

            rnative = /^[^{]+\{\s*\[native code/,

        // Easily-parseable/retrievable ID or TAG or CLASS selectors
            rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

            rinputs = /^(?:input|select|textarea|button)$/i,
            rheader = /^h\d$/i,

            rescape = /'|\\/g,
            rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

        // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
            runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
            funescape = function( _, escaped ) {
                var high = "0x" + escaped - 0x10000;
                // NaN means non-codepoint
                return high !== high ?
                    escaped :
                    // BMP codepoint
                    high < 0 ?
                        String.fromCharCode( high + 0x10000 ) :
                        // Supplemental Plane codepoint (surrogate pair)
                        String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
            };

// Use a stripped-down slice if we can't use a native one
        try {
            slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
        } catch ( e ) {
            slice = function( i ) {
                var elem,
                    results = [];
                while ( (elem = this[i++]) ) {
                    results.push( elem );
                }
                return results;
            };
        }

        /**
         * For feature detection
         * @param {Function} fn The function to test for native support
         */
        function isNative( fn ) {
            return rnative.test( fn + "" );
        }

        /**
         * Create key-value caches of limited size
         * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
         *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
         *	deleting the oldest entry
         */
        function createCache() {
            var cache,
                keys = [];

            return (cache = function( key, value ) {
                // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                if ( keys.push( key += " " ) > Expr.cacheLength ) {
                    // Only keep the most recent entries
                    delete cache[ keys.shift() ];
                }
                return (cache[ key ] = value);
            });
        }

        /**
         * Mark a function for special use by Sizzle
         * @param {Function} fn The function to mark
         */
        function markFunction( fn ) {
            fn[ expando ] = true;
            return fn;
        }

        /**
         * Support testing using an element
         * @param {Function} fn Passed the created div and expects a boolean result
         */
        function assert( fn ) {
            var div = document.createElement("div");

            try {
                return fn( div );
            } catch (e) {
                return false;
            } finally {
                // release memory in IE
                div = null;
            }
        }

        function Sizzle( selector, context, results, seed ) {
            var match, elem, m, nodeType,
            // QSA vars
                i, groups, old, nid, newContext, newSelector;

            if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
                setDocument( context );
            }

            context = context || document;
            results = results || [];

            if ( !selector || typeof selector !== "string" ) {
                return results;
            }

            if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
                return [];
            }

            if ( !documentIsXML && !seed ) {

                // Shortcuts
                if ( (match = rquickExpr.exec( selector )) ) {
                    // Speed-up: Sizzle("#ID")
                    if ( (m = match[1]) ) {
                        if ( nodeType === 9 ) {
                            elem = context.getElementById( m );
                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if ( elem && elem.parentNode ) {
                                // Handle the case where IE, Opera, and Webkit return items
                                // by name instead of ID
                                if ( elem.id === m ) {
                                    results.push( elem );
                                    return results;
                                }
                            } else {
                                return results;
                            }
                        } else {
                            // Context is not a document
                            if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                                contains( context, elem ) && elem.id === m ) {
                                results.push( elem );
                                return results;
                            }
                        }

                        // Speed-up: Sizzle("TAG")
                    } else if ( match[2] ) {
                        push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
                        return results;

                        // Speed-up: Sizzle(".CLASS")
                    } else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
                        push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
                        return results;
                    }
                }

                // QSA path
                if ( support.qsa && !rbuggyQSA.test(selector) ) {
                    old = true;
                    nid = expando;
                    newContext = context;
                    newSelector = nodeType === 9 && selector;

                    // qSA works strangely on Element-rooted queries
                    // We can work around this by specifying an extra ID on the root
                    // and working up from there (Thanks to Andrew Dupont for the technique)
                    // IE 8 doesn't work on object elements
                    if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                        groups = tokenize( selector );

                        if ( (old = context.getAttribute("id")) ) {
                            nid = old.replace( rescape, "\\$&" );
                        } else {
                            context.setAttribute( "id", nid );
                        }
                        nid = "[id='" + nid + "'] ";

                        i = groups.length;
                        while ( i-- ) {
                            groups[i] = nid + toSelector( groups[i] );
                        }
                        newContext = rsibling.test( selector ) && context.parentNode || context;
                        newSelector = groups.join(",");
                    }

                    if ( newSelector ) {
                        try {
                            push.apply( results, slice.call( newContext.querySelectorAll(
                                newSelector
                            ), 0 ) );
                            return results;
                        } catch(qsaError) {
                        } finally {
                            if ( !old ) {
                                context.removeAttribute("id");
                            }
                        }
                    }
                }
            }

            // All others
            return select( selector.replace( rtrim, "$1" ), context, results, seed );
        }

        /**
         * Detect xml
         * @param {Element|Object} elem An element or a document
         */
        isXML = Sizzle.isXML = function( elem ) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        /**
         * Sets document-related variables once based on the current document
         * @param {Element|Object} [doc] An element or document object to use to set the document
         * @returns {Object} Returns the current document
         */
        setDocument = Sizzle.setDocument = function( node ) {
            var doc = node ? node.ownerDocument || node : preferredDoc;

            // If no document and documentElement is available, return
            if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
                return document;
            }

            // Set our document
            document = doc;
            docElem = doc.documentElement;

            // Support tests
            documentIsXML = isXML( doc );

            // Check if getElementsByTagName("*") returns only elements
            support.tagNameNoComments = assert(function( div ) {
                div.appendChild( doc.createComment("") );
                return !div.getElementsByTagName("*").length;
            });

            // Check if attributes should be retrieved by attribute nodes
            support.attributes = assert(function( div ) {
                div.innerHTML = "<select></select>";
                var type = typeof div.lastChild.getAttribute("multiple");
                // IE8 returns a string for some attributes even when not present
                return type !== "boolean" && type !== "string";
            });

            // Check if getElementsByClassName can be trusted
            support.getByClassName = assert(function( div ) {
                // Opera can't find a second classname (in 9.6)
                div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
                if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
                    return false;
                }

                // Safari 3.2 caches class attributes and doesn't catch changes
                div.lastChild.className = "e";
                return div.getElementsByClassName("e").length === 2;
            });

            // Check if getElementById returns elements by name
            // Check if getElementsByName privileges form controls or returns elements by ID
            support.getByName = assert(function( div ) {
                // Inject content
                div.id = expando + 0;
                div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
                docElem.insertBefore( div, docElem.firstChild );

                // Test
                var pass = doc.getElementsByName &&
                        // buggy browsers will return fewer than the correct 2
                    doc.getElementsByName( expando ).length === 2 +
                        // buggy browsers will return more than the correct 0
                    doc.getElementsByName( expando + 0 ).length;
                support.getIdNotName = !doc.getElementById( expando );

                // Cleanup
                docElem.removeChild( div );

                return pass;
            });

            // IE6/7 return modified attributes
            Expr.attrHandle = assert(function( div ) {
                div.innerHTML = "<a href='#'></a>";
                return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
                    div.firstChild.getAttribute("href") === "#";
            }) ?
            {} :
            {
                "href": function( elem ) {
                    return elem.getAttribute( "href", 2 );
                },
                "type": function( elem ) {
                    return elem.getAttribute("type");
                }
            };

            // ID find and filter
            if ( support.getIdNotName ) {
                Expr.find["ID"] = function( id, context ) {
                    if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
                        var m = context.getElementById( id );
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        return m && m.parentNode ? [m] : [];
                    }
                };
                Expr.filter["ID"] = function( id ) {
                    var attrId = id.replace( runescape, funescape );
                    return function( elem ) {
                        return elem.getAttribute("id") === attrId;
                    };
                };
            } else {
                Expr.find["ID"] = function( id, context ) {
                    if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
                        var m = context.getElementById( id );

                        return m ?
                            m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
                                [m] :
                                undefined :
                            [];
                    }
                };
                Expr.filter["ID"] =  function( id ) {
                    var attrId = id.replace( runescape, funescape );
                    return function( elem ) {
                        var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                        return node && node.value === attrId;
                    };
                };
            }

            // Tag
            Expr.find["TAG"] = support.tagNameNoComments ?
                function( tag, context ) {
                    if ( typeof context.getElementsByTagName !== strundefined ) {
                        return context.getElementsByTagName( tag );
                    }
                } :
                function( tag, context ) {
                    var elem,
                        tmp = [],
                        i = 0,
                        results = context.getElementsByTagName( tag );

                    // Filter out possible comments
                    if ( tag === "*" ) {
                        while ( (elem = results[i++]) ) {
                            if ( elem.nodeType === 1 ) {
                                tmp.push( elem );
                            }
                        }

                        return tmp;
                    }
                    return results;
                };

            // Name
            Expr.find["NAME"] = support.getByName && function( tag, context ) {
                if ( typeof context.getElementsByName !== strundefined ) {
                    return context.getElementsByName( name );
                }
            };

            // Class
            Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
                if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
                    return context.getElementsByClassName( className );
                }
            };

            // QSA and matchesSelector support

            // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
            rbuggyMatches = [];

            // qSa(:focus) reports false when true (Chrome 21),
            // no need to also add to buggyMatches since matches checks buggyQSA
            // A support test would require too much code (would include document ready)
            rbuggyQSA = [ ":focus" ];

            if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
                // Build QSA regex
                // Regex strategy adopted from Diego Perini
                assert(function( div ) {
                    // Select is set to empty string on purpose
                    // This is to test IE's treatment of not explictly
                    // setting a boolean content attribute,
                    // since its presence should be enough
                    // http://bugs.jquery.com/ticket/12359
                    div.innerHTML = "<select><option selected=''></option></select>";

                    // IE8 - Some boolean attributes are not treated correctly
                    if ( !div.querySelectorAll("[selected]").length ) {
                        rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
                    }

                    // Webkit/Opera - :checked should return selected option elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    // IE8 throws error here and will not see later tests
                    if ( !div.querySelectorAll(":checked").length ) {
                        rbuggyQSA.push(":checked");
                    }
                });

                assert(function( div ) {

                    // Opera 10-12/IE8 - ^= $= *= and empty values
                    // Should not select anything
                    div.innerHTML = "<input type='hidden' i=''/>";
                    if ( div.querySelectorAll("[i^='']").length ) {
                        rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
                    }

                    // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                    // IE8 throws error here and will not see later tests
                    if ( !div.querySelectorAll(":enabled").length ) {
                        rbuggyQSA.push( ":enabled", ":disabled" );
                    }

                    // Opera 10-11 does not throw on post-comma invalid pseudos
                    div.querySelectorAll("*,:x");
                    rbuggyQSA.push(",.*:");
                });
            }

            if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
                docElem.mozMatchesSelector ||
                docElem.webkitMatchesSelector ||
                docElem.oMatchesSelector ||
                docElem.msMatchesSelector) )) ) {

                assert(function( div ) {
                    // Check to see if it's possible to do matchesSelector
                    // on a disconnected node (IE 9)
                    support.disconnectedMatch = matches.call( div, "div" );

                    // This should fail with an exception
                    // Gecko does not error, returns false instead
                    matches.call( div, "[s!='']:x" );
                    rbuggyMatches.push( "!=", pseudos );
                });
            }

            rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
            rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

            // Element contains another
            // Purposefully does not implement inclusive descendent
            // As in, an element does not contain itself
            contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
                function( a, b ) {
                    var adown = a.nodeType === 9 ? a.documentElement : a,
                        bup = b && b.parentNode;
                    return a === bup || !!( bup && bup.nodeType === 1 && (
                            adown.contains ?
                                adown.contains( bup ) :
                            a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
                        ));
                } :
                function( a, b ) {
                    if ( b ) {
                        while ( (b = b.parentNode) ) {
                            if ( b === a ) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

            // Document order sorting
            sortOrder = docElem.compareDocumentPosition ?
                function( a, b ) {
                    var compare;

                    if ( a === b ) {
                        hasDuplicate = true;
                        return 0;
                    }

                    if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
                        if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
                            if ( a === doc || contains( preferredDoc, a ) ) {
                                return -1;
                            }
                            if ( b === doc || contains( preferredDoc, b ) ) {
                                return 1;
                            }
                            return 0;
                        }
                        return compare & 4 ? -1 : 1;
                    }

                    return a.compareDocumentPosition ? -1 : 1;
                } :
                function( a, b ) {
                    var cur,
                        i = 0,
                        aup = a.parentNode,
                        bup = b.parentNode,
                        ap = [ a ],
                        bp = [ b ];

                    // Exit early if the nodes are identical
                    if ( a === b ) {
                        hasDuplicate = true;
                        return 0;

                        // Parentless nodes are either documents or disconnected
                    } else if ( !aup || !bup ) {
                        return a === doc ? -1 :
                            b === doc ? 1 :
                                aup ? -1 :
                                    bup ? 1 :
                                        0;

                        // If the nodes are siblings, we can do a quick check
                    } else if ( aup === bup ) {
                        return siblingCheck( a, b );
                    }

                    // Otherwise we need full lists of their ancestors for comparison
                    cur = a;
                    while ( (cur = cur.parentNode) ) {
                        ap.unshift( cur );
                    }
                    cur = b;
                    while ( (cur = cur.parentNode) ) {
                        bp.unshift( cur );
                    }

                    // Walk down the tree looking for a discrepancy
                    while ( ap[i] === bp[i] ) {
                        i++;
                    }

                    return i ?
                        // Do a sibling check if the nodes have a common ancestor
                        siblingCheck( ap[i], bp[i] ) :

                        // Otherwise nodes in our document sort first
                        ap[i] === preferredDoc ? -1 :
                            bp[i] === preferredDoc ? 1 :
                                0;
                };

            // Always assume the presence of duplicates if sort doesn't
            // pass them to our comparison function (as in Google Chrome).
            hasDuplicate = false;
            [0, 0].sort( sortOrder );
            support.detectDuplicates = hasDuplicate;

            return document;
        };

        Sizzle.matches = function( expr, elements ) {
            return Sizzle( expr, null, null, elements );
        };

        Sizzle.matchesSelector = function( elem, expr ) {
            // Set document vars if needed
            if ( ( elem.ownerDocument || elem ) !== document ) {
                setDocument( elem );
            }

            // Make sure that attribute selectors are quoted
            expr = expr.replace( rattributeQuotes, "='$1']" );

            // rbuggyQSA always contains :focus, so no need for an existence check
            if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
                try {
                    var ret = matches.call( elem, expr );

                    // IE 9's matchesSelector returns false on disconnected nodes
                    if ( ret || support.disconnectedMatch ||
                            // As well, disconnected nodes are said to be in a document
                            // fragment in IE 9
                        elem.document && elem.document.nodeType !== 11 ) {
                        return ret;
                    }
                } catch(e) {}
            }

            return Sizzle( expr, document, null, [elem] ).length > 0;
        };

        Sizzle.contains = function( context, elem ) {
            // Set document vars if needed
            if ( ( context.ownerDocument || context ) !== document ) {
                setDocument( context );
            }
            return contains( context, elem );
        };

        Sizzle.attr = function( elem, name ) {
            var val;

            // Set document vars if needed
            if ( ( elem.ownerDocument || elem ) !== document ) {
                setDocument( elem );
            }

            if ( !documentIsXML ) {
                name = name.toLowerCase();
            }
            if ( (val = Expr.attrHandle[ name ]) ) {
                return val( elem );
            }
            if ( documentIsXML || support.attributes ) {
                return elem.getAttribute( name );
            }
            return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
                name :
                val && val.specified ? val.value : null;
        };

        Sizzle.error = function( msg ) {
            throw new Error( "Syntax error, unrecognized expression: " + msg );
        };

// Document sorting and removing duplicates
        Sizzle.uniqueSort = function( results ) {
            var elem,
                duplicates = [],
                i = 1,
                j = 0;

            // Unless we *know* we can detect duplicates, assume their presence
            hasDuplicate = !support.detectDuplicates;
            results.sort( sortOrder );

            if ( hasDuplicate ) {
                for ( ; (elem = results[i]); i++ ) {
                    if ( elem === results[ i - 1 ] ) {
                        j = duplicates.push( i );
                    }
                }
                while ( j-- ) {
                    results.splice( duplicates[ j ], 1 );
                }
            }

            return results;
        };

        function siblingCheck( a, b ) {
            var cur = b && a,
                diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

            // Use IE sourceIndex if available on both nodes
            if ( diff ) {
                return diff;
            }

            // Check if b follows a
            if ( cur ) {
                while ( (cur = cur.nextSibling) ) {
                    if ( cur === b ) {
                        return -1;
                    }
                }
            }

            return a ? 1 : -1;
        }

// Returns a function to use in pseudos for input types
        function createInputPseudo( type ) {
            return function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
            };
        }

// Returns a function to use in pseudos for buttons
        function createButtonPseudo( type ) {
            return function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
            };
        }

// Returns a function to use in pseudos for positionals
        function createPositionalPseudo( fn ) {
            return markFunction(function( argument ) {
                argument = +argument;
                return markFunction(function( seed, matches ) {
                    var j,
                        matchIndexes = fn( [], seed.length, argument ),
                        i = matchIndexes.length;

                    // Match elements found at the specified indexes
                    while ( i-- ) {
                        if ( seed[ (j = matchIndexes[i]) ] ) {
                            seed[j] = !(matches[j] = seed[j]);
                        }
                    }
                });
            });
        }

        /**
         * Utility function for retrieving the text value of an array of DOM nodes
         * @param {Array|Element} elem
         */
        getText = Sizzle.getText = function( elem ) {
            var node,
                ret = "",
                i = 0,
                nodeType = elem.nodeType;

            if ( !nodeType ) {
                // If no nodeType, this is expected to be an array
                for ( ; (node = elem[i]); i++ ) {
                    // Do not traverse comment nodes
                    ret += getText( node );
                }
            } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
                // Use textContent for elements
                // innerText usage removed for consistency of new lines (see #11153)
                if ( typeof elem.textContent === "string" ) {
                    return elem.textContent;
                } else {
                    // Traverse its children
                    for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                        ret += getText( elem );
                    }
                }
            } else if ( nodeType === 3 || nodeType === 4 ) {
                return elem.nodeValue;
            }
            // Do not include comment or processing instruction nodes

            return ret;
        };

        Expr = Sizzle.selectors = {

            // Can be adjusted by the user
            cacheLength: 50,

            createPseudo: markFunction,

            match: matchExpr,

            find: {},

            relative: {
                ">": { dir: "parentNode", first: true },
                " ": { dir: "parentNode" },
                "+": { dir: "previousSibling", first: true },
                "~": { dir: "previousSibling" }
            },

            preFilter: {
                "ATTR": function( match ) {
                    match[1] = match[1].replace( runescape, funescape );

                    // Move the given value to match[3] whether quoted or unquoted
                    match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

                    if ( match[2] === "~=" ) {
                        match[3] = " " + match[3] + " ";
                    }

                    return match.slice( 0, 4 );
                },

                "CHILD": function( match ) {
                    /* matches from matchExpr["CHILD"]
                     1 type (only|nth|...)
                     2 what (child|of-type)
                     3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                     4 xn-component of xn+y argument ([+-]?\d*n|)
                     5 sign of xn-component
                     6 x of xn-component
                     7 sign of y-component
                     8 y of y-component
                     */
                    match[1] = match[1].toLowerCase();

                    if ( match[1].slice( 0, 3 ) === "nth" ) {
                        // nth-* requires argument
                        if ( !match[3] ) {
                            Sizzle.error( match[0] );
                        }

                        // numeric x and y parameters for Expr.filter.CHILD
                        // remember that false/true cast respectively to 0/1
                        match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
                        match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

                        // other types prohibit arguments
                    } else if ( match[3] ) {
                        Sizzle.error( match[0] );
                    }

                    return match;
                },

                "PSEUDO": function( match ) {
                    var excess,
                        unquoted = !match[5] && match[2];

                    if ( matchExpr["CHILD"].test( match[0] ) ) {
                        return null;
                    }

                    // Accept quoted arguments as-is
                    if ( match[4] ) {
                        match[2] = match[4];

                        // Strip excess characters from unquoted arguments
                    } else if ( unquoted && rpseudo.test( unquoted ) &&
                            // Get excess from tokenize (recursively)
                        (excess = tokenize( unquoted, true )) &&
                            // advance to the next closing parenthesis
                        (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

                        // excess is a negative index
                        match[0] = match[0].slice( 0, excess );
                        match[2] = unquoted.slice( 0, excess );
                    }

                    // Return only captures needed by the pseudo filter method (type and argument)
                    return match.slice( 0, 3 );
                }
            },

            filter: {

                "TAG": function( nodeName ) {
                    if ( nodeName === "*" ) {
                        return function() { return true; };
                    }

                    nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
                    return function( elem ) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                },

                "CLASS": function( className ) {
                    var pattern = classCache[ className + " " ];

                    return pattern ||
                        (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
                        classCache( className, function( elem ) {
                            return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
                        });
                },

                "ATTR": function( name, operator, check ) {
                    return function( elem ) {
                        var result = Sizzle.attr( elem, name );

                        if ( result == null ) {
                            return operator === "!=";
                        }
                        if ( !operator ) {
                            return true;
                        }

                        result += "";

                        return operator === "=" ? result === check :
                            operator === "!=" ? result !== check :
                                operator === "^=" ? check && result.indexOf( check ) === 0 :
                                    operator === "*=" ? check && result.indexOf( check ) > -1 :
                                        operator === "$=" ? check && result.slice( -check.length ) === check :
                                            operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
                                                operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
                                                    false;
                    };
                },

                "CHILD": function( type, what, argument, first, last ) {
                    var simple = type.slice( 0, 3 ) !== "nth",
                        forward = type.slice( -4 ) !== "last",
                        ofType = what === "of-type";

                    return first === 1 && last === 0 ?

                        // Shortcut for :nth-*(n)
                        function( elem ) {
                            return !!elem.parentNode;
                        } :

                        function( elem, context, xml ) {
                            var cache, outerCache, node, diff, nodeIndex, start,
                                dir = simple !== forward ? "nextSibling" : "previousSibling",
                                parent = elem.parentNode,
                                name = ofType && elem.nodeName.toLowerCase(),
                                useCache = !xml && !ofType;

                            if ( parent ) {

                                // :(first|last|only)-(child|of-type)
                                if ( simple ) {
                                    while ( dir ) {
                                        node = elem;
                                        while ( (node = node[ dir ]) ) {
                                            if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
                                                return false;
                                            }
                                        }
                                        // Reverse direction for :only-* (if we haven't yet done so)
                                        start = dir = type === "only" && !start && "nextSibling";
                                    }
                                    return true;
                                }

                                start = [ forward ? parent.firstChild : parent.lastChild ];

                                // non-xml :nth-child(...) stores cache data on `parent`
                                if ( forward && useCache ) {
                                    // Seek `elem` from a previously-cached index
                                    outerCache = parent[ expando ] || (parent[ expando ] = {});
                                    cache = outerCache[ type ] || [];
                                    nodeIndex = cache[0] === dirruns && cache[1];
                                    diff = cache[0] === dirruns && cache[2];
                                    node = nodeIndex && parent.childNodes[ nodeIndex ];

                                    while ( (node = ++nodeIndex && node && node[ dir ] ||

                                        // Fallback to seeking `elem` from the start
                                    (diff = nodeIndex = 0) || start.pop()) ) {

                                        // When found, cache indexes on `parent` and break
                                        if ( node.nodeType === 1 && ++diff && node === elem ) {
                                            outerCache[ type ] = [ dirruns, nodeIndex, diff ];
                                            break;
                                        }
                                    }

                                    // Use previously-cached element index if available
                                } else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
                                    diff = cache[1];

                                    // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                                } else {
                                    // Use the same loop as above to seek `elem` from the start
                                    while ( (node = ++nodeIndex && node && node[ dir ] ||
                                    (diff = nodeIndex = 0) || start.pop()) ) {

                                        if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
                                            // Cache the index of each encountered element
                                            if ( useCache ) {
                                                (node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
                                            }

                                            if ( node === elem ) {
                                                break;
                                            }
                                        }
                                    }
                                }

                                // Incorporate the offset, then check against cycle size
                                diff -= last;
                                return diff === first || ( diff % first === 0 && diff / first >= 0 );
                            }
                        };
                },

                "PSEUDO": function( pseudo, argument ) {
                    // pseudo-class names are case-insensitive
                    // http://www.w3.org/TR/selectors/#pseudo-classes
                    // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                    // Remember that setFilters inherits from pseudos
                    var args,
                        fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                            Sizzle.error( "unsupported pseudo: " + pseudo );

                    // The user may use createPseudo to indicate that
                    // arguments are needed to create the filter function
                    // just as Sizzle does
                    if ( fn[ expando ] ) {
                        return fn( argument );
                    }

                    // But maintain support for old signatures
                    if ( fn.length > 1 ) {
                        args = [ pseudo, pseudo, "", argument ];
                        return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                            markFunction(function( seed, matches ) {
                                var idx,
                                    matched = fn( seed, argument ),
                                    i = matched.length;
                                while ( i-- ) {
                                    idx = indexOf.call( seed, matched[i] );
                                    seed[ idx ] = !( matches[ idx ] = matched[i] );
                                }
                            }) :
                            function( elem ) {
                                return fn( elem, 0, args );
                            };
                    }

                    return fn;
                }
            },

            pseudos: {
                // Potentially complex pseudos
                "not": markFunction(function( selector ) {
                    // Trim the selector passed to compile
                    // to avoid treating leading and trailing
                    // spaces as combinators
                    var input = [],
                        results = [],
                        matcher = compile( selector.replace( rtrim, "$1" ) );

                    return matcher[ expando ] ?
                        markFunction(function( seed, matches, context, xml ) {
                            var elem,
                                unmatched = matcher( seed, null, xml, [] ),
                                i = seed.length;

                            // Match elements unmatched by `matcher`
                            while ( i-- ) {
                                if ( (elem = unmatched[i]) ) {
                                    seed[i] = !(matches[i] = elem);
                                }
                            }
                        }) :
                        function( elem, context, xml ) {
                            input[0] = elem;
                            matcher( input, null, xml, results );
                            return !results.pop();
                        };
                }),

                "has": markFunction(function( selector ) {
                    return function( elem ) {
                        return Sizzle( selector, elem ).length > 0;
                    };
                }),

                "contains": markFunction(function( text ) {
                    return function( elem ) {
                        return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
                    };
                }),

                // "Whether an element is represented by a :lang() selector
                // is based solely on the element's language value
                // being equal to the identifier C,
                // or beginning with the identifier C immediately followed by "-".
                // The matching of C against the element's language value is performed case-insensitively.
                // The identifier C does not have to be a valid language name."
                // http://www.w3.org/TR/selectors/#lang-pseudo
                "lang": markFunction( function( lang ) {
                    // lang value must be a valid identifider
                    if ( !ridentifier.test(lang || "") ) {
                        Sizzle.error( "unsupported lang: " + lang );
                    }
                    lang = lang.replace( runescape, funescape ).toLowerCase();
                    return function( elem ) {
                        var elemLang;
                        do {
                            if ( (elemLang = documentIsXML ?
                                elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
                                    elem.lang) ) {

                                elemLang = elemLang.toLowerCase();
                                return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
                            }
                        } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
                        return false;
                    };
                }),

                // Miscellaneous
                "target": function( elem ) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice( 1 ) === elem.id;
                },

                "root": function( elem ) {
                    return elem === docElem;
                },

                "focus": function( elem ) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },

                // Boolean properties
                "enabled": function( elem ) {
                    return elem.disabled === false;
                },

                "disabled": function( elem ) {
                    return elem.disabled === true;
                },

                "checked": function( elem ) {
                    // In CSS3, :checked should return both checked and selected elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    var nodeName = elem.nodeName.toLowerCase();
                    return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                },

                "selected": function( elem ) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if ( elem.parentNode ) {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                // Contents
                "empty": function( elem ) {
                    // http://www.w3.org/TR/selectors/#empty-pseudo
                    // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
                    //   not comment, processing instructions, or others
                    // Thanks to Diego Perini for the nodeName shortcut
                    //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
                    for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                        if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
                            return false;
                        }
                    }
                    return true;
                },

                "parent": function( elem ) {
                    return !Expr.pseudos["empty"]( elem );
                },

                // Element/input types
                "header": function( elem ) {
                    return rheader.test( elem.nodeName );
                },

                "input": function( elem ) {
                    return rinputs.test( elem.nodeName );
                },

                "button": function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === "button" || name === "button";
                },

                "text": function( elem ) {
                    var attr;
                    // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
                    // use getAttribute instead to test this case
                    return elem.nodeName.toLowerCase() === "input" &&
                        elem.type === "text" &&
                        ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
                },

                // Position-in-collection
                "first": createPositionalPseudo(function() {
                    return [ 0 ];
                }),

                "last": createPositionalPseudo(function( matchIndexes, length ) {
                    return [ length - 1 ];
                }),

                "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    return [ argument < 0 ? argument + length : argument ];
                }),

                "even": createPositionalPseudo(function( matchIndexes, length ) {
                    var i = 0;
                    for ( ; i < length; i += 2 ) {
                        matchIndexes.push( i );
                    }
                    return matchIndexes;
                }),

                "odd": createPositionalPseudo(function( matchIndexes, length ) {
                    var i = 1;
                    for ( ; i < length; i += 2 ) {
                        matchIndexes.push( i );
                    }
                    return matchIndexes;
                }),

                "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    var i = argument < 0 ? argument + length : argument;
                    for ( ; --i >= 0; ) {
                        matchIndexes.push( i );
                    }
                    return matchIndexes;
                }),

                "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                    var i = argument < 0 ? argument + length : argument;
                    for ( ; ++i < length; ) {
                        matchIndexes.push( i );
                    }
                    return matchIndexes;
                })
            }
        };

// Add button/input type pseudos
        for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
            Expr.pseudos[ i ] = createInputPseudo( i );
        }
        for ( i in { submit: true, reset: true } ) {
            Expr.pseudos[ i ] = createButtonPseudo( i );
        }

        function tokenize( selector, parseOnly ) {
            var matched, match, tokens, type,
                soFar, groups, preFilters,
                cached = tokenCache[ selector + " " ];

            if ( cached ) {
                return parseOnly ? 0 : cached.slice( 0 );
            }

            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;

            while ( soFar ) {

                // Comma and first run
                if ( !matched || (match = rcomma.exec( soFar )) ) {
                    if ( match ) {
                        // Don't consume trailing commas as valid
                        soFar = soFar.slice( match[0].length ) || soFar;
                    }
                    groups.push( tokens = [] );
                }

                matched = false;

                // Combinators
                if ( (match = rcombinators.exec( soFar )) ) {
                    matched = match.shift();
                    tokens.push( {
                        value: matched,
                        // Cast descendant combinators to space
                        type: match[0].replace( rtrim, " " )
                    } );
                    soFar = soFar.slice( matched.length );
                }

                // Filters
                for ( type in Expr.filter ) {
                    if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                        (match = preFilters[ type ]( match ))) ) {
                        matched = match.shift();
                        tokens.push( {
                            value: matched,
                            type: type,
                            matches: match
                        } );
                        soFar = soFar.slice( matched.length );
                    }
                }

                if ( !matched ) {
                    break;
                }
            }

            // Return the length of the invalid excess
            // if we're just parsing
            // Otherwise, throw an error or return tokens
            return parseOnly ?
                soFar.length :
                soFar ?
                    Sizzle.error( selector ) :
                    // Cache the tokens
                    tokenCache( selector, groups ).slice( 0 );
        }

        function toSelector( tokens ) {
            var i = 0,
                len = tokens.length,
                selector = "";
            for ( ; i < len; i++ ) {
                selector += tokens[i].value;
            }
            return selector;
        }

        function addCombinator( matcher, combinator, base ) {
            var dir = combinator.dir,
                checkNonElements = base && dir === "parentNode",
                doneName = done++;

            return combinator.first ?
                // Check against closest ancestor/preceding element
                function( elem, context, xml ) {
                    while ( (elem = elem[ dir ]) ) {
                        if ( elem.nodeType === 1 || checkNonElements ) {
                            return matcher( elem, context, xml );
                        }
                    }
                } :

                // Check against all ancestor/preceding elements
                function( elem, context, xml ) {
                    var data, cache, outerCache,
                        dirkey = dirruns + " " + doneName;

                    // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                    if ( xml ) {
                        while ( (elem = elem[ dir ]) ) {
                            if ( elem.nodeType === 1 || checkNonElements ) {
                                if ( matcher( elem, context, xml ) ) {
                                    return true;
                                }
                            }
                        }
                    } else {
                        while ( (elem = elem[ dir ]) ) {
                            if ( elem.nodeType === 1 || checkNonElements ) {
                                outerCache = elem[ expando ] || (elem[ expando ] = {});
                                if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
                                    if ( (data = cache[1]) === true || data === cachedruns ) {
                                        return data === true;
                                    }
                                } else {
                                    cache = outerCache[ dir ] = [ dirkey ];
                                    cache[1] = matcher( elem, context, xml ) || cachedruns;
                                    if ( cache[1] === true ) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                };
        }

        function elementMatcher( matchers ) {
            return matchers.length > 1 ?
                function( elem, context, xml ) {
                    var i = matchers.length;
                    while ( i-- ) {
                        if ( !matchers[i]( elem, context, xml ) ) {
                            return false;
                        }
                    }
                    return true;
                } :
                matchers[0];
        }

        function condense( unmatched, map, filter, context, xml ) {
            var elem,
                newUnmatched = [],
                i = 0,
                len = unmatched.length,
                mapped = map != null;

            for ( ; i < len; i++ ) {
                if ( (elem = unmatched[i]) ) {
                    if ( !filter || filter( elem, context, xml ) ) {
                        newUnmatched.push( elem );
                        if ( mapped ) {
                            map.push( i );
                        }
                    }
                }
            }

            return newUnmatched;
        }

        function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
            if ( postFilter && !postFilter[ expando ] ) {
                postFilter = setMatcher( postFilter );
            }
            if ( postFinder && !postFinder[ expando ] ) {
                postFinder = setMatcher( postFinder, postSelector );
            }
            return markFunction(function( seed, results, context, xml ) {
                var temp, i, elem,
                    preMap = [],
                    postMap = [],
                    preexisting = results.length,

                // Get initial elements from seed or context
                    elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

                // Prefilter to get matcher input, preserving a map for seed-results synchronization
                    matcherIn = preFilter && ( seed || !selector ) ?
                        condense( elems, preMap, preFilter, context, xml ) :
                        elems,

                    matcherOut = matcher ?
                        // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                        postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                            // ...intermediate processing is necessary
                            [] :

                            // ...otherwise use results directly
                            results :
                        matcherIn;

                // Find primary matches
                if ( matcher ) {
                    matcher( matcherIn, matcherOut, context, xml );
                }

                // Apply postFilter
                if ( postFilter ) {
                    temp = condense( matcherOut, postMap );
                    postFilter( temp, [], context, xml );

                    // Un-match failing elements by moving them back to matcherIn
                    i = temp.length;
                    while ( i-- ) {
                        if ( (elem = temp[i]) ) {
                            matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                        }
                    }
                }

                if ( seed ) {
                    if ( postFinder || preFilter ) {
                        if ( postFinder ) {
                            // Get the final matcherOut by condensing this intermediate into postFinder contexts
                            temp = [];
                            i = matcherOut.length;
                            while ( i-- ) {
                                if ( (elem = matcherOut[i]) ) {
                                    // Restore matcherIn since elem is not yet a final match
                                    temp.push( (matcherIn[i] = elem) );
                                }
                            }
                            postFinder( null, (matcherOut = []), temp, xml );
                        }

                        // Move matched elements from seed to results to keep them synchronized
                        i = matcherOut.length;
                        while ( i-- ) {
                            if ( (elem = matcherOut[i]) &&
                                (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

                                seed[temp] = !(results[temp] = elem);
                            }
                        }
                    }

                    // Add elements to results, through postFinder if defined
                } else {
                    matcherOut = condense(
                        matcherOut === results ?
                            matcherOut.splice( preexisting, matcherOut.length ) :
                            matcherOut
                    );
                    if ( postFinder ) {
                        postFinder( null, results, matcherOut, xml );
                    } else {
                        push.apply( results, matcherOut );
                    }
                }
            });
        }

        function matcherFromTokens( tokens ) {
            var checkContext, matcher, j,
                len = tokens.length,
                leadingRelative = Expr.relative[ tokens[0].type ],
                implicitRelative = leadingRelative || Expr.relative[" "],
                i = leadingRelative ? 1 : 0,

            // The foundational matcher ensures that elements are reachable from top-level context(s)
                matchContext = addCombinator( function( elem ) {
                    return elem === checkContext;
                }, implicitRelative, true ),
                matchAnyContext = addCombinator( function( elem ) {
                    return indexOf.call( checkContext, elem ) > -1;
                }, implicitRelative, true ),
                matchers = [ function( elem, context, xml ) {
                    return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                            (checkContext = context).nodeType ?
                                matchContext( elem, context, xml ) :
                                matchAnyContext( elem, context, xml ) );
                } ];

            for ( ; i < len; i++ ) {
                if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
                    matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
                } else {
                    matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

                    // Return special upon seeing a positional matcher
                    if ( matcher[ expando ] ) {
                        // Find the next relative operator (if any) for proper handling
                        j = ++i;
                        for ( ; j < len; j++ ) {
                            if ( Expr.relative[ tokens[j].type ] ) {
                                break;
                            }
                        }
                        return setMatcher(
                            i > 1 && elementMatcher( matchers ),
                            i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
                            matcher,
                            i < j && matcherFromTokens( tokens.slice( i, j ) ),
                            j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                            j < len && toSelector( tokens )
                        );
                    }
                    matchers.push( matcher );
                }
            }

            return elementMatcher( matchers );
        }

        function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
            // A counter to specify which element is currently being matched
            var matcherCachedRuns = 0,
                bySet = setMatchers.length > 0,
                byElement = elementMatchers.length > 0,
                superMatcher = function( seed, context, xml, results, expandContext ) {
                    var elem, j, matcher,
                        setMatched = [],
                        matchedCount = 0,
                        i = "0",
                        unmatched = seed && [],
                        outermost = expandContext != null,
                        contextBackup = outermostContext,
                    // We must always have either seed elements or context
                        elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
                    // Use integer dirruns iff this is the outermost matcher
                        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

                    if ( outermost ) {
                        outermostContext = context !== document && context;
                        cachedruns = matcherCachedRuns;
                    }

                    // Add elements passing elementMatchers directly to results
                    // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
                    for ( ; (elem = elems[i]) != null; i++ ) {
                        if ( byElement && elem ) {
                            j = 0;
                            while ( (matcher = elementMatchers[j++]) ) {
                                if ( matcher( elem, context, xml ) ) {
                                    results.push( elem );
                                    break;
                                }
                            }
                            if ( outermost ) {
                                dirruns = dirrunsUnique;
                                cachedruns = ++matcherCachedRuns;
                            }
                        }

                        // Track unmatched elements for set filters
                        if ( bySet ) {
                            // They will have gone through all possible matchers
                            if ( (elem = !matcher && elem) ) {
                                matchedCount--;
                            }

                            // Lengthen the array for every element, matched or not
                            if ( seed ) {
                                unmatched.push( elem );
                            }
                        }
                    }

                    // Apply set filters to unmatched elements
                    matchedCount += i;
                    if ( bySet && i !== matchedCount ) {
                        j = 0;
                        while ( (matcher = setMatchers[j++]) ) {
                            matcher( unmatched, setMatched, context, xml );
                        }

                        if ( seed ) {
                            // Reintegrate element matches to eliminate the need for sorting
                            if ( matchedCount > 0 ) {
                                while ( i-- ) {
                                    if ( !(unmatched[i] || setMatched[i]) ) {
                                        setMatched[i] = pop.call( results );
                                    }
                                }
                            }

                            // Discard index placeholder values to get only actual matches
                            setMatched = condense( setMatched );
                        }

                        // Add matches to results
                        push.apply( results, setMatched );

                        // Seedless set matches succeeding multiple successful matchers stipulate sorting
                        if ( outermost && !seed && setMatched.length > 0 &&
                            ( matchedCount + setMatchers.length ) > 1 ) {

                            Sizzle.uniqueSort( results );
                        }
                    }

                    // Override manipulation of globals by nested matchers
                    if ( outermost ) {
                        dirruns = dirrunsUnique;
                        outermostContext = contextBackup;
                    }

                    return unmatched;
                };

            return bySet ?
                markFunction( superMatcher ) :
                superMatcher;
        }

        compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
            var i,
                setMatchers = [],
                elementMatchers = [],
                cached = compilerCache[ selector + " " ];

            if ( !cached ) {
                // Generate a function of recursive functions that can be used to check each element
                if ( !group ) {
                    group = tokenize( selector );
                }
                i = group.length;
                while ( i-- ) {
                    cached = matcherFromTokens( group[i] );
                    if ( cached[ expando ] ) {
                        setMatchers.push( cached );
                    } else {
                        elementMatchers.push( cached );
                    }
                }

                // Cache the compiled function
                cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
            }
            return cached;
        };

        function multipleContexts( selector, contexts, results ) {
            var i = 0,
                len = contexts.length;
            for ( ; i < len; i++ ) {
                Sizzle( selector, contexts[i], results );
            }
            return results;
        }

        function select( selector, context, results, seed ) {
            var i, tokens, token, type, find,
                match = tokenize( selector );

            if ( !seed ) {
                // Try to minimize operations if there is only one group
                if ( match.length === 1 ) {

                    // Take a shortcut and set the context if the root selector is an ID
                    tokens = match[0] = match[0].slice( 0 );
                    if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                        context.nodeType === 9 && !documentIsXML &&
                        Expr.relative[ tokens[1].type ] ) {

                        context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
                        if ( !context ) {
                            return results;
                        }

                        selector = selector.slice( tokens.shift().value.length );
                    }

                    // Fetch a seed set for right-to-left matching
                    i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
                    while ( i-- ) {
                        token = tokens[i];

                        // Abort if we hit a combinator
                        if ( Expr.relative[ (type = token.type) ] ) {
                            break;
                        }
                        if ( (find = Expr.find[ type ]) ) {
                            // Search, expanding context for leading sibling combinators
                            if ( (seed = find(
                                    token.matches[0].replace( runescape, funescape ),
                                    rsibling.test( tokens[0].type ) && context.parentNode || context
                                )) ) {

                                // If seed is empty or no tokens remain, we can return early
                                tokens.splice( i, 1 );
                                selector = seed.length && toSelector( tokens );
                                if ( !selector ) {
                                    push.apply( results, slice.call( seed, 0 ) );
                                    return results;
                                }

                                break;
                            }
                        }
                    }
                }
            }

            // Compile and execute a filtering function
            // Provide `match` to avoid retokenization if we modified the selector above
            compile( selector, match )(
                seed,
                context,
                documentIsXML,
                results,
                rsibling.test( selector )
            );
            return results;
        }

// Deprecated
        Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
        function setFilters() {}
        Expr.filters = setFilters.prototype = Expr.pseudos;
        Expr.setFilters = new setFilters();

// Initialize with the default document
        setDocument();

// Override sizzle attribute retrieval
        Sizzle.attr = jQuery.attr;
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;


    })( window );
    var runtil = /Until$/,
        rparentsprev = /^(?:parents|prev(?:Until|All))/,
        isSimple = /^.[^:#\[\.,]*$/,
        rneedsContext = jQuery.expr.match.needsContext,
    // methods guaranteed to produce a unique set when starting from a unique set
        guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };

    jQuery.fn.extend({
        find: function( selector ) {
            var i, ret, self,
                len = this.length;

            if ( typeof selector !== "string" ) {
                self = this;
                return this.pushStack( jQuery( selector ).filter(function() {
                    for ( i = 0; i < len; i++ ) {
                        if ( jQuery.contains( self[ i ], this ) ) {
                            return true;
                        }
                    }
                }) );
            }

            ret = [];
            for ( i = 0; i < len; i++ ) {
                jQuery.find( selector, this[ i ], ret );
            }

            // Needed because $( selector, context ) becomes $( context ).find( selector )
            ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
            ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
            return ret;
        },

        has: function( target ) {
            var i,
                targets = jQuery( target, this ),
                len = targets.length;

            return this.filter(function() {
                for ( i = 0; i < len; i++ ) {
                    if ( jQuery.contains( this, targets[i] ) ) {
                        return true;
                    }
                }
            });
        },

        not: function( selector ) {
            return this.pushStack( winnow(this, selector, false) );
        },

        filter: function( selector ) {
            return this.pushStack( winnow(this, selector, true) );
        },

        is: function( selector ) {
            return !!selector && (
                    typeof selector === "string" ?
                        // If this is a positional/relative selector, check membership in the returned set
                        // so $("p:first").is("p:last") won't return true for a doc with two "p".
                        rneedsContext.test( selector ) ?
                        jQuery( selector, this.context ).index( this[0] ) >= 0 :
                        jQuery.filter( selector, this ).length > 0 :
                    this.filter( selector ).length > 0 );
        },

        closest: function( selectors, context ) {
            var cur,
                i = 0,
                l = this.length,
                ret = [],
                pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
                    jQuery( selectors, context || this.context ) :
                    0;

            for ( ; i < l; i++ ) {
                cur = this[i];

                while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
                    if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
                        ret.push( cur );
                        break;
                    }
                    cur = cur.parentNode;
                }
            }

            return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
        },

        // Determine the position of an element within
        // the matched set of elements
        index: function( elem ) {

            // No argument, return index in parent
            if ( !elem ) {
                return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
            }

            // index in selector
            if ( typeof elem === "string" ) {
                return jQuery.inArray( this[0], jQuery( elem ) );
            }

            // Locate the position of the desired element
            return jQuery.inArray(
                // If it receives a jQuery object, the first element is used
                elem.jquery ? elem[0] : elem, this );
        },

        add: function( selector, context ) {
            var set = typeof selector === "string" ?
                    jQuery( selector, context ) :
                    jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
                all = jQuery.merge( this.get(), set );

            return this.pushStack( jQuery.unique(all) );
        },

        addBack: function( selector ) {
            return this.add( selector == null ?
                    this.prevObject : this.prevObject.filter(selector)
            );
        }
    });

    jQuery.fn.andSelf = jQuery.fn.addBack;

    function sibling( cur, dir ) {
        do {
            cur = cur[ dir ];
        } while ( cur && cur.nodeType !== 1 );

        return cur;
    }

    jQuery.each({
        parent: function( elem ) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function( elem ) {
            return jQuery.dir( elem, "parentNode" );
        },
        parentsUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "parentNode", until );
        },
        next: function( elem ) {
            return sibling( elem, "nextSibling" );
        },
        prev: function( elem ) {
            return sibling( elem, "previousSibling" );
        },
        nextAll: function( elem ) {
            return jQuery.dir( elem, "nextSibling" );
        },
        prevAll: function( elem ) {
            return jQuery.dir( elem, "previousSibling" );
        },
        nextUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "nextSibling", until );
        },
        prevUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "previousSibling", until );
        },
        siblings: function( elem ) {
            return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
        },
        children: function( elem ) {
            return jQuery.sibling( elem.firstChild );
        },
        contents: function( elem ) {
            return jQuery.nodeName( elem, "iframe" ) ?
            elem.contentDocument || elem.contentWindow.document :
                jQuery.merge( [], elem.childNodes );
        }
    }, function( name, fn ) {
        jQuery.fn[ name ] = function( until, selector ) {
            var ret = jQuery.map( this, fn, until );

            if ( !runtil.test( name ) ) {
                selector = until;
            }

            if ( selector && typeof selector === "string" ) {
                ret = jQuery.filter( selector, ret );
            }

            ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

            if ( this.length > 1 && rparentsprev.test( name ) ) {
                ret = ret.reverse();
            }

            return this.pushStack( ret );
        };
    });

    jQuery.extend({
        filter: function( expr, elems, not ) {
            if ( not ) {
                expr = ":not(" + expr + ")";
            }

            return elems.length === 1 ?
                jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
                jQuery.find.matches(expr, elems);
        },

        dir: function( elem, dir, until ) {
            var matched = [],
                cur = elem[ dir ];

            while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
                if ( cur.nodeType === 1 ) {
                    matched.push( cur );
                }
                cur = cur[dir];
            }
            return matched;
        },

        sibling: function( n, elem ) {
            var r = [];

            for ( ; n; n = n.nextSibling ) {
                if ( n.nodeType === 1 && n !== elem ) {
                    r.push( n );
                }
            }

            return r;
        }
    });

// Implement the identical functionality for filter and not
    function winnow( elements, qualifier, keep ) {

        // Can't pass null or undefined to indexOf in Firefox 4
        // Set to 0 to skip string check
        qualifier = qualifier || 0;

        if ( jQuery.isFunction( qualifier ) ) {
            return jQuery.grep(elements, function( elem, i ) {
                var retVal = !!qualifier.call( elem, i, elem );
                return retVal === keep;
            });

        } else if ( qualifier.nodeType ) {
            return jQuery.grep(elements, function( elem ) {
                return ( elem === qualifier ) === keep;
            });

        } else if ( typeof qualifier === "string" ) {
            var filtered = jQuery.grep(elements, function( elem ) {
                return elem.nodeType === 1;
            });

            if ( isSimple.test( qualifier ) ) {
                return jQuery.filter(qualifier, filtered, !keep);
            } else {
                qualifier = jQuery.filter( qualifier, filtered );
            }
        }

        return jQuery.grep(elements, function( elem ) {
            return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
        });
    }
    function createSafeFragment( document ) {
        var list = nodeNames.split( "|" ),
            safeFrag = document.createDocumentFragment();

        if ( safeFrag.createElement ) {
            while ( list.length ) {
                safeFrag.createElement(
                    list.pop()
                );
            }
        }
        return safeFrag;
    }

    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
            "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
        rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
        rleadingWhitespace = /^\s+/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rtagName = /<([\w:]+)/,
        rtbody = /<tbody/i,
        rhtml = /<|&#?\w+;/,
        rnoInnerhtml = /<(?:script|style|link)/i,
        manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
    // checked="checked" or checked
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rscriptType = /^$|\/(?:java|ecma)script/i,
        rscriptTypeMasked = /^true\/(.*)/,
        rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

    // We have to close these tags to support XHTML (#13200)
        wrapMap = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            legend: [ 1, "<fieldset>", "</fieldset>" ],
            area: [ 1, "<map>", "</map>" ],
            param: [ 1, "<object>", "</object>" ],
            thead: [ 1, "<table>", "</table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

            // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
            // unless wrapped in a div with non-breaking characters in front of it.
            _default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
        },
        safeFragment = createSafeFragment( document ),
        fragmentDiv = safeFragment.appendChild( document.createElement("div") );

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    jQuery.fn.extend({
        text: function( value ) {
            return jQuery.access( this, function( value ) {
                return value === undefined ?
                    jQuery.text( this ) :
                    this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
            }, null, value, arguments.length );
        },

        wrapAll: function( html ) {
            if ( jQuery.isFunction( html ) ) {
                return this.each(function(i) {
                    jQuery(this).wrapAll( html.call(this, i) );
                });
            }

            if ( this[0] ) {
                // The elements to wrap the target around
                var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

                if ( this[0].parentNode ) {
                    wrap.insertBefore( this[0] );
                }

                wrap.map(function() {
                    var elem = this;

                    while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
                        elem = elem.firstChild;
                    }

                    return elem;
                }).append( this );
            }

            return this;
        },

        wrapInner: function( html ) {
            if ( jQuery.isFunction( html ) ) {
                return this.each(function(i) {
                    jQuery(this).wrapInner( html.call(this, i) );
                });
            }

            return this.each(function() {
                var self = jQuery( this ),
                    contents = self.contents();

                if ( contents.length ) {
                    contents.wrapAll( html );

                } else {
                    self.append( html );
                }
            });
        },

        wrap: function( html ) {
            var isFunction = jQuery.isFunction( html );

            return this.each(function(i) {
                jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
            });
        },

        unwrap: function() {
            return this.parent().each(function() {
                if ( !jQuery.nodeName( this, "body" ) ) {
                    jQuery( this ).replaceWith( this.childNodes );
                }
            }).end();
        },

        append: function() {
            return this.domManip(arguments, true, function( elem ) {
                if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                    this.appendChild( elem );
                }
            });
        },

        prepend: function() {
            return this.domManip(arguments, true, function( elem ) {
                if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                    this.insertBefore( elem, this.firstChild );
                }
            });
        },

        before: function() {
            return this.domManip( arguments, false, function( elem ) {
                if ( this.parentNode ) {
                    this.parentNode.insertBefore( elem, this );
                }
            });
        },

        after: function() {
            return this.domManip( arguments, false, function( elem ) {
                if ( this.parentNode ) {
                    this.parentNode.insertBefore( elem, this.nextSibling );
                }
            });
        },

        // keepData is for internal use only--do not document
        remove: function( selector, keepData ) {
            var elem,
                i = 0;

            for ( ; (elem = this[i]) != null; i++ ) {
                if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
                    if ( !keepData && elem.nodeType === 1 ) {
                        jQuery.cleanData( getAll( elem ) );
                    }

                    if ( elem.parentNode ) {
                        if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
                            setGlobalEval( getAll( elem, "script" ) );
                        }
                        elem.parentNode.removeChild( elem );
                    }
                }
            }

            return this;
        },

        empty: function() {
            var elem,
                i = 0;

            for ( ; (elem = this[i]) != null; i++ ) {
                // Remove element nodes and prevent memory leaks
                if ( elem.nodeType === 1 ) {
                    jQuery.cleanData( getAll( elem, false ) );
                }

                // Remove any remaining nodes
                while ( elem.firstChild ) {
                    elem.removeChild( elem.firstChild );
                }

                // If this is a select, ensure that it displays empty (#12336)
                // Support: IE<9
                if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
                    elem.options.length = 0;
                }
            }

            return this;
        },

        clone: function( dataAndEvents, deepDataAndEvents ) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map( function () {
                return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
            });
        },

        html: function( value ) {
            return jQuery.access( this, function( value ) {
                var elem = this[0] || {},
                    i = 0,
                    l = this.length;

                if ( value === undefined ) {
                    return elem.nodeType === 1 ?
                        elem.innerHTML.replace( rinlinejQuery, "" ) :
                        undefined;
                }

                // See if we can take a shortcut and just use innerHTML
                if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
                    ( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
                    ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
                    !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

                    value = value.replace( rxhtmlTag, "<$1></$2>" );

                    try {
                        for (; i < l; i++ ) {
                            // Remove element nodes and prevent memory leaks
                            elem = this[i] || {};
                            if ( elem.nodeType === 1 ) {
                                jQuery.cleanData( getAll( elem, false ) );
                                elem.innerHTML = value;
                            }
                        }

                        elem = 0;

                        // If using innerHTML throws an exception, use the fallback method
                    } catch(e) {}
                }

                if ( elem ) {
                    this.empty().append( value );
                }
            }, null, value, arguments.length );
        },

        replaceWith: function( value ) {
            var isFunc = jQuery.isFunction( value );

            // Make sure that the elements are removed from the DOM before they are inserted
            // this can help fix replacing a parent with child elements
            if ( !isFunc && typeof value !== "string" ) {
                value = jQuery( value ).not( this ).detach();
            }

            return this.domManip( [ value ], true, function( elem ) {
                var next = this.nextSibling,
                    parent = this.parentNode;

                if ( parent ) {
                    jQuery( this ).remove();
                    parent.insertBefore( elem, next );
                }
            });
        },

        detach: function( selector ) {
            return this.remove( selector, true );
        },

        domManip: function( args, table, callback ) {

            // Flatten any nested arrays
            args = core_concat.apply( [], args );

            var first, node, hasScripts,
                scripts, doc, fragment,
                i = 0,
                l = this.length,
                set = this,
                iNoClone = l - 1,
                value = args[0],
                isFunction = jQuery.isFunction( value );

            // We can't cloneNode fragments that contain checked, in WebKit
            if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
                return this.each(function( index ) {
                    var self = set.eq( index );
                    if ( isFunction ) {
                        args[0] = value.call( this, index, table ? self.html() : undefined );
                    }
                    self.domManip( args, table, callback );
                });
            }

            if ( l ) {
                fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
                first = fragment.firstChild;

                if ( fragment.childNodes.length === 1 ) {
                    fragment = first;
                }

                if ( first ) {
                    table = table && jQuery.nodeName( first, "tr" );
                    scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
                    hasScripts = scripts.length;

                    // Use the original fragment for the last item instead of the first because it can end up
                    // being emptied incorrectly in certain situations (#8070).
                    for ( ; i < l; i++ ) {
                        node = fragment;

                        if ( i !== iNoClone ) {
                            node = jQuery.clone( node, true, true );

                            // Keep references to cloned scripts for later restoration
                            if ( hasScripts ) {
                                jQuery.merge( scripts, getAll( node, "script" ) );
                            }
                        }

                        callback.call(
                            table && jQuery.nodeName( this[i], "table" ) ?
                                findOrAppend( this[i], "tbody" ) :
                                this[i],
                            node,
                            i
                        );
                    }

                    if ( hasScripts ) {
                        doc = scripts[ scripts.length - 1 ].ownerDocument;

                        // Reenable scripts
                        jQuery.map( scripts, restoreScript );

                        // Evaluate executable scripts on first document insertion
                        for ( i = 0; i < hasScripts; i++ ) {
                            node = scripts[ i ];
                            if ( rscriptType.test( node.type || "" ) &&
                                !jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

                                if ( node.src ) {
                                    // Hope ajax is available...
                                    jQuery.ajax({
                                        url: node.src,
                                        type: "GET",
                                        dataType: "script",
                                        async: false,
                                        global: false,
                                        "throws": true
                                    });
                                } else {
                                    jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
                                }
                            }
                        }
                    }

                    // Fix #11809: Avoid leaking memory
                    fragment = first = null;
                }
            }

            return this;
        }
    });

    function findOrAppend( elem, tag ) {
        return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
    }

// Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript( elem ) {
        var attr = elem.getAttributeNode("type");
        elem.type = ( attr && attr.specified ) + "/" + elem.type;
        return elem;
    }
    function restoreScript( elem ) {
        var match = rscriptTypeMasked.exec( elem.type );
        if ( match ) {
            elem.type = match[1];
        } else {
            elem.removeAttribute("type");
        }
        return elem;
    }

// Mark scripts as having already been evaluated
    function setGlobalEval( elems, refElements ) {
        var elem,
            i = 0;
        for ( ; (elem = elems[i]) != null; i++ ) {
            jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
        }
    }

    function cloneCopyEvent( src, dest ) {

        if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
            return;
        }

        var type, i, l,
            oldData = jQuery._data( src ),
            curData = jQuery._data( dest, oldData ),
            events = oldData.events;

        if ( events ) {
            delete curData.handle;
            curData.events = {};

            for ( type in events ) {
                for ( i = 0, l = events[ type ].length; i < l; i++ ) {
                    jQuery.event.add( dest, type, events[ type ][ i ] );
                }
            }
        }

        // make the cloned public data object a copy from the original
        if ( curData.data ) {
            curData.data = jQuery.extend( {}, curData.data );
        }
    }

    function fixCloneNodeIssues( src, dest ) {
        var nodeName, e, data;

        // We do not need to do anything for non-Elements
        if ( dest.nodeType !== 1 ) {
            return;
        }

        nodeName = dest.nodeName.toLowerCase();

        // IE6-8 copies events bound via attachEvent when using cloneNode.
        if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
            data = jQuery._data( dest );

            for ( e in data.events ) {
                jQuery.removeEvent( dest, e, data.handle );
            }

            // Event data gets referenced instead of copied if the expando gets copied too
            dest.removeAttribute( jQuery.expando );
        }

        // IE blanks contents when cloning scripts, and tries to evaluate newly-set text
        if ( nodeName === "script" && dest.text !== src.text ) {
            disableScript( dest ).text = src.text;
            restoreScript( dest );

            // IE6-10 improperly clones children of object elements using classid.
            // IE10 throws NoModificationAllowedError if parent is null, #12132.
        } else if ( nodeName === "object" ) {
            if ( dest.parentNode ) {
                dest.outerHTML = src.outerHTML;
            }

            // This path appears unavoidable for IE9. When cloning an object
            // element in IE9, the outerHTML strategy above is not sufficient.
            // If the src has innerHTML and the destination does not,
            // copy the src.innerHTML into the dest.innerHTML. #10324
            if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
                dest.innerHTML = src.innerHTML;
            }

        } else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
            // IE6-8 fails to persist the checked state of a cloned checkbox
            // or radio button. Worse, IE6-7 fail to give the cloned element
            // a checked appearance if the defaultChecked value isn't also set

            dest.defaultChecked = dest.checked = src.checked;

            // IE6-7 get confused and end up setting the value of a cloned
            // checkbox/radio button to an empty string instead of "on"
            if ( dest.value !== src.value ) {
                dest.value = src.value;
            }

            // IE6-8 fails to return the selected option to the default selected
            // state when cloning options
        } else if ( nodeName === "option" ) {
            dest.defaultSelected = dest.selected = src.defaultSelected;

            // IE6-8 fails to set the defaultValue to the correct value when
            // cloning other types of input fields
        } else if ( nodeName === "input" || nodeName === "textarea" ) {
            dest.defaultValue = src.defaultValue;
        }
    }

    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function( name, original ) {
        jQuery.fn[ name ] = function( selector ) {
            var elems,
                i = 0,
                ret = [],
                insert = jQuery( selector ),
                last = insert.length - 1;

            for ( ; i <= last; i++ ) {
                elems = i === last ? this : this.clone(true);
                jQuery( insert[i] )[ original ]( elems );

                // Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
                core_push.apply( ret, elems.get() );
            }

            return this.pushStack( ret );
        };
    });

    function getAll( context, tag ) {
        var elems, elem,
            i = 0,
            found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
                typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
                    undefined;

        if ( !found ) {
            for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
                if ( !tag || jQuery.nodeName( elem, tag ) ) {
                    found.push( elem );
                } else {
                    jQuery.merge( found, getAll( elem, tag ) );
                }
            }
        }

        return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
            jQuery.merge( [ context ], found ) :
            found;
    }

// Used in buildFragment, fixes the defaultChecked property
    function fixDefaultChecked( elem ) {
        if ( manipulation_rcheckableType.test( elem.type ) ) {
            elem.defaultChecked = elem.checked;
        }
    }

    jQuery.extend({
        clone: function( elem, dataAndEvents, deepDataAndEvents ) {
            var destElements, node, clone, i, srcElements,
                inPage = jQuery.contains( elem.ownerDocument, elem );

            if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
                clone = elem.cloneNode( true );

                // IE<=8 does not properly clone detached, unknown element nodes
            } else {
                fragmentDiv.innerHTML = elem.outerHTML;
                fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
            }

            if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
                (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

                // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
                destElements = getAll( clone );
                srcElements = getAll( elem );

                // Fix all IE cloning issues
                for ( i = 0; (node = srcElements[i]) != null; ++i ) {
                    // Ensure that the destination node is not null; Fixes #9587
                    if ( destElements[i] ) {
                        fixCloneNodeIssues( node, destElements[i] );
                    }
                }
            }

            // Copy the events from the original to the clone
            if ( dataAndEvents ) {
                if ( deepDataAndEvents ) {
                    srcElements = srcElements || getAll( elem );
                    destElements = destElements || getAll( clone );

                    for ( i = 0; (node = srcElements[i]) != null; i++ ) {
                        cloneCopyEvent( node, destElements[i] );
                    }
                } else {
                    cloneCopyEvent( elem, clone );
                }
            }

            // Preserve script evaluation history
            destElements = getAll( clone, "script" );
            if ( destElements.length > 0 ) {
                setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
            }

            destElements = srcElements = node = null;

            // Return the cloned set
            return clone;
        },

        buildFragment: function( elems, context, scripts, selection ) {
            var j, elem, contains,
                tmp, tag, tbody, wrap,
                l = elems.length,

            // Ensure a safe fragment
                safe = createSafeFragment( context ),

                nodes = [],
                i = 0;

            for ( ; i < l; i++ ) {
                elem = elems[ i ];

                if ( elem || elem === 0 ) {

                    // Add nodes directly
                    if ( jQuery.type( elem ) === "object" ) {
                        jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

                        // Convert non-html into a text node
                    } else if ( !rhtml.test( elem ) ) {
                        nodes.push( context.createTextNode( elem ) );

                        // Convert html into DOM nodes
                    } else {
                        tmp = tmp || safe.appendChild( context.createElement("div") );

                        // Deserialize a standard representation
                        tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
                        wrap = wrapMap[ tag ] || wrapMap._default;

                        tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

                        // Descend through wrappers to the right content
                        j = wrap[0];
                        while ( j-- ) {
                            tmp = tmp.lastChild;
                        }

                        // Manually add leading whitespace removed by IE
                        if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
                            nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
                        }

                        // Remove IE's autoinserted <tbody> from table fragments
                        if ( !jQuery.support.tbody ) {

                            // String was a <table>, *may* have spurious <tbody>
                            elem = tag === "table" && !rtbody.test( elem ) ?
                                tmp.firstChild :

                                // String was a bare <thead> or <tfoot>
                                wrap[1] === "<table>" && !rtbody.test( elem ) ?
                                    tmp :
                                    0;

                            j = elem && elem.childNodes.length;
                            while ( j-- ) {
                                if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
                                    elem.removeChild( tbody );
                                }
                            }
                        }

                        jQuery.merge( nodes, tmp.childNodes );

                        // Fix #12392 for WebKit and IE > 9
                        tmp.textContent = "";

                        // Fix #12392 for oldIE
                        while ( tmp.firstChild ) {
                            tmp.removeChild( tmp.firstChild );
                        }

                        // Remember the top-level container for proper cleanup
                        tmp = safe.lastChild;
                    }
                }
            }

            // Fix #11356: Clear elements from fragment
            if ( tmp ) {
                safe.removeChild( tmp );
            }

            // Reset defaultChecked for any radios and checkboxes
            // about to be appended to the DOM in IE 6/7 (#8060)
            if ( !jQuery.support.appendChecked ) {
                jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
            }

            i = 0;
            while ( (elem = nodes[ i++ ]) ) {

                // #4087 - If origin and destination elements are the same, and this is
                // that element, do not do anything
                if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
                    continue;
                }

                contains = jQuery.contains( elem.ownerDocument, elem );

                // Append to fragment
                tmp = getAll( safe.appendChild( elem ), "script" );

                // Preserve script evaluation history
                if ( contains ) {
                    setGlobalEval( tmp );
                }

                // Capture executables
                if ( scripts ) {
                    j = 0;
                    while ( (elem = tmp[ j++ ]) ) {
                        if ( rscriptType.test( elem.type || "" ) ) {
                            scripts.push( elem );
                        }
                    }
                }
            }

            tmp = null;

            return safe;
        },

        cleanData: function( elems, /* internal */ acceptData ) {
            var elem, type, id, data,
                i = 0,
                internalKey = jQuery.expando,
                cache = jQuery.cache,
                deleteExpando = jQuery.support.deleteExpando,
                special = jQuery.event.special;

            for ( ; (elem = elems[i]) != null; i++ ) {

                if ( acceptData || jQuery.acceptData( elem ) ) {

                    id = elem[ internalKey ];
                    data = id && cache[ id ];

                    if ( data ) {
                        if ( data.events ) {
                            for ( type in data.events ) {
                                if ( special[ type ] ) {
                                    jQuery.event.remove( elem, type );

                                    // This is a shortcut to avoid jQuery.event.remove's overhead
                                } else {
                                    jQuery.removeEvent( elem, type, data.handle );
                                }
                            }
                        }

                        // Remove cache only if it was not already removed by jQuery.event.remove
                        if ( cache[ id ] ) {

                            delete cache[ id ];

                            // IE does not allow us to delete expando properties from nodes,
                            // nor does it have a removeAttribute function on Document nodes;
                            // we must handle all of these cases
                            if ( deleteExpando ) {
                                delete elem[ internalKey ];

                            } else if ( typeof elem.removeAttribute !== core_strundefined ) {
                                elem.removeAttribute( internalKey );

                            } else {
                                elem[ internalKey ] = null;
                            }

                            core_deletedIds.push( id );
                        }
                    }
                }
            }
        }
    });
    var iframe, getStyles, curCSS,
        ralpha = /alpha\([^)]*\)/i,
        ropacity = /opacity\s*=\s*([^)]*)/,
        rposition = /^(top|right|bottom|left)$/,
    // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
    // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
        rdisplayswap = /^(none|table(?!-c[ea]).+)/,
        rmargin = /^margin/,
        rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
        rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
        rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
        elemdisplay = { BODY: "block" },

        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
        cssNormalTransform = {
            letterSpacing: 0,
            fontWeight: 400
        },

        cssExpand = [ "Top", "Right", "Bottom", "Left" ],
        cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
    function vendorPropName( style, name ) {

        // shortcut for names that are not vendor prefixed
        if ( name in style ) {
            return name;
        }

        // check for vendor prefixed names
        var capName = name.charAt(0).toUpperCase() + name.slice(1),
            origName = name,
            i = cssPrefixes.length;

        while ( i-- ) {
            name = cssPrefixes[ i ] + capName;
            if ( name in style ) {
                return name;
            }
        }

        return origName;
    }

    function isHidden( elem, el ) {
        // isHidden might be called from jQuery#filter function;
        // in that case, element will be second argument
        elem = el || elem;
        return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
    }

    function showHide( elements, show ) {
        var display, elem, hidden,
            values = [],
            index = 0,
            length = elements.length;

        for ( ; index < length; index++ ) {
            elem = elements[ index ];
            if ( !elem.style ) {
                continue;
            }

            values[ index ] = jQuery._data( elem, "olddisplay" );
            display = elem.style.display;
            if ( show ) {
                // Reset the inline display of this element to learn if it is
                // being hidden by cascaded rules or not
                if ( !values[ index ] && display === "none" ) {
                    elem.style.display = "";
                }

                // Set elements which have been overridden with display: none
                // in a stylesheet to whatever the default browser style is
                // for such an element
                if ( elem.style.display === "" && isHidden( elem ) ) {
                    values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
                }
            } else {

                if ( !values[ index ] ) {
                    hidden = isHidden( elem );

                    if ( display && display !== "none" || !hidden ) {
                        jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
                    }
                }
            }
        }

        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for ( index = 0; index < length; index++ ) {
            elem = elements[ index ];
            if ( !elem.style ) {
                continue;
            }
            if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
                elem.style.display = show ? values[ index ] || "" : "none";
            }
        }

        return elements;
    }

    jQuery.fn.extend({
        css: function( name, value ) {
            return jQuery.access( this, function( elem, name, value ) {
                var len, styles,
                    map = {},
                    i = 0;

                if ( jQuery.isArray( name ) ) {
                    styles = getStyles( elem );
                    len = name.length;

                    for ( ; i < len; i++ ) {
                        map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
                    }

                    return map;
                }

                return value !== undefined ?
                    jQuery.style( elem, name, value ) :
                    jQuery.css( elem, name );
            }, name, value, arguments.length > 1 );
        },
        show: function() {
            return showHide( this, true );
        },
        hide: function() {
            return showHide( this );
        },
        toggle: function( state ) {
            var bool = typeof state === "boolean";

            return this.each(function() {
                if ( bool ? state : isHidden( this ) ) {
                    jQuery( this ).show();
                } else {
                    jQuery( this ).hide();
                }
            });
        }
    });

    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function( elem, computed ) {
                    if ( computed ) {
                        // We should always get a number back from opacity
                        var ret = curCSS( elem, "opacity" );
                        return ret === "" ? "1" : ret;
                    }
                }
            }
        },

        // Exclude the following css properties to add px
        cssNumber: {
            "columnCount": true,
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },

        // Get and set the style property on a DOM Node
        style: function( elem, name, value, extra ) {
            // Don't set styles on text and comment nodes
            if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
                return;
            }

            // Make sure that we're working with the right name
            var ret, type, hooks,
                origName = jQuery.camelCase( name ),
                style = elem.style;

            name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

            // Check if we're setting a value
            if ( value !== undefined ) {
                type = typeof value;

                // convert relative number strings (+= or -=) to relative numbers. #7345
                if ( type === "string" && (ret = rrelNum.exec( value )) ) {
                    value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
                    // Fixes bug #9237
                    type = "number";
                }

                // Make sure that NaN and null values aren't set. See: #7116
                if ( value == null || type === "number" && isNaN( value ) ) {
                    return;
                }

                // If a number was passed in, add 'px' to the (except for certain CSS properties)
                if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
                    value += "px";
                }

                // Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
                // but it would mean to define eight (for every problematic property) identical functions
                if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
                    style[ name ] = "inherit";
                }

                // If a hook was provided, use that value, otherwise just set the specified value
                if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

                    // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                    // Fixes bug #5509
                    try {
                        style[ name ] = value;
                    } catch(e) {}
                }

            } else {
                // If a hook was provided get the non-computed value from there
                if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[ name ];
            }
        },

        css: function( elem, name, extra, styles ) {
            var num, val, hooks,
                origName = jQuery.camelCase( name );

            // Make sure that we're working with the right name
            name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

            // If a hook was provided get the computed value from there
            if ( hooks && "get" in hooks ) {
                val = hooks.get( elem, true, extra );
            }

            // Otherwise, if a way to get the computed value exists, use that
            if ( val === undefined ) {
                val = curCSS( elem, name, styles );
            }

            //convert "normal" to computed value
            if ( val === "normal" && name in cssNormalTransform ) {
                val = cssNormalTransform[ name ];
            }

            // Return, converting to number if forced or a qualifier was provided and val looks numeric
            if ( extra === "" || extra ) {
                num = parseFloat( val );
                return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
            }
            return val;
        },

        // A method for quickly swapping in/out CSS properties to get correct calculations
        swap: function( elem, options, callback, args ) {
            var ret, name,
                old = {};

            // Remember the old values, and insert the new ones
            for ( name in options ) {
                old[ name ] = elem.style[ name ];
                elem.style[ name ] = options[ name ];
            }

            ret = callback.apply( elem, args || [] );

            // Revert the old values
            for ( name in options ) {
                elem.style[ name ] = old[ name ];
            }

            return ret;
        }
    });

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
    if ( window.getComputedStyle ) {
        getStyles = function( elem ) {
            return window.getComputedStyle( elem, null );
        };

        curCSS = function( elem, name, _computed ) {
            var width, minWidth, maxWidth,
                computed = _computed || getStyles( elem ),

            // getPropertyValue is only needed for .css('filter') in IE9, see #12537
                ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
                style = elem.style;

            if ( computed ) {

                if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
                    ret = jQuery.style( elem, name );
                }

                // A tribute to the "awesome hack by Dean Edwards"
                // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
                // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
                // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
                if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

                    // Remember the original values
                    width = style.width;
                    minWidth = style.minWidth;
                    maxWidth = style.maxWidth;

                    // Put in the new values to get a computed value out
                    style.minWidth = style.maxWidth = style.width = ret;
                    ret = computed.width;

                    // Revert the changed values
                    style.width = width;
                    style.minWidth = minWidth;
                    style.maxWidth = maxWidth;
                }
            }

            return ret;
        };
    } else if ( document.documentElement.currentStyle ) {
        getStyles = function( elem ) {
            return elem.currentStyle;
        };

        curCSS = function( elem, name, _computed ) {
            var left, rs, rsLeft,
                computed = _computed || getStyles( elem ),
                ret = computed ? computed[ name ] : undefined,
                style = elem.style;

            // Avoid setting ret to empty string here
            // so we don't default to auto
            if ( ret == null && style && style[ name ] ) {
                ret = style[ name ];
            }

            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            // but not position css attributes, as those are proportional to the parent element instead
            // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
            if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

                // Remember the original values
                left = style.left;
                rs = elem.runtimeStyle;
                rsLeft = rs && rs.left;

                // Put in the new values to get a computed value out
                if ( rsLeft ) {
                    rs.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : ret;
                ret = style.pixelLeft + "px";

                // Revert the changed values
                style.left = left;
                if ( rsLeft ) {
                    rs.left = rsLeft;
                }
            }

            return ret === "" ? "auto" : ret;
        };
    }

    function setPositiveNumber( elem, value, subtract ) {
        var matches = rnumsplit.exec( value );
        return matches ?
            // Guard against undefined "subtract", e.g., when used as in cssHooks
        Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
            value;
    }

    function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
        var i = extra === ( isBorderBox ? "border" : "content" ) ?
                // If we already have the right measurement, avoid augmentation
                4 :
                // Otherwise initialize for horizontal or vertical properties
                name === "width" ? 1 : 0,

            val = 0;

        for ( ; i < 4; i += 2 ) {
            // both box models exclude margin, so add it if we want it
            if ( extra === "margin" ) {
                val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
            }

            if ( isBorderBox ) {
                // border-box includes padding, so remove it if we want content
                if ( extra === "content" ) {
                    val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
                }

                // at this point, extra isn't border nor margin, so remove border
                if ( extra !== "margin" ) {
                    val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
                }
            } else {
                // at this point, extra isn't content, so add padding
                val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

                // at this point, extra isn't content nor padding, so add border
                if ( extra !== "padding" ) {
                    val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
                }
            }
        }

        return val;
    }

    function getWidthOrHeight( elem, name, extra ) {

        // Start with offset property, which is equivalent to the border-box value
        var valueIsBorderBox = true,
            val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
            styles = getStyles( elem ),
            isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

        // some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if ( val <= 0 || val == null ) {
            // Fall back to computed then uncomputed css if necessary
            val = curCSS( elem, name, styles );
            if ( val < 0 || val == null ) {
                val = elem.style[ name ];
            }

            // Computed unit is not pixels. Stop here and return.
            if ( rnumnonpx.test(val) ) {
                return val;
            }

            // we need the check for style in case a browser which returns unreliable values
            // for getComputedStyle silently falls back to the reliable elem.style
            valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

            // Normalize "", auto, and prepare for extra
            val = parseFloat( val ) || 0;
        }

        // use the active box-sizing model to add/subtract irrelevant styles
        return ( val +
            augmentWidthOrHeight(
                elem,
                name,
                extra || ( isBorderBox ? "border" : "content" ),
                valueIsBorderBox,
                styles
            )
            ) + "px";
    }

// Try to determine the default display value of an element
    function css_defaultDisplay( nodeName ) {
        var doc = document,
            display = elemdisplay[ nodeName ];

        if ( !display ) {
            display = actualDisplay( nodeName, doc );

            // If the simple way fails, read from inside an iframe
            if ( display === "none" || !display ) {
                // Use the already-created iframe if possible
                iframe = ( iframe ||
                jQuery("<iframe frameborder='0' width='0' height='0'/>")
                    .css( "cssText", "display:block !important" )
                ).appendTo( doc.documentElement );

                // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
                doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
                doc.write("<!doctype html><html><body>");
                doc.close();

                display = actualDisplay( nodeName, doc );
                iframe.detach();
            }

            // Store the correct default display
            elemdisplay[ nodeName ] = display;
        }

        return display;
    }

// Called ONLY from within css_defaultDisplay
    function actualDisplay( name, doc ) {
        var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
            display = jQuery.css( elem[0], "display" );
        elem.remove();
        return display;
    }

    jQuery.each([ "height", "width" ], function( i, name ) {
        jQuery.cssHooks[ name ] = {
            get: function( elem, computed, extra ) {
                if ( computed ) {
                    // certain elements can have dimension info if we invisibly show them
                    // however, it must have a current display style that would benefit from this
                    return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
                        jQuery.swap( elem, cssShow, function() {
                            return getWidthOrHeight( elem, name, extra );
                        }) :
                        getWidthOrHeight( elem, name, extra );
                }
            },

            set: function( elem, value, extra ) {
                var styles = extra && getStyles( elem );
                return setPositiveNumber( elem, value, extra ?
                        augmentWidthOrHeight(
                            elem,
                            name,
                            extra,
                            jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
                            styles
                        ) : 0
                );
            }
        };
    });

    if ( !jQuery.support.opacity ) {
        jQuery.cssHooks.opacity = {
            get: function( elem, computed ) {
                // IE uses filters for opacity
                return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
                ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
                    computed ? "1" : "";
            },

            set: function( elem, value ) {
                var style = elem.style,
                    currentStyle = elem.currentStyle,
                    opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
                    filter = currentStyle && currentStyle.filter || style.filter || "";

                // IE has trouble with opacity if it does not have layout
                // Force it by setting the zoom level
                style.zoom = 1;

                // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
                // if value === "", then remove inline opacity #12685
                if ( ( value >= 1 || value === "" ) &&
                    jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
                    style.removeAttribute ) {

                    // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
                    // if "filter:" is present at all, clearType is disabled, we want to avoid this
                    // style.removeAttribute is IE Only, but so apparently is this code path...
                    style.removeAttribute( "filter" );

                    // if there is no filter style applied in a css rule or unset inline opacity, we are done
                    if ( value === "" || currentStyle && !currentStyle.filter ) {
                        return;
                    }
                }

                // otherwise, set new filter values
                style.filter = ralpha.test( filter ) ?
                    filter.replace( ralpha, opacity ) :
                filter + " " + opacity;
            }
        };
    }

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
    jQuery(function() {
        if ( !jQuery.support.reliableMarginRight ) {
            jQuery.cssHooks.marginRight = {
                get: function( elem, computed ) {
                    if ( computed ) {
                        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                        // Work around by temporarily setting element display to inline-block
                        return jQuery.swap( elem, { "display": "inline-block" },
                            curCSS, [ elem, "marginRight" ] );
                    }
                }
            };
        }

        // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
        // getComputedStyle returns percent when specified for top/left/bottom/right
        // rather than make the css module depend on the offset module, we just check for it here
        if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
            jQuery.each( [ "top", "left" ], function( i, prop ) {
                jQuery.cssHooks[ prop ] = {
                    get: function( elem, computed ) {
                        if ( computed ) {
                            computed = curCSS( elem, prop );
                            // if curCSS returns percentage, fallback to offset
                            return rnumnonpx.test( computed ) ?
                            jQuery( elem ).position()[ prop ] + "px" :
                                computed;
                        }
                    }
                };
            });
        }

    });

    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.hidden = function( elem ) {
            // Support: Opera <= 12.12
            // Opera reports offsetWidths and offsetHeights less than zero on some elements
            return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
                (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
        };

        jQuery.expr.filters.visible = function( elem ) {
            return !jQuery.expr.filters.hidden( elem );
        };
    }

// These hooks are used by animate to expand properties
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function( prefix, suffix ) {
        jQuery.cssHooks[ prefix + suffix ] = {
            expand: function( value ) {
                var i = 0,
                    expanded = {},

                // assumes a single number if not a string
                    parts = typeof value === "string" ? value.split(" ") : [ value ];

                for ( ; i < 4; i++ ) {
                    expanded[ prefix + cssExpand[ i ] + suffix ] =
                        parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
                }

                return expanded;
            }
        };

        if ( !rmargin.test( prefix ) ) {
            jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
        }
    });
    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i;

    jQuery.fn.extend({
        serialize: function() {
            return jQuery.param( this.serializeArray() );
        },
        serializeArray: function() {
            return this.map(function(){
                // Can add propHook for "elements" to filter or add form elements
                var elements = jQuery.prop( this, "elements" );
                return elements ? jQuery.makeArray( elements ) : this;
            })
                .filter(function(){
                    var type = this.type;
                    // Use .is(":disabled") so that fieldset[disabled] works
                    return this.name && !jQuery( this ).is( ":disabled" ) &&
                        rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
                        ( this.checked || !manipulation_rcheckableType.test( type ) );
                })
                .map(function( i, elem ){
                    var val = jQuery( this ).val();

                    return val == null ?
                        null :
                        jQuery.isArray( val ) ?
                            jQuery.map( val, function( val ){
                                return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                            }) :
                        { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                }).get();
        }
    });

//Serialize an array of form elements or a set of
//key/values into a query string
    jQuery.param = function( a, traditional ) {
        var prefix,
            s = [],
            add = function( key, value ) {
                // If value is a function, invoke it and return its value
                value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
                s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
            };

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if ( traditional === undefined ) {
            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
            // Serialize the form elements
            jQuery.each( a, function() {
                add( this.name, this.value );
            });

        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for ( prefix in a ) {
                buildParams( prefix, a[ prefix ], traditional, add );
            }
        }

        // Return the resulting serialization
        return s.join( "&" ).replace( r20, "+" );
    };

    function buildParams( prefix, obj, traditional, add ) {
        var name;

        if ( jQuery.isArray( obj ) ) {
            // Serialize array item.
            jQuery.each( obj, function( i, v ) {
                if ( traditional || rbracket.test( prefix ) ) {
                    // Treat each array item as a scalar.
                    add( prefix, v );

                } else {
                    // Item is non-scalar (array or object), encode its numeric index.
                    buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
                }
            });

        } else if ( !traditional && jQuery.type( obj ) === "object" ) {
            // Serialize object item.
            for ( name in obj ) {
                buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
            }

        } else {
            // Serialize scalar item.
            add( prefix, obj );
        }
    }
    jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

        // Handle event binding
        jQuery.fn[ name ] = function( data, fn ) {
            return arguments.length > 0 ?
                this.on( name, null, data, fn ) :
                this.trigger( name );
        };
    });

    jQuery.fn.hover = function( fnOver, fnOut ) {
        return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    };
    var
    // Document location
        ajaxLocParts,
        ajaxLocation,
        ajax_nonce = jQuery.now(),

        ajax_rquery = /\?/,
        rhash = /#.*$/,
        rts = /([?&])_=[^&]*/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
    // #7653, #8125, #8152: local protocol detection
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,
        rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

    // Keep a copy of the old load method
        _load = jQuery.fn.load,

    /* Prefilters
     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
     * 2) These are called:
     *    - BEFORE asking for a transport
     *    - AFTER param serialization (s.data is a string if s.processData is true)
     * 3) key is the dataType
     * 4) the catchall symbol "*" can be used
     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
     */
        prefilters = {},

    /* Transports bindings
     * 1) key is the dataType
     * 2) the catchall symbol "*" can be used
     * 3) selection will start with transport dataType and THEN go to "*" if needed
     */
        transports = {},

    // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
        allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
    try {
        ajaxLocation = location.href;
    } catch( e ) {
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        ajaxLocation = document.createElement( "a" );
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }

// Segment location into parts
    ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports( structure ) {

        // dataTypeExpression is optional and defaults to "*"
        return function( dataTypeExpression, func ) {

            if ( typeof dataTypeExpression !== "string" ) {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            var dataType,
                i = 0,
                dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

            if ( jQuery.isFunction( func ) ) {
                // For each dataType in the dataTypeExpression
                while ( (dataType = dataTypes[i++]) ) {
                    // Prepend if requested
                    if ( dataType[0] === "+" ) {
                        dataType = dataType.slice( 1 ) || "*";
                        (structure[ dataType ] = structure[ dataType ] || []).unshift( func );

                        // Otherwise append
                    } else {
                        (structure[ dataType ] = structure[ dataType ] || []).push( func );
                    }
                }
            }
        };
    }

// Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

        var inspected = {},
            seekingTransport = ( structure === transports );

        function inspect( dataType ) {
            var selected;
            inspected[ dataType ] = true;
            jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
                var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
                if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
                    options.dataTypes.unshift( dataTypeOrTransport );
                    inspect( dataTypeOrTransport );
                    return false;
                } else if ( seekingTransport ) {
                    return !( selected = dataTypeOrTransport );
                }
            });
            return selected;
        }

        return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
    }

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
    function ajaxExtend( target, src ) {
        var deep, key,
            flatOptions = jQuery.ajaxSettings.flatOptions || {};

        for ( key in src ) {
            if ( src[ key ] !== undefined ) {
                ( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
            }
        }
        if ( deep ) {
            jQuery.extend( true, target, deep );
        }

        return target;
    }

    jQuery.fn.load = function( url, params, callback ) {
        if ( typeof url !== "string" && _load ) {
            return _load.apply( this, arguments );
        }

        var selector, response, type,
            self = this,
            off = url.indexOf(" ");

        if ( off >= 0 ) {
            selector = url.slice( off, url.length );
            url = url.slice( 0, off );
        }

        // If it's a function
        if ( jQuery.isFunction( params ) ) {

            // We assume that it's the callback
            callback = params;
            params = undefined;

            // Otherwise, build a param string
        } else if ( params && typeof params === "object" ) {
            type = "POST";
        }

        // If we have elements to modify, make the request
        if ( self.length > 0 ) {
            jQuery.ajax({
                url: url,

                // if "type" variable is undefined, then "GET" method will be used
                type: type,
                dataType: "html",
                data: params
            }).done(function( responseText ) {

                // Save response for use in complete callback
                response = arguments;

                self.html( selector ?

                    // If a selector was specified, locate the right elements in a dummy div
                    // Exclude scripts to avoid IE 'Permission Denied' errors
                    jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

                    // Otherwise use the full result
                    responseText );

            }).complete( callback && function( jqXHR, status ) {
                self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
            });
        }

        return this;
    };

// Attach a bunch of functions for handling common AJAX events
    jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
        jQuery.fn[ type ] = function( fn ){
            return this.on( type, fn );
        };
    });

    jQuery.each( [ "get", "post" ], function( i, method ) {
        jQuery[ method ] = function( url, data, callback, type ) {
            // shift arguments if data argument was omitted
            if ( jQuery.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });

    jQuery.extend({

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},

        ajaxSettings: {
            url: ajaxLocation,
            type: "GET",
            isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            /*
             timeout: 0,
             data: null,
             dataType: null,
             username: null,
             password: null,
             cache: null,
             throws: false,
             traditional: false,
             headers: {},
             */

            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },

            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },

            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },

            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {

                // Convert anything to text
                "* text": window.String,

                // Text to html (true = no transformation)
                "text html": true,

                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,

                // Parse text as xml
                "text xml": jQuery.parseXML
            },

            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                url: true,
                context: true
            }
        },

        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function( target, settings ) {
            return settings ?

                // Building a settings object
                ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

                // Extending ajaxSettings
                ajaxExtend( jQuery.ajaxSettings, target );
        },

        ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
        ajaxTransport: addToPrefiltersOrTransports( transports ),

        // Main method
        ajax: function( url, options ) {

            // If url is an object, simulate pre-1.5 signature
            if ( typeof url === "object" ) {
                options = url;
                url = undefined;
            }

            // Force options to be an object
            options = options || {};

            var // Cross-domain detection vars
                parts,
            // Loop variable
                i,
            // URL without anti-cache param
                cacheURL,
            // Response headers as string
                responseHeadersString,
            // timeout handle
                timeoutTimer,

            // To know if global events are to be dispatched
                fireGlobals,

                transport,
            // Response headers
                responseHeaders,
            // Create the final options object
                s = jQuery.ajaxSetup( {}, options ),
            // Callbacks context
                callbackContext = s.context || s,
            // Context for global events is callbackContext if it is a DOM node or jQuery collection
                globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
                    jQuery( callbackContext ) :
                    jQuery.event,
            // Deferreds
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery.Callbacks("once memory"),
            // Status-dependent callbacks
                statusCode = s.statusCode || {},
            // Headers (they are sent all at once)
                requestHeaders = {},
                requestHeadersNames = {},
            // The jqXHR state
                state = 0,
            // Default abort message
                strAbort = "canceled",
            // Fake xhr
                jqXHR = {
                    readyState: 0,

                    // Builds headers hashtable if needed
                    getResponseHeader: function( key ) {
                        var match;
                        if ( state === 2 ) {
                            if ( !responseHeaders ) {
                                responseHeaders = {};
                                while ( (match = rheaders.exec( responseHeadersString )) ) {
                                    responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                                }
                            }
                            match = responseHeaders[ key.toLowerCase() ];
                        }
                        return match == null ? null : match;
                    },

                    // Raw string
                    getAllResponseHeaders: function() {
                        return state === 2 ? responseHeadersString : null;
                    },

                    // Caches the header
                    setRequestHeader: function( name, value ) {
                        var lname = name.toLowerCase();
                        if ( !state ) {
                            name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                            requestHeaders[ name ] = value;
                        }
                        return this;
                    },

                    // Overrides response content-type header
                    overrideMimeType: function( type ) {
                        if ( !state ) {
                            s.mimeType = type;
                        }
                        return this;
                    },

                    // Status-dependent callbacks
                    statusCode: function( map ) {
                        var code;
                        if ( map ) {
                            if ( state < 2 ) {
                                for ( code in map ) {
                                    // Lazy-add the new callback in a way that preserves old ones
                                    statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
                                }
                            } else {
                                // Execute the appropriate callbacks
                                jqXHR.always( map[ jqXHR.status ] );
                            }
                        }
                        return this;
                    },

                    // Cancel the request
                    abort: function( statusText ) {
                        var finalText = statusText || strAbort;
                        if ( transport ) {
                            transport.abort( finalText );
                        }
                        done( 0, finalText );
                        return this;
                    }
                };

            // Attach deferreds
            deferred.promise( jqXHR ).complete = completeDeferred.add;
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;

            // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
            // Handle falsy url in the settings object (#10093: consistency with old signature)
            // We also use the url parameter if available
            s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

            // Alias method option to type as per ticket #12004
            s.type = options.method || options.type || s.method || s.type;

            // Extract dataTypes list
            s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

            // A cross-domain request is in order when we have a protocol:host:port mismatch
            if ( s.crossDomain == null ) {
                parts = rurl.exec( s.url.toLowerCase() );
                s.crossDomain = !!( parts &&
                ( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
                ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
                ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
                );
            }

            // Convert data if not already a string
            if ( s.data && s.processData && typeof s.data !== "string" ) {
                s.data = jQuery.param( s.data, s.traditional );
            }

            // Apply prefilters
            inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

            // If request was aborted inside a prefilter, stop there
            if ( state === 2 ) {
                return jqXHR;
            }

            // We can fire global events as of now if asked to
            fireGlobals = s.global;

            // Watch for a new set of requests
            if ( fireGlobals && jQuery.active++ === 0 ) {
                jQuery.event.trigger("ajaxStart");
            }

            // Uppercase the type
            s.type = s.type.toUpperCase();

            // Determine if request has content
            s.hasContent = !rnoContent.test( s.type );

            // Save the URL in case we're toying with the If-Modified-Since
            // and/or If-None-Match header later on
            cacheURL = s.url;

            // More options handling for requests with no content
            if ( !s.hasContent ) {

                // If data is available, append data to url
                if ( s.data ) {
                    cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
                    // #9682: remove data so that it's not used in an eventual retry
                    delete s.data;
                }

                // Add anti-cache in url if needed
                if ( s.cache === false ) {
                    s.url = rts.test( cacheURL ) ?

                        // If there is already a '_' parameter, set its value
                        cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

                        // Otherwise add one to the end
                    cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
                }
            }

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if ( s.ifModified ) {
                if ( jQuery.lastModified[ cacheURL ] ) {
                    jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
                }
                if ( jQuery.etag[ cacheURL ] ) {
                    jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
                }
            }

            // Set the correct header, if data is being sent
            if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
                jqXHR.setRequestHeader( "Content-Type", s.contentType );
            }

            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader(
                "Accept",
                s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                    s.accepts[ "*" ]
            );

            // Check for headers option
            for ( i in s.headers ) {
                jqXHR.setRequestHeader( i, s.headers[ i ] );
            }

            // Allow custom headers/mimetypes and early abort
            if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
                // Abort if not done already and return
                return jqXHR.abort();
            }

            // aborting is no longer a cancellation
            strAbort = "abort";

            // Install callbacks on deferreds
            for ( i in { success: 1, error: 1, complete: 1 } ) {
                jqXHR[ i ]( s[ i ] );
            }

            // Get transport
            transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

            // If no transport, we auto-abort
            if ( !transport ) {
                done( -1, "No Transport" );
            } else {
                jqXHR.readyState = 1;

                // Send global event
                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
                }
                // Timeout
                if ( s.async && s.timeout > 0 ) {
                    timeoutTimer = setTimeout(function() {
                        jqXHR.abort("timeout");
                    }, s.timeout );
                }

                try {
                    state = 1;
                    transport.send( requestHeaders, done );
                } catch ( e ) {
                    // Propagate exception as error if not done
                    if ( state < 2 ) {
                        done( -1, e );
                        // Simply rethrow otherwise
                    } else {
                        throw e;
                    }
                }
            }

            // Callback for when everything is done
            function done( status, nativeStatusText, responses, headers ) {
                var isSuccess, success, error, response, modified,
                    statusText = nativeStatusText;

                // Called once
                if ( state === 2 ) {
                    return;
                }

                // State is "done" now
                state = 2;

                // Clear timeout if it exists
                if ( timeoutTimer ) {
                    clearTimeout( timeoutTimer );
                }

                // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined;

                // Cache response headers
                responseHeadersString = headers || "";

                // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0;

                // Get response data
                if ( responses ) {
                    response = ajaxHandleResponses( s, jqXHR, responses );
                }

                // If successful, handle type chaining
                if ( status >= 200 && status < 300 || status === 304 ) {

                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if ( s.ifModified ) {
                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if ( modified ) {
                            jQuery.lastModified[ cacheURL ] = modified;
                        }
                        modified = jqXHR.getResponseHeader("etag");
                        if ( modified ) {
                            jQuery.etag[ cacheURL ] = modified;
                        }
                    }

                    // if no content
                    if ( status === 204 ) {
                        isSuccess = true;
                        statusText = "nocontent";

                        // if not modified
                    } else if ( status === 304 ) {
                        isSuccess = true;
                        statusText = "notmodified";

                        // If we have data, let's convert it
                    } else {
                        isSuccess = ajaxConvert( s, response );
                        statusText = isSuccess.state;
                        success = isSuccess.data;
                        error = isSuccess.error;
                        isSuccess = !error;
                    }
                } else {
                    // We extract error from statusText
                    // then normalize statusText and status for non-aborts
                    error = statusText;
                    if ( status || !statusText ) {
                        statusText = "error";
                        if ( status < 0 ) {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = ( nativeStatusText || statusText ) + "";

                // Success/Error
                if ( isSuccess ) {
                    deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
                } else {
                    deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
                }

                // Status-dependent callbacks
                jqXHR.statusCode( statusCode );
                statusCode = undefined;

                if ( fireGlobals ) {
                    globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
                        [ jqXHR, s, isSuccess ? success : error ] );
                }

                // Complete
                completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
                    // Handle the global AJAX counter
                    if ( !( --jQuery.active ) ) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }

            return jqXHR;
        },

        getScript: function( url, callback ) {
            return jQuery.get( url, undefined, callback, "script" );
        },

        getJSON: function( url, data, callback ) {
            return jQuery.get( url, data, callback, "json" );
        }
    });

    /* Handles responses to an ajax request:
     * - sets all responseXXX fields accordingly
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses( s, jqXHR, responses ) {
        var firstDataType, ct, finalDataType, type,
            contents = s.contents,
            dataTypes = s.dataTypes,
            responseFields = s.responseFields;

        // Fill responseXXX fields
        for ( type in responseFields ) {
            if ( type in responses ) {
                jqXHR[ responseFields[type] ] = responses[ type ];
            }
        }

        // Remove auto dataType and get content-type in the process
        while( dataTypes[ 0 ] === "*" ) {
            dataTypes.shift();
            if ( ct === undefined ) {
                ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
        }

        // Check if we're dealing with a known content-type
        if ( ct ) {
            for ( type in contents ) {
                if ( contents[ type ] && contents[ type ].test( ct ) ) {
                    dataTypes.unshift( type );
                    break;
                }
            }
        }

        // Check to see if we have a response for the expected dataType
        if ( dataTypes[ 0 ] in responses ) {
            finalDataType = dataTypes[ 0 ];
        } else {
            // Try convertible dataTypes
            for ( type in responses ) {
                if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
                    finalDataType = type;
                    break;
                }
                if ( !firstDataType ) {
                    firstDataType = type;
                }
            }
            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if ( finalDataType ) {
            if ( finalDataType !== dataTypes[ 0 ] ) {
                dataTypes.unshift( finalDataType );
            }
            return responses[ finalDataType ];
        }
    }

// Chain conversions given the request and the original response
    function ajaxConvert( s, response ) {
        var conv2, current, conv, tmp,
            converters = {},
            i = 0,
        // Work with a copy of dataTypes in case we need to modify it for conversion
            dataTypes = s.dataTypes.slice(),
            prev = dataTypes[ 0 ];

        // Apply the dataFilter if provided
        if ( s.dataFilter ) {
            response = s.dataFilter( response, s.dataType );
        }

        // Create converters map with lowercased keys
        if ( dataTypes[ 1 ] ) {
            for ( conv in s.converters ) {
                converters[ conv.toLowerCase() ] = s.converters[ conv ];
            }
        }

        // Convert to each sequential dataType, tolerating list modification
        for ( ; (current = dataTypes[++i]); ) {

            // There's only work to do if current dataType is non-auto
            if ( current !== "*" ) {

                // Convert response if prev dataType is non-auto and differs from current
                if ( prev !== "*" && prev !== current ) {

                    // Seek a direct converter
                    conv = converters[ prev + " " + current ] || converters[ "* " + current ];

                    // If none found, seek a pair
                    if ( !conv ) {
                        for ( conv2 in converters ) {

                            // If conv2 outputs current
                            tmp = conv2.split(" ");
                            if ( tmp[ 1 ] === current ) {

                                // If prev can be converted to accepted input
                                conv = converters[ prev + " " + tmp[ 0 ] ] ||
                                converters[ "* " + tmp[ 0 ] ];
                                if ( conv ) {
                                    // Condense equivalence converters
                                    if ( conv === true ) {
                                        conv = converters[ conv2 ];

                                        // Otherwise, insert the intermediate dataType
                                    } else if ( converters[ conv2 ] !== true ) {
                                        current = tmp[ 0 ];
                                        dataTypes.splice( i--, 0, current );
                                    }

                                    break;
                                }
                            }
                        }
                    }

                    // Apply converter (if not an equivalence)
                    if ( conv !== true ) {

                        // Unless errors are allowed to bubble, catch and return them
                        if ( conv && s["throws"] ) {
                            response = conv( response );
                        } else {
                            try {
                                response = conv( response );
                            } catch ( e ) {
                                return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
                            }
                        }
                    }
                }

                // Update prev for next iteration
                prev = current;
            }
        }

        return { state: "success", data: response };
    }
// Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function( text ) {
                jQuery.globalEval( text );
                return text;
            }
        }
    });

// Handle cache's special case and global
    jQuery.ajaxPrefilter( "script", function( s ) {
        if ( s.cache === undefined ) {
            s.cache = false;
        }
        if ( s.crossDomain ) {
            s.type = "GET";
            s.global = false;
        }
    });

// Bind script tag hack transport
    jQuery.ajaxTransport( "script", function(s) {

        // This transport only deals with cross domain requests
        if ( s.crossDomain ) {

            var script,
                head = document.head || jQuery("head")[0] || document.documentElement;

            return {

                send: function( _, callback ) {

                    script = document.createElement("script");

                    script.async = true;

                    if ( s.scriptCharset ) {
                        script.charset = s.scriptCharset;
                    }

                    script.src = s.url;

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function( _, isAbort ) {

                        if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;

                            // Remove the script
                            if ( script.parentNode ) {
                                script.parentNode.removeChild( script );
                            }

                            // Dereference the script
                            script = null;

                            // Callback if not abort
                            if ( !isAbort ) {
                                callback( 200, "success" );
                            }
                        }
                    };

                    // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
                    // Use native DOM manipulation to avoid our domManip AJAX trickery
                    head.insertBefore( script, head.firstChild );
                },

                abort: function() {
                    if ( script ) {
                        script.onload( undefined, true );
                    }
                }
            };
        }
    });
    var oldCallbacks = [],
        rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
            this[ callback ] = true;
            return callback;
        }
    });

// Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

        var callbackName, overwritten, responseContainer,
            jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
                    "url" :
                typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
                );

        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

            // Get callback name, remembering preexisting value associated with it
            callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
                s.jsonpCallback() :
                s.jsonpCallback;

            // Insert callback into url or form data
            if ( jsonProp ) {
                s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
            } else if ( s.jsonp !== false ) {
                s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
            }

            // Use data converter to retrieve json after script execution
            s.converters["script json"] = function() {
                if ( !responseContainer ) {
                    jQuery.error( callbackName + " was not called" );
                }
                return responseContainer[ 0 ];
            };

            // force json dataType
            s.dataTypes[ 0 ] = "json";

            // Install callback
            overwritten = window[ callbackName ];
            window[ callbackName ] = function() {
                responseContainer = arguments;
            };

            // Clean-up function (fires after converters)
            jqXHR.always(function() {
                // Restore preexisting value
                window[ callbackName ] = overwritten;

                // Save back as free
                if ( s[ callbackName ] ) {
                    // make sure that re-using the options doesn't screw things around
                    s.jsonpCallback = originalSettings.jsonpCallback;

                    // save the callback name for future use
                    oldCallbacks.push( callbackName );
                }

                // Call if it was a function and we have a response
                if ( responseContainer && jQuery.isFunction( overwritten ) ) {
                    overwritten( responseContainer[ 0 ] );
                }

                responseContainer = overwritten = undefined;
            });

            // Delegate to script
            return "script";
        }
    });
    var xhrCallbacks, xhrSupported,
        xhrId = 0,
    // #5280: Internet Explorer will keep connections alive if we don't abort on unload
        xhrOnUnloadAbort = window.ActiveXObject && function() {
                // Abort all pending requests
                var key;
                for ( key in xhrCallbacks ) {
                    xhrCallbacks[ key ]( undefined, true );
                }
            };

// Functions to create xhrs
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch( e ) {}
    }

    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch( e ) {}
    }

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
    jQuery.ajaxSettings.xhr = window.ActiveXObject ?
        /* Microsoft failed to properly
         * implement the XMLHttpRequest in IE7 (can't request local files),
         * so we use the ActiveXObject when it is available
         * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
         * we need a fallback.
         */
        function() {
            return !this.isLocal && createStandardXHR() || createActiveXHR();
        } :
        // For all other browsers, use the standard XMLHttpRequest object
        createStandardXHR;

// Determine support properties
    xhrSupported = jQuery.ajaxSettings.xhr();
    jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
    xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
    if ( xhrSupported ) {

        jQuery.ajaxTransport(function( s ) {
            // Cross domain only allowed if supported through XMLHttpRequest
            if ( !s.crossDomain || jQuery.support.cors ) {

                var callback;

                return {
                    send: function( headers, complete ) {

                        // Get a new xhr
                        var handle, i,
                            xhr = s.xhr();

                        // Open the socket
                        // Passing null username, generates a login popup on Opera (#2865)
                        if ( s.username ) {
                            xhr.open( s.type, s.url, s.async, s.username, s.password );
                        } else {
                            xhr.open( s.type, s.url, s.async );
                        }

                        // Apply custom fields if provided
                        if ( s.xhrFields ) {
                            for ( i in s.xhrFields ) {
                                xhr[ i ] = s.xhrFields[ i ];
                            }
                        }

                        // Override mime type if needed
                        if ( s.mimeType && xhr.overrideMimeType ) {
                            xhr.overrideMimeType( s.mimeType );
                        }

                        // X-Requested-With header
                        // For cross-domain requests, seeing as conditions for a preflight are
                        // akin to a jigsaw puzzle, we simply never set it to be sure.
                        // (it can always be set on a per-request basis or even using ajaxSetup)
                        // For same-domain requests, won't change header if already provided.
                        if ( !s.crossDomain && !headers["X-Requested-With"] ) {
                            headers["X-Requested-With"] = "XMLHttpRequest";
                        }

                        // Need an extra try/catch for cross domain requests in Firefox 3
                        try {
                            for ( i in headers ) {
                                xhr.setRequestHeader( i, headers[ i ] );
                            }
                        } catch( err ) {}

                        // Do send the request
                        // This may raise an exception which is actually
                        // handled in jQuery.ajax (so no try/catch here)
                        xhr.send( ( s.hasContent && s.data ) || null );

                        // Listener
                        callback = function( _, isAbort ) {
                            var status, responseHeaders, statusText, responses;

                            // Firefox throws exceptions when accessing properties
                            // of an xhr when a network error occurred
                            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                            try {

                                // Was never called and is aborted or complete
                                if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                                    // Only called once
                                    callback = undefined;

                                    // Do not keep as active anymore
                                    if ( handle ) {
                                        xhr.onreadystatechange = jQuery.noop;
                                        if ( xhrOnUnloadAbort ) {
                                            delete xhrCallbacks[ handle ];
                                        }
                                    }

                                    // If it's an abort
                                    if ( isAbort ) {
                                        // Abort it manually if needed
                                        if ( xhr.readyState !== 4 ) {
                                            xhr.abort();
                                        }
                                    } else {
                                        responses = {};
                                        status = xhr.status;
                                        responseHeaders = xhr.getAllResponseHeaders();

                                        // When requesting binary data, IE6-9 will throw an exception
                                        // on any attempt to access responseText (#11426)
                                        if ( typeof xhr.responseText === "string" ) {
                                            responses.text = xhr.responseText;
                                        }

                                        // Firefox throws an exception when accessing
                                        // statusText for faulty cross-domain requests
                                        try {
                                            statusText = xhr.statusText;
                                        } catch( e ) {
                                            // We normalize with Webkit giving an empty statusText
                                            statusText = "";
                                        }

                                        // Filter status for non standard behaviors

                                        // If the request is local and we have data: assume a success
                                        // (success with no data won't get notified, that's the best we
                                        // can do given current implementations)
                                        if ( !status && s.isLocal && !s.crossDomain ) {
                                            status = responses.text ? 200 : 404;
                                            // IE - #1450: sometimes returns 1223 when it should be 204
                                        } else if ( status === 1223 ) {
                                            status = 204;
                                        }
                                    }
                                }
                            } catch( firefoxAccessException ) {
                                if ( !isAbort ) {
                                    complete( -1, firefoxAccessException );
                                }
                            }

                            // Call complete if needed
                            if ( responses ) {
                                complete( status, statusText, responses, responseHeaders );
                            }
                        };

                        if ( !s.async ) {
                            // if we're in sync mode we fire the callback
                            callback();
                        } else if ( xhr.readyState === 4 ) {
                            // (IE6 & IE7) if it's in cache and has been
                            // retrieved directly we need to fire the callback
                            setTimeout( callback );
                        } else {
                            handle = ++xhrId;
                            if ( xhrOnUnloadAbort ) {
                                // Create the active xhrs callbacks list if needed
                                // and attach the unload handler
                                if ( !xhrCallbacks ) {
                                    xhrCallbacks = {};
                                    jQuery( window ).unload( xhrOnUnloadAbort );
                                }
                                // Add to list of active xhrs callbacks
                                xhrCallbacks[ handle ] = callback;
                            }
                            xhr.onreadystatechange = callback;
                        }
                    },

                    abort: function() {
                        if ( callback ) {
                            callback( undefined, true );
                        }
                    }
                };
            }
        });
    }
    var fxNow, timerId,
        rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
        rrun = /queueHooks$/,
        animationPrefilters = [ defaultPrefilter ],
        tweeners = {
            "*": [function( prop, value ) {
                var end, unit,
                    tween = this.createTween( prop, value ),
                    parts = rfxnum.exec( value ),
                    target = tween.cur(),
                    start = +target || 0,
                    scale = 1,
                    maxIterations = 20;

                if ( parts ) {
                    end = +parts[2];
                    unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

                    // We need to compute starting value
                    if ( unit !== "px" && start ) {
                        // Iteratively approximate from a nonzero starting point
                        // Prefer the current property, because this process will be trivial if it uses the same units
                        // Fallback to end or a simple constant
                        start = jQuery.css( tween.elem, prop, true ) || end || 1;

                        do {
                            // If previous iteration zeroed out, double until we get *something*
                            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
                            scale = scale || ".5";

                            // Adjust and apply
                            start = start / scale;
                            jQuery.style( tween.elem, prop, start + unit );

                            // Update scale, tolerating zero or NaN from tween.cur()
                            // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
                        } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
                    }

                    tween.unit = unit;
                    tween.start = start;
                    // If a +=/-= token was provided, we're doing a relative animation
                    tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
                }
                return tween;
            }]
        };

// Animations created synchronously will run synchronously
    function createFxNow() {
        setTimeout(function() {
            fxNow = undefined;
        });
        return ( fxNow = jQuery.now() );
    }

    function createTweens( animation, props ) {
        jQuery.each( props, function( prop, value ) {
            var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
                index = 0,
                length = collection.length;
            for ( ; index < length; index++ ) {
                if ( collection[ index ].call( animation, prop, value ) ) {

                    // we're done with this property
                    return;
                }
            }
        });
    }

    function Animation( elem, properties, options ) {
        var result,
            stopped,
            index = 0,
            length = animationPrefilters.length,
            deferred = jQuery.Deferred().always( function() {
                // don't match elem in the :animated selector
                delete tick.elem;
            }),
            tick = function() {
                if ( stopped ) {
                    return false;
                }
                var currentTime = fxNow || createFxNow(),
                    remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
                // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
                    temp = remaining / animation.duration || 0,
                    percent = 1 - temp,
                    index = 0,
                    length = animation.tweens.length;

                for ( ; index < length ; index++ ) {
                    animation.tweens[ index ].run( percent );
                }

                deferred.notifyWith( elem, [ animation, percent, remaining ]);

                if ( percent < 1 && length ) {
                    return remaining;
                } else {
                    deferred.resolveWith( elem, [ animation ] );
                    return false;
                }
            },
            animation = deferred.promise({
                elem: elem,
                props: jQuery.extend( {}, properties ),
                opts: jQuery.extend( true, { specialEasing: {} }, options ),
                originalProperties: properties,
                originalOptions: options,
                startTime: fxNow || createFxNow(),
                duration: options.duration,
                tweens: [],
                createTween: function( prop, end ) {
                    var tween = jQuery.Tween( elem, animation.opts, prop, end,
                        animation.opts.specialEasing[ prop ] || animation.opts.easing );
                    animation.tweens.push( tween );
                    return tween;
                },
                stop: function( gotoEnd ) {
                    var index = 0,
                    // if we are going to the end, we want to run all the tweens
                    // otherwise we skip this part
                        length = gotoEnd ? animation.tweens.length : 0;
                    if ( stopped ) {
                        return this;
                    }
                    stopped = true;
                    for ( ; index < length ; index++ ) {
                        animation.tweens[ index ].run( 1 );
                    }

                    // resolve when we played the last frame
                    // otherwise, reject
                    if ( gotoEnd ) {
                        deferred.resolveWith( elem, [ animation, gotoEnd ] );
                    } else {
                        deferred.rejectWith( elem, [ animation, gotoEnd ] );
                    }
                    return this;
                }
            }),
            props = animation.props;

        propFilter( props, animation.opts.specialEasing );

        for ( ; index < length ; index++ ) {
            result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
            if ( result ) {
                return result;
            }
        }

        createTweens( animation, props );

        if ( jQuery.isFunction( animation.opts.start ) ) {
            animation.opts.start.call( elem, animation );
        }

        jQuery.fx.timer(
            jQuery.extend( tick, {
                elem: elem,
                anim: animation,
                queue: animation.opts.queue
            })
        );

        // attach callbacks from options
        return animation.progress( animation.opts.progress )
            .done( animation.opts.done, animation.opts.complete )
            .fail( animation.opts.fail )
            .always( animation.opts.always );
    }

    function propFilter( props, specialEasing ) {
        var value, name, index, easing, hooks;

        // camelCase, specialEasing and expand cssHook pass
        for ( index in props ) {
            name = jQuery.camelCase( index );
            easing = specialEasing[ name ];
            value = props[ index ];
            if ( jQuery.isArray( value ) ) {
                easing = value[ 1 ];
                value = props[ index ] = value[ 0 ];
            }

            if ( index !== name ) {
                props[ name ] = value;
                delete props[ index ];
            }

            hooks = jQuery.cssHooks[ name ];
            if ( hooks && "expand" in hooks ) {
                value = hooks.expand( value );
                delete props[ name ];

                // not quite $.extend, this wont overwrite keys already present.
                // also - reusing 'index' from above because we have the correct "name"
                for ( index in value ) {
                    if ( !( index in props ) ) {
                        props[ index ] = value[ index ];
                        specialEasing[ index ] = easing;
                    }
                }
            } else {
                specialEasing[ name ] = easing;
            }
        }
    }

    jQuery.Animation = jQuery.extend( Animation, {

        tweener: function( props, callback ) {
            if ( jQuery.isFunction( props ) ) {
                callback = props;
                props = [ "*" ];
            } else {
                props = props.split(" ");
            }

            var prop,
                index = 0,
                length = props.length;

            for ( ; index < length ; index++ ) {
                prop = props[ index ];
                tweeners[ prop ] = tweeners[ prop ] || [];
                tweeners[ prop ].unshift( callback );
            }
        },

        prefilter: function( callback, prepend ) {
            if ( prepend ) {
                animationPrefilters.unshift( callback );
            } else {
                animationPrefilters.push( callback );
            }
        }
    });

    function defaultPrefilter( elem, props, opts ) {
        /*jshint validthis:true */
        var prop, index, length,
            value, dataShow, toggle,
            tween, hooks, oldfire,
            anim = this,
            style = elem.style,
            orig = {},
            handled = [],
            hidden = elem.nodeType && isHidden( elem );

        // handle queue: false promises
        if ( !opts.queue ) {
            hooks = jQuery._queueHooks( elem, "fx" );
            if ( hooks.unqueued == null ) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function() {
                    if ( !hooks.unqueued ) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;

            anim.always(function() {
                // doing this makes sure that the complete handler will be called
                // before this completes
                anim.always(function() {
                    hooks.unqueued--;
                    if ( !jQuery.queue( elem, "fx" ).length ) {
                        hooks.empty.fire();
                    }
                });
            });
        }

        // height/width overflow pass
        if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
            // Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE does not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

            // Set display property to inline-block for height/width
            // animations on inline elements that are having width/height animated
            if ( jQuery.css( elem, "display" ) === "inline" &&
                jQuery.css( elem, "float" ) === "none" ) {

                // inline-level elements accept inline-block;
                // block-level elements need to be inline with layout
                if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
                    style.display = "inline-block";

                } else {
                    style.zoom = 1;
                }
            }
        }

        if ( opts.overflow ) {
            style.overflow = "hidden";
            if ( !jQuery.support.shrinkWrapBlocks ) {
                anim.always(function() {
                    style.overflow = opts.overflow[ 0 ];
                    style.overflowX = opts.overflow[ 1 ];
                    style.overflowY = opts.overflow[ 2 ];
                });
            }
        }


        // show/hide pass
        for ( index in props ) {
            value = props[ index ];
            if ( rfxtypes.exec( value ) ) {
                delete props[ index ];
                toggle = toggle || value === "toggle";
                if ( value === ( hidden ? "hide" : "show" ) ) {
                    continue;
                }
                handled.push( index );
            }
        }

        length = handled.length;
        if ( length ) {
            dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
            if ( "hidden" in dataShow ) {
                hidden = dataShow.hidden;
            }

            // store state if its toggle - enables .stop().toggle() to "reverse"
            if ( toggle ) {
                dataShow.hidden = !hidden;
            }
            if ( hidden ) {
                jQuery( elem ).show();
            } else {
                anim.done(function() {
                    jQuery( elem ).hide();
                });
            }
            anim.done(function() {
                var prop;
                jQuery._removeData( elem, "fxshow" );
                for ( prop in orig ) {
                    jQuery.style( elem, prop, orig[ prop ] );
                }
            });
            for ( index = 0 ; index < length ; index++ ) {
                prop = handled[ index ];
                tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
                orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

                if ( !( prop in dataShow ) ) {
                    dataShow[ prop ] = tween.start;
                    if ( hidden ) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }
        }
    }

    function Tween( elem, options, prop, end, easing ) {
        return new Tween.prototype.init( elem, options, prop, end, easing );
    }
    jQuery.Tween = Tween;

    Tween.prototype = {
        constructor: Tween,
        init: function( elem, options, prop, end, easing, unit ) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || "swing";
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
        },
        cur: function() {
            var hooks = Tween.propHooks[ this.prop ];

            return hooks && hooks.get ?
                hooks.get( this ) :
                Tween.propHooks._default.get( this );
        },
        run: function( percent ) {
            var eased,
                hooks = Tween.propHooks[ this.prop ];

            if ( this.options.duration ) {
                this.pos = eased = jQuery.easing[ this.easing ](
                    percent, this.options.duration * percent, 0, 1, this.options.duration
                );
            } else {
                this.pos = eased = percent;
            }
            this.now = ( this.end - this.start ) * eased + this.start;

            if ( this.options.step ) {
                this.options.step.call( this.elem, this.now, this );
            }

            if ( hooks && hooks.set ) {
                hooks.set( this );
            } else {
                Tween.propHooks._default.set( this );
            }
            return this;
        }
    };

    Tween.prototype.init.prototype = Tween.prototype;

    Tween.propHooks = {
        _default: {
            get: function( tween ) {
                var result;

                if ( tween.elem[ tween.prop ] != null &&
                    (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
                    return tween.elem[ tween.prop ];
                }

                // passing an empty string as a 3rd parameter to .css will automatically
                // attempt a parseFloat and fallback to a string if the parse fails
                // so, simple values such as "10px" are parsed to Float.
                // complex values such as "rotate(1rad)" are returned as is.
                result = jQuery.css( tween.elem, tween.prop, "" );
                // Empty strings, null, undefined and "auto" are converted to 0.
                return !result || result === "auto" ? 0 : result;
            },
            set: function( tween ) {
                // use step hook for back compat - use cssHook if its there - use .style if its
                // available and use plain properties where available
                if ( jQuery.fx.step[ tween.prop ] ) {
                    jQuery.fx.step[ tween.prop ]( tween );
                } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
                    jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
                } else {
                    tween.elem[ tween.prop ] = tween.now;
                }
            }
        }
    };

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function( tween ) {
            if ( tween.elem.nodeType && tween.elem.parentNode ) {
                tween.elem[ tween.prop ] = tween.now;
            }
        }
    };

    jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
        var cssFn = jQuery.fn[ name ];
        jQuery.fn[ name ] = function( speed, easing, callback ) {
            return speed == null || typeof speed === "boolean" ?
                cssFn.apply( this, arguments ) :
                this.animate( genFx( name, true ), speed, easing, callback );
        };
    });

    jQuery.fn.extend({
        fadeTo: function( speed, to, easing, callback ) {

            // show any hidden elements after setting opacity to 0
            return this.filter( isHidden ).css( "opacity", 0 ).show()

                // animate to the value specified
                .end().animate({ opacity: to }, speed, easing, callback );
        },
        animate: function( prop, speed, easing, callback ) {
            var empty = jQuery.isEmptyObject( prop ),
                optall = jQuery.speed( speed, easing, callback ),
                doAnimation = function() {
                    // Operate on a copy of prop so per-property easing won't be lost
                    var anim = Animation( this, jQuery.extend( {}, prop ), optall );
                    doAnimation.finish = function() {
                        anim.stop( true );
                    };
                    // Empty animations, or finishing resolves immediately
                    if ( empty || jQuery._data( this, "finish" ) ) {
                        anim.stop( true );
                    }
                };
            doAnimation.finish = doAnimation;

            return empty || optall.queue === false ?
                this.each( doAnimation ) :
                this.queue( optall.queue, doAnimation );
        },
        stop: function( type, clearQueue, gotoEnd ) {
            var stopQueue = function( hooks ) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop( gotoEnd );
            };

            if ( typeof type !== "string" ) {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if ( clearQueue && type !== false ) {
                this.queue( type || "fx", [] );
            }

            return this.each(function() {
                var dequeue = true,
                    index = type != null && type + "queueHooks",
                    timers = jQuery.timers,
                    data = jQuery._data( this );

                if ( index ) {
                    if ( data[ index ] && data[ index ].stop ) {
                        stopQueue( data[ index ] );
                    }
                } else {
                    for ( index in data ) {
                        if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
                            stopQueue( data[ index ] );
                        }
                    }
                }

                for ( index = timers.length; index--; ) {
                    if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
                        timers[ index ].anim.stop( gotoEnd );
                        dequeue = false;
                        timers.splice( index, 1 );
                    }
                }

                // start the next in the queue if the last step wasn't forced
                // timers currently will call their complete callbacks, which will dequeue
                // but only if they were gotoEnd
                if ( dequeue || !gotoEnd ) {
                    jQuery.dequeue( this, type );
                }
            });
        },
        finish: function( type ) {
            if ( type !== false ) {
                type = type || "fx";
            }
            return this.each(function() {
                var index,
                    data = jQuery._data( this ),
                    queue = data[ type + "queue" ],
                    hooks = data[ type + "queueHooks" ],
                    timers = jQuery.timers,
                    length = queue ? queue.length : 0;

                // enable finishing flag on private data
                data.finish = true;

                // empty the queue first
                jQuery.queue( this, type, [] );

                if ( hooks && hooks.cur && hooks.cur.finish ) {
                    hooks.cur.finish.call( this );
                }

                // look for any active animations, and finish them
                for ( index = timers.length; index--; ) {
                    if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
                        timers[ index ].anim.stop( true );
                        timers.splice( index, 1 );
                    }
                }

                // look for any animations in the old queue and finish them
                for ( index = 0; index < length; index++ ) {
                    if ( queue[ index ] && queue[ index ].finish ) {
                        queue[ index ].finish.call( this );
                    }
                }

                // turn off finishing flag
                delete data.finish;
            });
        }
    });

// Generate parameters to create a standard animation
    function genFx( type, includeWidth ) {
        var which,
            attrs = { height: type },
            i = 0;

        // if we include width, step value is 1 to do all cssExpand values,
        // if we don't include width, step value is 2 to skip over Left and Right
        includeWidth = includeWidth? 1 : 0;
        for( ; i < 4 ; i += 2 - includeWidth ) {
            which = cssExpand[ i ];
            attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
        }

        if ( includeWidth ) {
            attrs.opacity = attrs.width = type;
        }

        return attrs;
    }

// Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function( name, props ) {
        jQuery.fn[ name ] = function( speed, easing, callback ) {
            return this.animate( props, speed, easing, callback );
        };
    });

    jQuery.speed = function( speed, easing, fn ) {
        var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
            complete: fn || !fn && easing ||
            jQuery.isFunction( speed ) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
        };

        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
            opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

        // normalize opt.queue - true/undefined/null -> "fx"
        if ( opt.queue == null || opt.queue === true ) {
            opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function() {
            if ( jQuery.isFunction( opt.old ) ) {
                opt.old.call( this );
            }

            if ( opt.queue ) {
                jQuery.dequeue( this, opt.queue );
            }
        };

        return opt;
    };

    jQuery.easing = {
        linear: function( p ) {
            return p;
        },
        swing: function( p ) {
            return 0.5 - Math.cos( p*Math.PI ) / 2;
        }
    };

    jQuery.timers = [];
    jQuery.fx = Tween.prototype.init;
    jQuery.fx.tick = function() {
        var timer,
            timers = jQuery.timers,
            i = 0;

        fxNow = jQuery.now();

        for ( ; i < timers.length; i++ ) {
            timer = timers[ i ];
            // Checks the timer has not already been removed
            if ( !timer() && timers[ i ] === timer ) {
                timers.splice( i--, 1 );
            }
        }

        if ( !timers.length ) {
            jQuery.fx.stop();
        }
        fxNow = undefined;
    };

    jQuery.fx.timer = function( timer ) {
        if ( timer() && jQuery.timers.push( timer ) ) {
            jQuery.fx.start();
        }
    };

    jQuery.fx.interval = 13;

    jQuery.fx.start = function() {
        if ( !timerId ) {
            timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
        }
    };

    jQuery.fx.stop = function() {
        clearInterval( timerId );
        timerId = null;
    };

    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    };

// Back Compat <1.8 extension point
    jQuery.fx.step = {};

    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.animated = function( elem ) {
            return jQuery.grep(jQuery.timers, function( fn ) {
                return elem === fn.elem;
            }).length;
        };
    }
    jQuery.fn.offset = function( options ) {
        if ( arguments.length ) {
            return options === undefined ?
                this :
                this.each(function( i ) {
                    jQuery.offset.setOffset( this, options, i );
                });
        }

        var docElem, win,
            box = { top: 0, left: 0 },
            elem = this[ 0 ],
            doc = elem && elem.ownerDocument;

        if ( !doc ) {
            return;
        }

        docElem = doc.documentElement;

        // Make sure it's not a disconnected DOM node
        if ( !jQuery.contains( docElem, elem ) ) {
            return box;
        }

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow( doc );
        return {
            top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
            left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
        };
    };

    jQuery.offset = {

        setOffset: function( elem, options, i ) {
            var position = jQuery.css( elem, "position" );

            // set position first, in-case top/left are set even on static elem
            if ( position === "static" ) {
                elem.style.position = "relative";
            }

            var curElem = jQuery( elem ),
                curOffset = curElem.offset(),
                curCSSTop = jQuery.css( elem, "top" ),
                curCSSLeft = jQuery.css( elem, "left" ),
                calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
                props = {}, curPosition = {}, curTop, curLeft;

            // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
            if ( calculatePosition ) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat( curCSSTop ) || 0;
                curLeft = parseFloat( curCSSLeft ) || 0;
            }

            if ( jQuery.isFunction( options ) ) {
                options = options.call( elem, i, curOffset );
            }

            if ( options.top != null ) {
                props.top = ( options.top - curOffset.top ) + curTop;
            }
            if ( options.left != null ) {
                props.left = ( options.left - curOffset.left ) + curLeft;
            }

            if ( "using" in options ) {
                options.using.call( elem, props );
            } else {
                curElem.css( props );
            }
        }
    };


    jQuery.fn.extend({

        position: function() {
            if ( !this[ 0 ] ) {
                return;
            }

            var offsetParent, offset,
                parentOffset = { top: 0, left: 0 },
                elem = this[ 0 ];

            // fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
            if ( jQuery.css( elem, "position" ) === "fixed" ) {
                // we assume that getBoundingClientRect is available when computed position is fixed
                offset = elem.getBoundingClientRect();
            } else {
                // Get *real* offsetParent
                offsetParent = this.offsetParent();

                // Get correct offsets
                offset = this.offset();
                if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
                    parentOffset = offsetParent.offset();
                }

                // Add offsetParent borders
                parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
                parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
            }

            // Subtract parent offsets and element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            return {
                top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
                left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
            };
        },

        offsetParent: function() {
            return this.map(function() {
                var offsetParent = this.offsetParent || document.documentElement;
                while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || document.documentElement;
            });
        }
    });


// Create scrollLeft and scrollTop methods
    jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
        var top = /Y/.test( prop );

        jQuery.fn[ method ] = function( val ) {
            return jQuery.access( this, function( elem, method, val ) {
                var win = getWindow( elem );

                if ( val === undefined ) {
                    return win ? (prop in win) ? win[ prop ] :
                        win.document.documentElement[ method ] :
                        elem[ method ];
                }

                if ( win ) {
                    win.scrollTo(
                        !top ? val : jQuery( win ).scrollLeft(),
                        top ? val : jQuery( win ).scrollTop()
                    );

                } else {
                    elem[ method ] = val;
                }
            }, method, val, arguments.length, null );
        };
    });

    function getWindow( elem ) {
        return jQuery.isWindow( elem ) ?
            elem :
            elem.nodeType === 9 ?
            elem.defaultView || elem.parentWindow :
                false;
    }
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
        jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
            // margin is only for outerHeight, outerWidth
            jQuery.fn[ funcName ] = function( margin, value ) {
                var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
                    extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

                return jQuery.access( this, function( elem, type, value ) {
                    var doc;

                    if ( jQuery.isWindow( elem ) ) {
                        // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                        // isn't a whole lot we can do. See pull request at this URL for discussion:
                        // https://github.com/jquery/jquery/pull/764
                        return elem.document.documentElement[ "client" + name ];
                    }

                    // Get document width or height
                    if ( elem.nodeType === 9 ) {
                        doc = elem.documentElement;

                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
                        // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
                        return Math.max(
                            elem.body[ "scroll" + name ], doc[ "scroll" + name ],
                            elem.body[ "offset" + name ], doc[ "offset" + name ],
                            doc[ "client" + name ]
                        );
                    }

                    return value === undefined ?
                        // Get width or height on the element, requesting but not forcing parseFloat
                        jQuery.css( elem, type, extra ) :

                        // Set width or height on the element
                        jQuery.style( elem, type, value, extra );
                }, type, chainable ? margin : undefined, chainable, null );
            };
        });
    });
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
    window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
    if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
        define( "jquery", [], function () { return jQuery; } );
    }

})( window );
/*! jQuery JSON plugin 2.4.0 | code.google.com/p/jquery-json */
(function($){'use strict';var escape=/["\\\x00-\x1f\x7f-\x9f]/g,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},hasOwn=Object.prototype.hasOwnProperty;$.toJSON=typeof JSON==='object'&&JSON.stringify?JSON.stringify:function(o){if(o===null){return'null';}
    var pairs,k,name,val,type=$.type(o);if(type==='undefined'){return undefined;}
    if(type==='number'||type==='boolean'){return String(o);}
    if(type==='string'){return $.quoteString(o);}
    if(typeof o.toJSON==='function'){return $.toJSON(o.toJSON());}
    if(type==='date'){var month=o.getUTCMonth()+1,day=o.getUTCDate(),year=o.getUTCFullYear(),hours=o.getUTCHours(),minutes=o.getUTCMinutes(),seconds=o.getUTCSeconds(),milli=o.getUTCMilliseconds();if(month<10){month='0'+month;}
        if(day<10){day='0'+day;}
        if(hours<10){hours='0'+hours;}
        if(minutes<10){minutes='0'+minutes;}
        if(seconds<10){seconds='0'+seconds;}
        if(milli<100){milli='0'+milli;}
        if(milli<10){milli='0'+milli;}
        return'"'+year+'-'+month+'-'+day+'T'+
            hours+':'+minutes+':'+seconds+'.'+milli+'Z"';}
    pairs=[];if($.isArray(o)){for(k=0;k<o.length;k++){pairs.push($.toJSON(o[k])||'null');}
        return'['+pairs.join(',')+']';}
    if(typeof o==='object'){for(k in o){if(hasOwn.call(o,k)){type=typeof k;if(type==='number'){name='"'+k+'"';}else if(type==='string'){name=$.quoteString(k);}else{continue;}
        type=typeof o[k];if(type!=='function'&&type!=='undefined'){val=$.toJSON(o[k]);pairs.push(name+':'+val);}}}
        return'{'+pairs.join(',')+'}';}};$.evalJSON=typeof JSON==='object'&&JSON.parse?JSON.parse:function(str){return eval('('+str+')');};$.secureEvalJSON=typeof JSON==='object'&&JSON.parse?JSON.parse:function(str){var filtered=str.replace(/\\["\\\/bfnrtu]/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered)){return eval('('+str+')');}
    throw new SyntaxError('Error parsing JSON, source is not valid.');};$.quoteString=function(str){if(str.match(escape)){return'"'+str.replace(escape,function(a){var c=meta[a];if(typeof c==='string'){return c;}
        c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
    return'"'+str+'"';};}(jQuery));/*! jQuery UI - v1.10.1 - 2013-03-09
 * http://jqueryui.com
 * Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.sortable.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.slider.js
 * Copyright (c) 2013 jQuery Foundation and other contributors Licensed MIT */

(function( $, undefined ) {

    var uuid = 0,
        runiqueId = /^ui-id-\d+$/;

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
    $.ui = $.ui || {};
    if ( $.ui.version ) {
        return;
    }

    $.extend( $.ui, {
        version: "1.10.1",

        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    });

// plugins
    $.fn.extend({
        _focus: $.fn.focus,
        focus: function( delay, fn ) {
            return typeof delay === "number" ?
                this.each(function() {
                    var elem = this;
                    setTimeout(function() {
                        $( elem ).focus();
                        if ( fn ) {
                            fn.call( elem );
                        }
                    }, delay );
                }) :
                this._focus.apply( this, arguments );
        },

        scrollParent: function() {
            var scrollParent;
            if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
                scrollParent = this.parents().filter(function() {
                    return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
                }).eq(0);
            } else {
                scrollParent = this.parents().filter(function() {
                    return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
                }).eq(0);
            }

            return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
        },

        zIndex: function( zIndex ) {
            if ( zIndex !== undefined ) {
                return this.css( "zIndex", zIndex );
            }

            if ( this.length ) {
                var elem = $( this[ 0 ] ), position, value;
                while ( elem.length && elem[ 0 ] !== document ) {
                    // Ignore z-index if position is set to a value where z-index is ignored by the browser
                    // This makes behavior of this function consistent across browsers
                    // WebKit always returns auto if the element is positioned
                    position = elem.css( "position" );
                    if ( position === "absolute" || position === "relative" || position === "fixed" ) {
                        // IE returns 0 when zIndex is not specified
                        // other browsers return a string
                        // we ignore the case of nested elements with an explicit value of 0
                        // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                        value = parseInt( elem.css( "zIndex" ), 10 );
                        if ( !isNaN( value ) && value !== 0 ) {
                            return value;
                        }
                    }
                    elem = elem.parent();
                }
            }

            return 0;
        },

        uniqueId: function() {
            return this.each(function() {
                if ( !this.id ) {
                    this.id = "ui-id-" + (++uuid);
                }
            });
        },

        removeUniqueId: function() {
            return this.each(function() {
                if ( runiqueId.test( this.id ) ) {
                    $( this ).removeAttr( "id" );
                }
            });
        }
    });

// selectors
    function focusable( element, isTabIndexNotNaN ) {
        var map, mapName, img,
            nodeName = element.nodeName.toLowerCase();
        if ( "area" === nodeName ) {
            map = element.parentNode;
            mapName = map.name;
            if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
                return false;
            }
            img = $( "img[usemap=#" + mapName + "]" )[0];
            return !!img && visible( img );
        }
        return ( /input|select|textarea|button|object/.test( nodeName ) ?
                !element.disabled :
                "a" === nodeName ?
                element.href || isTabIndexNotNaN :
                    isTabIndexNotNaN) &&
                // the element and all of its ancestors must be visible
            visible( element );
    }

    function visible( element ) {
        return $.expr.filters.visible( element ) &&
            !$( element ).parents().addBack().filter(function() {
                return $.css( this, "visibility" ) === "hidden";
            }).length;
    }

    $.extend( $.expr[ ":" ], {
        data: $.expr.createPseudo ?
            $.expr.createPseudo(function( dataName ) {
                return function( elem ) {
                    return !!$.data( elem, dataName );
                };
            }) :
            // support: jQuery <1.8
            function( elem, i, match ) {
                return !!$.data( elem, match[ 3 ] );
            },

        focusable: function( element ) {
            return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
        },

        tabbable: function( element ) {
            var tabIndex = $.attr( element, "tabindex" ),
                isTabIndexNaN = isNaN( tabIndex );
            return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
        }
    });

// support: jQuery <1.8
    if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
        $.each( [ "Width", "Height" ], function( i, name ) {
            var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
                type = name.toLowerCase(),
                orig = {
                    innerWidth: $.fn.innerWidth,
                    innerHeight: $.fn.innerHeight,
                    outerWidth: $.fn.outerWidth,
                    outerHeight: $.fn.outerHeight
                };

            function reduce( elem, size, border, margin ) {
                $.each( side, function() {
                    size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
                    if ( border ) {
                        size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
                    }
                    if ( margin ) {
                        size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
                    }
                });
                return size;
            }

            $.fn[ "inner" + name ] = function( size ) {
                if ( size === undefined ) {
                    return orig[ "inner" + name ].call( this );
                }

                return this.each(function() {
                    $( this ).css( type, reduce( this, size ) + "px" );
                });
            };

            $.fn[ "outer" + name] = function( size, margin ) {
                if ( typeof size !== "number" ) {
                    return orig[ "outer" + name ].call( this, size );
                }

                return this.each(function() {
                    $( this).css( type, reduce( this, size, true, margin ) + "px" );
                });
            };
        });
    }

// support: jQuery <1.8
    if ( !$.fn.addBack ) {
        $.fn.addBack = function( selector ) {
            return this.add( selector == null ?
                    this.prevObject : this.prevObject.filter( selector )
            );
        };
    }

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
    if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
        $.fn.removeData = (function( removeData ) {
            return function( key ) {
                if ( arguments.length ) {
                    return removeData.call( this, $.camelCase( key ) );
                } else {
                    return removeData.call( this );
                }
            };
        })( $.fn.removeData );
    }





// deprecated
    $.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

    $.support.selectstart = "onselectstart" in document.createElement( "div" );
    $.fn.extend({
        disableSelection: function() {
            return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
            ".ui-disableSelection", function( event ) {
                event.preventDefault();
            });
        },

        enableSelection: function() {
            return this.unbind( ".ui-disableSelection" );
        }
    });

    $.extend( $.ui, {
        // $.ui.plugin is deprecated.  Use the proxy pattern instead.
        plugin: {
            add: function( module, option, set ) {
                var i,
                    proto = $.ui[ module ].prototype;
                for ( i in set ) {
                    proto.plugins[ i ] = proto.plugins[ i ] || [];
                    proto.plugins[ i ].push( [ option, set[ i ] ] );
                }
            },
            call: function( instance, name, args ) {
                var i,
                    set = instance.plugins[ name ];
                if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
                    return;
                }

                for ( i = 0; i < set.length; i++ ) {
                    if ( instance.options[ set[ i ][ 0 ] ] ) {
                        set[ i ][ 1 ].apply( instance.element, args );
                    }
                }
            }
        },

        // only used by resizable
        hasScroll: function( el, a ) {

            //If overflow is hidden, the element might have extra content, but the user wants to hide it
            if ( $( el ).css( "overflow" ) === "hidden") {
                return false;
            }

            var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
                has = false;

            if ( el[ scroll ] > 0 ) {
                return true;
            }

            // TODO: determine which cases actually cause this to happen
            // if the element doesn't have the scroll set, see if it's possible to
            // set the scroll
            el[ scroll ] = 1;
            has = ( el[ scroll ] > 0 );
            el[ scroll ] = 0;
            return has;
        }
    });

})( jQuery );
(function( $, undefined ) {

    var uuid = 0,
        slice = Array.prototype.slice,
        _cleanData = $.cleanData;
    $.cleanData = function( elems ) {
        for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
            try {
                $( elem ).triggerHandler( "remove" );
                // http://bugs.jquery.com/ticket/8235
            } catch( e ) {}
        }
        _cleanData( elems );
    };

    $.widget = function( name, base, prototype ) {
        var fullName, existingConstructor, constructor, basePrototype,
        // proxiedPrototype allows the provided prototype to remain unmodified
        // so that it can be used as a mixin for multiple widgets (#8876)
            proxiedPrototype = {},
            namespace = name.split( "." )[ 0 ];

        name = name.split( "." )[ 1 ];
        fullName = namespace + "-" + name;

        if ( !prototype ) {
            prototype = base;
            base = $.Widget;
        }

        // create selector for plugin
        $.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
            return !!$.data( elem, fullName );
        };

        $[ namespace ] = $[ namespace ] || {};
        existingConstructor = $[ namespace ][ name ];
        constructor = $[ namespace ][ name ] = function( options, element ) {
            // allow instantiation without "new" keyword
            if ( !this._createWidget ) {
                return new constructor( options, element );
            }

            // allow instantiation without initializing for simple inheritance
            // must use "new" keyword (the code above always passes args)
            if ( arguments.length ) {
                this._createWidget( options, element );
            }
        };
        // extend with the existing constructor to carry over any static properties
        $.extend( constructor, existingConstructor, {
            version: prototype.version,
            // copy the object used to create the prototype in case we need to
            // redefine the widget later
            _proto: $.extend( {}, prototype ),
            // track widgets that inherit from this widget in case this widget is
            // redefined after a widget inherits from it
            _childConstructors: []
        });

        basePrototype = new base();
        // we need to make the options hash a property directly on the new instance
        // otherwise we'll modify the options hash on the prototype that we're
        // inheriting from
        basePrototype.options = $.widget.extend( {}, basePrototype.options );
        $.each( prototype, function( prop, value ) {
            if ( !$.isFunction( value ) ) {
                proxiedPrototype[ prop ] = value;
                return;
            }
            proxiedPrototype[ prop ] = (function() {
                var _super = function() {
                        return base.prototype[ prop ].apply( this, arguments );
                    },
                    _superApply = function( args ) {
                        return base.prototype[ prop ].apply( this, args );
                    };
                return function() {
                    var __super = this._super,
                        __superApply = this._superApply,
                        returnValue;

                    this._super = _super;
                    this._superApply = _superApply;

                    returnValue = value.apply( this, arguments );

                    this._super = __super;
                    this._superApply = __superApply;

                    return returnValue;
                };
            })();
        });
        constructor.prototype = $.widget.extend( basePrototype, {
            // TODO: remove support for widgetEventPrefix
            // always use the name + a colon as the prefix, e.g., draggable:start
            // don't prefix for widgets that aren't DOM-based
            widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
        }, proxiedPrototype, {
            constructor: constructor,
            namespace: namespace,
            widgetName: name,
            widgetFullName: fullName
        });

        // If this widget is being redefined then we need to find all widgets that
        // are inheriting from it and redefine all of them so that they inherit from
        // the new version of this widget. We're essentially trying to replace one
        // level in the prototype chain.
        if ( existingConstructor ) {
            $.each( existingConstructor._childConstructors, function( i, child ) {
                var childPrototype = child.prototype;

                // redefine the child widget using the same prototype that was
                // originally used, but inherit from the new version of the base
                $.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
            });
            // remove the list of existing child constructors from the old constructor
            // so the old child constructors can be garbage collected
            delete existingConstructor._childConstructors;
        } else {
            base._childConstructors.push( constructor );
        }

        $.widget.bridge( name, constructor );
    };

    $.widget.extend = function( target ) {
        var input = slice.call( arguments, 1 ),
            inputIndex = 0,
            inputLength = input.length,
            key,
            value;
        for ( ; inputIndex < inputLength; inputIndex++ ) {
            for ( key in input[ inputIndex ] ) {
                value = input[ inputIndex ][ key ];
                if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
                    // Clone objects
                    if ( $.isPlainObject( value ) ) {
                        target[ key ] = $.isPlainObject( target[ key ] ) ?
                            $.widget.extend( {}, target[ key ], value ) :
                            // Don't extend strings, arrays, etc. with objects
                            $.widget.extend( {}, value );
                        // Copy everything else by reference
                    } else {
                        target[ key ] = value;
                    }
                }
            }
        }
        return target;
    };

    $.widget.bridge = function( name, object ) {
        var fullName = object.prototype.widgetFullName || name;
        $.fn[ name ] = function( options ) {
            var isMethodCall = typeof options === "string",
                args = slice.call( arguments, 1 ),
                returnValue = this;

            // allow multiple hashes to be passed on init
            options = !isMethodCall && args.length ?
                $.widget.extend.apply( null, [ options ].concat(args) ) :
                options;

            if ( isMethodCall ) {
                this.each(function() {
                    var methodValue,
                        instance = $.data( this, fullName );
                    if ( !instance ) {
                        return $.error( "cannot call methods on " + name + " prior to initialization; " +
                        "attempted to call method '" + options + "'" );
                    }
                    if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
                        return $.error( "no such method '" + options + "' for " + name + " widget instance" );
                    }
                    methodValue = instance[ options ].apply( instance, args );
                    if ( methodValue !== instance && methodValue !== undefined ) {
                        returnValue = methodValue && methodValue.jquery ?
                            returnValue.pushStack( methodValue.get() ) :
                            methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function() {
                    var instance = $.data( this, fullName );
                    if ( instance ) {
                        instance.option( options || {} )._init();
                    } else {
                        $.data( this, fullName, new object( options, this ) );
                    }
                });
            }

            return returnValue;
        };
    };

    $.Widget = function( /* options, element */ ) {};
    $.Widget._childConstructors = [];

    $.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: false,

            // callbacks
            create: null
        },
        _createWidget: function( options, element ) {
            element = $( element || this.defaultElement || this )[ 0 ];
            this.element = $( element );
            this.uuid = uuid++;
            this.eventNamespace = "." + this.widgetName + this.uuid;
            this.options = $.widget.extend( {},
                this.options,
                this._getCreateOptions(),
                options );

            this.bindings = $();
            this.hoverable = $();
            this.focusable = $();

            if ( element !== this ) {
                $.data( element, this.widgetFullName, this );
                this._on( true, this.element, {
                    remove: function( event ) {
                        if ( event.target === element ) {
                            this.destroy();
                        }
                    }
                });
                this.document = $( element.style ?
                    // element within the document
                    element.ownerDocument :
                    // element is window or document
                element.document || element );
                this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
            }

            this._create();
            this._trigger( "create", null, this._getCreateEventData() );
            this._init();
        },
        _getCreateOptions: $.noop,
        _getCreateEventData: $.noop,
        _create: $.noop,
        _init: $.noop,

        destroy: function() {
            this._destroy();
            // we can probably remove the unbind calls in 2.0
            // all event bindings should go through this._on()
            this.element
                .unbind( this.eventNamespace )
                // 1.9 BC for #7810
                // TODO remove dual storage
                .removeData( this.widgetName )
                .removeData( this.widgetFullName )
                // support: jquery <1.6.3
                // http://bugs.jquery.com/ticket/9413
                .removeData( $.camelCase( this.widgetFullName ) );
            this.widget()
                .unbind( this.eventNamespace )
                .removeAttr( "aria-disabled" )
                .removeClass(
                this.widgetFullName + "-disabled " +
                "ui-state-disabled" );

            // clean up events and states
            this.bindings.unbind( this.eventNamespace );
            this.hoverable.removeClass( "ui-state-hover" );
            this.focusable.removeClass( "ui-state-focus" );
        },
        _destroy: $.noop,

        widget: function() {
            return this.element;
        },

        option: function( key, value ) {
            var options = key,
                parts,
                curOption,
                i;

            if ( arguments.length === 0 ) {
                // don't return a reference to the internal hash
                return $.widget.extend( {}, this.options );
            }

            if ( typeof key === "string" ) {
                // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
                options = {};
                parts = key.split( "." );
                key = parts.shift();
                if ( parts.length ) {
                    curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
                    for ( i = 0; i < parts.length - 1; i++ ) {
                        curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
                        curOption = curOption[ parts[ i ] ];
                    }
                    key = parts.pop();
                    if ( value === undefined ) {
                        return curOption[ key ] === undefined ? null : curOption[ key ];
                    }
                    curOption[ key ] = value;
                } else {
                    if ( value === undefined ) {
                        return this.options[ key ] === undefined ? null : this.options[ key ];
                    }
                    options[ key ] = value;
                }
            }

            this._setOptions( options );

            return this;
        },
        _setOptions: function( options ) {
            var key;

            for ( key in options ) {
                this._setOption( key, options[ key ] );
            }

            return this;
        },
        _setOption: function( key, value ) {
            this.options[ key ] = value;

            if ( key === "disabled" ) {
                this.widget()
                    .toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
                    .attr( "aria-disabled", value );
                this.hoverable.removeClass( "ui-state-hover" );
                this.focusable.removeClass( "ui-state-focus" );
            }

            return this;
        },

        enable: function() {
            return this._setOption( "disabled", false );
        },
        disable: function() {
            return this._setOption( "disabled", true );
        },

        _on: function( suppressDisabledCheck, element, handlers ) {
            var delegateElement,
                instance = this;

            // no suppressDisabledCheck flag, shuffle arguments
            if ( typeof suppressDisabledCheck !== "boolean" ) {
                handlers = element;
                element = suppressDisabledCheck;
                suppressDisabledCheck = false;
            }

            // no element argument, shuffle and use this.element
            if ( !handlers ) {
                handlers = element;
                element = this.element;
                delegateElement = this.widget();
            } else {
                // accept selectors, DOM elements
                element = delegateElement = $( element );
                this.bindings = this.bindings.add( element );
            }

            $.each( handlers, function( event, handler ) {
                function handlerProxy() {
                    // allow widgets to customize the disabled handling
                    // - disabled as an array instead of boolean
                    // - disabled class as method for disabling individual parts
                    if ( !suppressDisabledCheck &&
                        ( instance.options.disabled === true ||
                        $( this ).hasClass( "ui-state-disabled" ) ) ) {
                        return;
                    }
                    return ( typeof handler === "string" ? instance[ handler ] : handler )
                        .apply( instance, arguments );
                }

                // copy the guid so direct unbinding works
                if ( typeof handler !== "string" ) {
                    handlerProxy.guid = handler.guid =
                        handler.guid || handlerProxy.guid || $.guid++;
                }

                var match = event.match( /^(\w+)\s*(.*)$/ ),
                    eventName = match[1] + instance.eventNamespace,
                    selector = match[2];
                if ( selector ) {
                    delegateElement.delegate( selector, eventName, handlerProxy );
                } else {
                    element.bind( eventName, handlerProxy );
                }
            });
        },

        _off: function( element, eventName ) {
            eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
            element.unbind( eventName ).undelegate( eventName );
        },

        _delay: function( handler, delay ) {
            function handlerProxy() {
                return ( typeof handler === "string" ? instance[ handler ] : handler )
                    .apply( instance, arguments );
            }
            var instance = this;
            return setTimeout( handlerProxy, delay || 0 );
        },

        _hoverable: function( element ) {
            this.hoverable = this.hoverable.add( element );
            this._on( element, {
                mouseenter: function( event ) {
                    $( event.currentTarget ).addClass( "ui-state-hover" );
                },
                mouseleave: function( event ) {
                    $( event.currentTarget ).removeClass( "ui-state-hover" );
                }
            });
        },

        _focusable: function( element ) {
            this.focusable = this.focusable.add( element );
            this._on( element, {
                focusin: function( event ) {
                    $( event.currentTarget ).addClass( "ui-state-focus" );
                },
                focusout: function( event ) {
                    $( event.currentTarget ).removeClass( "ui-state-focus" );
                }
            });
        },

        _trigger: function( type, event, data ) {
            var prop, orig,
                callback = this.options[ type ];

            data = data || {};
            event = $.Event( event );
            event.type = ( type === this.widgetEventPrefix ?
                type :
            this.widgetEventPrefix + type ).toLowerCase();
            // the original event may come from any element
            // so we need to reset the target on the new event
            event.target = this.element[ 0 ];

            // copy original event properties over to the new event
            orig = event.originalEvent;
            if ( orig ) {
                for ( prop in orig ) {
                    if ( !( prop in event ) ) {
                        event[ prop ] = orig[ prop ];
                    }
                }
            }

            this.element.trigger( event, data );
            return !( $.isFunction( callback ) &&
            callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
            event.isDefaultPrevented() );
        }
    };

    $.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
        $.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
            if ( typeof options === "string" ) {
                options = { effect: options };
            }
            var hasOptions,
                effectName = !options ?
                    method :
                    options === true || typeof options === "number" ?
                        defaultEffect :
                    options.effect || defaultEffect;
            options = options || {};
            if ( typeof options === "number" ) {
                options = { duration: options };
            }
            hasOptions = !$.isEmptyObject( options );
            options.complete = callback;
            if ( options.delay ) {
                element.delay( options.delay );
            }
            if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
                element[ method ]( options );
            } else if ( effectName !== method && element[ effectName ] ) {
                element[ effectName ]( options.duration, options.easing, callback );
            } else {
                element.queue(function( next ) {
                    $( this )[ method ]();
                    if ( callback ) {
                        callback.call( element[ 0 ] );
                    }
                    next();
                });
            }
        };
    });

})( jQuery );
(function( $, undefined ) {

    var mouseHandled = false;
    $( document ).mouseup( function() {
        mouseHandled = false;
    });

    $.widget("ui.mouse", {
        version: "1.10.1",
        options: {
            cancel: "input,textarea,button,select,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var that = this;

            this.element
                .bind("mousedown."+this.widgetName, function(event) {
                    return that._mouseDown(event);
                })
                .bind("click."+this.widgetName, function(event) {
                    if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
                        $.removeData(event.target, that.widgetName + ".preventClickEvent");
                        event.stopImmediatePropagation();
                        return false;
                    }
                });

            this.started = false;
        },

        // TODO: make sure destroying one instance of mouse doesn't mess with
        // other instances of mouse
        _mouseDestroy: function() {
            this.element.unbind("."+this.widgetName);
            if ( this._mouseMoveDelegate ) {
                $(document)
                    .unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
                    .unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
            }
        },

        _mouseDown: function(event) {
            // don't let more than one widget handle mouseStart
            if( mouseHandled ) { return; }

            // we may have missed mouseup (out of window)
            (this._mouseStarted && this._mouseUp(event));

            this._mouseDownEvent = event;

            var that = this,
                btnIsLeft = (event.which === 1),
            // event.target.nodeName works around a bug in IE 8 with
            // disabled inputs (#7620)
                elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
            if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
                return true;
            }

            this.mouseDelayMet = !this.options.delay;
            if (!this.mouseDelayMet) {
                this._mouseDelayTimer = setTimeout(function() {
                    that.mouseDelayMet = true;
                }, this.options.delay);
            }

            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted = (this._mouseStart(event) !== false);
                if (!this._mouseStarted) {
                    event.preventDefault();
                    return true;
                }
            }

            // Click event may never have fired (Gecko & Opera)
            if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
                $.removeData(event.target, this.widgetName + ".preventClickEvent");
            }

            // these delegates are required to keep context
            this._mouseMoveDelegate = function(event) {
                return that._mouseMove(event);
            };
            this._mouseUpDelegate = function(event) {
                return that._mouseUp(event);
            };
            $(document)
                .bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
                .bind("mouseup."+this.widgetName, this._mouseUpDelegate);

            event.preventDefault();

            mouseHandled = true;
            return true;
        },

        _mouseMove: function(event) {
            // IE mouseup check - mouseup happened when mouse was out of window
            if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
                return this._mouseUp(event);
            }

            if (this._mouseStarted) {
                this._mouseDrag(event);
                return event.preventDefault();
            }

            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted =
                    (this._mouseStart(this._mouseDownEvent, event) !== false);
                (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
            }

            return !this._mouseStarted;
        },

        _mouseUp: function(event) {
            $(document)
                .unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
                .unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

            if (this._mouseStarted) {
                this._mouseStarted = false;

                if (event.target === this._mouseDownEvent.target) {
                    $.data(event.target, this.widgetName + ".preventClickEvent", true);
                }

                this._mouseStop(event);
            }

            return false;
        },

        _mouseDistanceMet: function(event) {
            return (Math.max(
                Math.abs(this._mouseDownEvent.pageX - event.pageX),
                Math.abs(this._mouseDownEvent.pageY - event.pageY)
            ) >= this.options.distance
            );
        },

        _mouseDelayMet: function(/* event */) {
            return this.mouseDelayMet;
        },

        // These are placeholder methods, to be overriden by extending plugin
        _mouseStart: function(/* event */) {},
        _mouseDrag: function(/* event */) {},
        _mouseStop: function(/* event */) {},
        _mouseCapture: function(/* event */) { return true; }
    });

})(jQuery);
(function( $, undefined ) {

    $.ui = $.ui || {};

    var cachedScrollbarWidth,
        max = Math.max,
        abs = Math.abs,
        round = Math.round,
        rhorizontal = /left|center|right/,
        rvertical = /top|center|bottom/,
        roffset = /[\+\-]\d+(\.[\d]+)?%?/,
        rposition = /^\w+/,
        rpercent = /%$/,
        _position = $.fn.position;

    function getOffsets( offsets, width, height ) {
        return [
            parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
            parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
        ];
    }

    function parseCss( element, property ) {
        return parseInt( $.css( element, property ), 10 ) || 0;
    }

    function getDimensions( elem ) {
        var raw = elem[0];
        if ( raw.nodeType === 9 ) {
            return {
                width: elem.width(),
                height: elem.height(),
                offset: { top: 0, left: 0 }
            };
        }
        if ( $.isWindow( raw ) ) {
            return {
                width: elem.width(),
                height: elem.height(),
                offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
            };
        }
        if ( raw.preventDefault ) {
            return {
                width: 0,
                height: 0,
                offset: { top: raw.pageY, left: raw.pageX }
            };
        }
        return {
            width: elem.outerWidth(),
            height: elem.outerHeight(),
            offset: elem.offset()
        };
    }

    $.position = {
        scrollbarWidth: function() {
            if ( cachedScrollbarWidth !== undefined ) {
                return cachedScrollbarWidth;
            }
            var w1, w2,
                div = $( "<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
                innerDiv = div.children()[0];

            $( "body" ).append( div );
            w1 = innerDiv.offsetWidth;
            div.css( "overflow", "scroll" );

            w2 = innerDiv.offsetWidth;

            if ( w1 === w2 ) {
                w2 = div[0].clientWidth;
            }

            div.remove();

            return (cachedScrollbarWidth = w1 - w2);
        },
        getScrollInfo: function( within ) {
            var overflowX = within.isWindow ? "" : within.element.css( "overflow-x" ),
                overflowY = within.isWindow ? "" : within.element.css( "overflow-y" ),
                hasOverflowX = overflowX === "scroll" ||
                    ( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
                hasOverflowY = overflowY === "scroll" ||
                    ( overflowY === "auto" && within.height < within.element[0].scrollHeight );
            return {
                width: hasOverflowX ? $.position.scrollbarWidth() : 0,
                height: hasOverflowY ? $.position.scrollbarWidth() : 0
            };
        },
        getWithinInfo: function( element ) {
            var withinElement = $( element || window ),
                isWindow = $.isWindow( withinElement[0] );
            return {
                element: withinElement,
                isWindow: isWindow,
                offset: withinElement.offset() || { left: 0, top: 0 },
                scrollLeft: withinElement.scrollLeft(),
                scrollTop: withinElement.scrollTop(),
                width: isWindow ? withinElement.width() : withinElement.outerWidth(),
                height: isWindow ? withinElement.height() : withinElement.outerHeight()
            };
        }
    };

    $.fn.position = function( options ) {
        if ( !options || !options.of ) {
            return _position.apply( this, arguments );
        }

        // make a copy, we don't want to modify arguments
        options = $.extend( {}, options );

        var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
            target = $( options.of ),
            within = $.position.getWithinInfo( options.within ),
            scrollInfo = $.position.getScrollInfo( within ),
            collision = ( options.collision || "flip" ).split( " " ),
            offsets = {};

        dimensions = getDimensions( target );
        if ( target[0].preventDefault ) {
            // force left top to allow flipping
            options.at = "left top";
        }
        targetWidth = dimensions.width;
        targetHeight = dimensions.height;
        targetOffset = dimensions.offset;
        // clone to reuse original targetOffset later
        basePosition = $.extend( {}, targetOffset );

        // force my and at to have valid horizontal and vertical positions
        // if a value is missing or invalid, it will be converted to center
        $.each( [ "my", "at" ], function() {
            var pos = ( options[ this ] || "" ).split( " " ),
                horizontalOffset,
                verticalOffset;

            if ( pos.length === 1) {
                pos = rhorizontal.test( pos[ 0 ] ) ?
                    pos.concat( [ "center" ] ) :
                    rvertical.test( pos[ 0 ] ) ?
                        [ "center" ].concat( pos ) :
                        [ "center", "center" ];
            }
            pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
            pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

            // calculate offsets
            horizontalOffset = roffset.exec( pos[ 0 ] );
            verticalOffset = roffset.exec( pos[ 1 ] );
            offsets[ this ] = [
                horizontalOffset ? horizontalOffset[ 0 ] : 0,
                verticalOffset ? verticalOffset[ 0 ] : 0
            ];

            // reduce to just the positions without the offsets
            options[ this ] = [
                rposition.exec( pos[ 0 ] )[ 0 ],
                rposition.exec( pos[ 1 ] )[ 0 ]
            ];
        });

        // normalize collision option
        if ( collision.length === 1 ) {
            collision[ 1 ] = collision[ 0 ];
        }

        if ( options.at[ 0 ] === "right" ) {
            basePosition.left += targetWidth;
        } else if ( options.at[ 0 ] === "center" ) {
            basePosition.left += targetWidth / 2;
        }

        if ( options.at[ 1 ] === "bottom" ) {
            basePosition.top += targetHeight;
        } else if ( options.at[ 1 ] === "center" ) {
            basePosition.top += targetHeight / 2;
        }

        atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
        basePosition.left += atOffset[ 0 ];
        basePosition.top += atOffset[ 1 ];

        return this.each(function() {
            var collisionPosition, using,
                elem = $( this ),
                elemWidth = elem.outerWidth(),
                elemHeight = elem.outerHeight(),
                marginLeft = parseCss( this, "marginLeft" ),
                marginTop = parseCss( this, "marginTop" ),
                collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
                collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
                position = $.extend( {}, basePosition ),
                myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

            if ( options.my[ 0 ] === "right" ) {
                position.left -= elemWidth;
            } else if ( options.my[ 0 ] === "center" ) {
                position.left -= elemWidth / 2;
            }

            if ( options.my[ 1 ] === "bottom" ) {
                position.top -= elemHeight;
            } else if ( options.my[ 1 ] === "center" ) {
                position.top -= elemHeight / 2;
            }

            position.left += myOffset[ 0 ];
            position.top += myOffset[ 1 ];

            // if the browser doesn't support fractions, then round for consistent results
            if ( !$.support.offsetFractions ) {
                position.left = round( position.left );
                position.top = round( position.top );
            }

            collisionPosition = {
                marginLeft: marginLeft,
                marginTop: marginTop
            };

            $.each( [ "left", "top" ], function( i, dir ) {
                if ( $.ui.position[ collision[ i ] ] ) {
                    $.ui.position[ collision[ i ] ][ dir ]( position, {
                        targetWidth: targetWidth,
                        targetHeight: targetHeight,
                        elemWidth: elemWidth,
                        elemHeight: elemHeight,
                        collisionPosition: collisionPosition,
                        collisionWidth: collisionWidth,
                        collisionHeight: collisionHeight,
                        offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
                        my: options.my,
                        at: options.at,
                        within: within,
                        elem : elem
                    });
                }
            });

            if ( options.using ) {
                // adds feedback as second argument to using callback, if present
                using = function( props ) {
                    var left = targetOffset.left - position.left,
                        right = left + targetWidth - elemWidth,
                        top = targetOffset.top - position.top,
                        bottom = top + targetHeight - elemHeight,
                        feedback = {
                            target: {
                                element: target,
                                left: targetOffset.left,
                                top: targetOffset.top,
                                width: targetWidth,
                                height: targetHeight
                            },
                            element: {
                                element: elem,
                                left: position.left,
                                top: position.top,
                                width: elemWidth,
                                height: elemHeight
                            },
                            horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
                            vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
                        };
                    if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
                        feedback.horizontal = "center";
                    }
                    if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
                        feedback.vertical = "middle";
                    }
                    if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
                        feedback.important = "horizontal";
                    } else {
                        feedback.important = "vertical";
                    }
                    options.using.call( this, props, feedback );
                };
            }

            elem.offset( $.extend( position, { using: using } ) );
        });
    };

    $.ui.position = {
        fit: {
            left: function( position, data ) {
                var within = data.within,
                    withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
                    outerWidth = within.width,
                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                    overLeft = withinOffset - collisionPosLeft,
                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
                    newOverRight;

                // element is wider than within
                if ( data.collisionWidth > outerWidth ) {
                    // element is initially over the left side of within
                    if ( overLeft > 0 && overRight <= 0 ) {
                        newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
                        position.left += overLeft - newOverRight;
                        // element is initially over right side of within
                    } else if ( overRight > 0 && overLeft <= 0 ) {
                        position.left = withinOffset;
                        // element is initially over both left and right sides of within
                    } else {
                        if ( overLeft > overRight ) {
                            position.left = withinOffset + outerWidth - data.collisionWidth;
                        } else {
                            position.left = withinOffset;
                        }
                    }
                    // too far left -> align with left edge
                } else if ( overLeft > 0 ) {
                    position.left += overLeft;
                    // too far right -> align with right edge
                } else if ( overRight > 0 ) {
                    position.left -= overRight;
                    // adjust based on position and margin
                } else {
                    position.left = max( position.left - collisionPosLeft, position.left );
                }
            },
            top: function( position, data ) {
                var within = data.within,
                    withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
                    outerHeight = data.within.height,
                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                    overTop = withinOffset - collisionPosTop,
                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
                    newOverBottom;

                // element is taller than within
                if ( data.collisionHeight > outerHeight ) {
                    // element is initially over the top of within
                    if ( overTop > 0 && overBottom <= 0 ) {
                        newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
                        position.top += overTop - newOverBottom;
                        // element is initially over bottom of within
                    } else if ( overBottom > 0 && overTop <= 0 ) {
                        position.top = withinOffset;
                        // element is initially over both top and bottom of within
                    } else {
                        if ( overTop > overBottom ) {
                            position.top = withinOffset + outerHeight - data.collisionHeight;
                        } else {
                            position.top = withinOffset;
                        }
                    }
                    // too far up -> align with top
                } else if ( overTop > 0 ) {
                    position.top += overTop;
                    // too far down -> align with bottom edge
                } else if ( overBottom > 0 ) {
                    position.top -= overBottom;
                    // adjust based on position and margin
                } else {
                    position.top = max( position.top - collisionPosTop, position.top );
                }
            }
        },
        flip: {
            left: function( position, data ) {
                var within = data.within,
                    withinOffset = within.offset.left + within.scrollLeft,
                    outerWidth = within.width,
                    offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                    overLeft = collisionPosLeft - offsetLeft,
                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
                    myOffset = data.my[ 0 ] === "left" ?
                        -data.elemWidth :
                        data.my[ 0 ] === "right" ?
                            data.elemWidth :
                            0,
                    atOffset = data.at[ 0 ] === "left" ?
                        data.targetWidth :
                        data.at[ 0 ] === "right" ?
                            -data.targetWidth :
                            0,
                    offset = -2 * data.offset[ 0 ],
                    newOverRight,
                    newOverLeft;

                if ( overLeft < 0 ) {
                    newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
                    if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
                        position.left += myOffset + atOffset + offset;
                    }
                }
                else if ( overRight > 0 ) {
                    newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
                    if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
                        position.left += myOffset + atOffset + offset;
                    }
                }
            },
            top: function( position, data ) {
                var within = data.within,
                    withinOffset = within.offset.top + within.scrollTop,
                    outerHeight = within.height,
                    offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                    overTop = collisionPosTop - offsetTop,
                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
                    top = data.my[ 1 ] === "top",
                    myOffset = top ?
                        -data.elemHeight :
                        data.my[ 1 ] === "bottom" ?
                            data.elemHeight :
                            0,
                    atOffset = data.at[ 1 ] === "top" ?
                        data.targetHeight :
                        data.at[ 1 ] === "bottom" ?
                            -data.targetHeight :
                            0,
                    offset = -2 * data.offset[ 1 ],
                    newOverTop,
                    newOverBottom;
                if ( overTop < 0 ) {
                    newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
                    if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
                        position.top += myOffset + atOffset + offset;
                    }
                }
                else if ( overBottom > 0 ) {
                    newOverTop = position.top -  data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
                    if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
                        position.top += myOffset + atOffset + offset;
                    }
                }
            }
        },
        flipfit: {
            left: function() {
                $.ui.position.flip.left.apply( this, arguments );
                $.ui.position.fit.left.apply( this, arguments );
            },
            top: function() {
                $.ui.position.flip.top.apply( this, arguments );
                $.ui.position.fit.top.apply( this, arguments );
            }
        }
    };

// fraction support test
    (function () {
        var testElement, testElementParent, testElementStyle, offsetLeft, i,
            body = document.getElementsByTagName( "body" )[ 0 ],
            div = document.createElement( "div" );

        //Create a "fake body" for testing based on method used in jQuery.support
        testElement = document.createElement( body ? "div" : "body" );
        testElementStyle = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0,
            background: "none"
        };
        if ( body ) {
            $.extend( testElementStyle, {
                position: "absolute",
                left: "-1000px",
                top: "-1000px"
            });
        }
        for ( i in testElementStyle ) {
            testElement.style[ i ] = testElementStyle[ i ];
        }
        testElement.appendChild( div );
        testElementParent = body || document.documentElement;
        testElementParent.insertBefore( testElement, testElementParent.firstChild );

        div.style.cssText = "position: absolute; left: 10.7432222px;";

        offsetLeft = $( div ).offset().left;
        $.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

        testElement.innerHTML = "";
        testElementParent.removeChild( testElement );
    })();

}( jQuery ) );
(function( $, undefined ) {

    $.widget("ui.draggable", $.ui.mouse, {
        version: "1.10.1",
        widgetEventPrefix: "drag",
        options: {
            addClasses: true,
            appendTo: "parent",
            axis: false,
            connectToSortable: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            grid: false,
            handle: false,
            helper: "original",
            iframeFix: false,
            opacity: false,
            refreshPositions: false,
            revert: false,
            revertDuration: 500,
            scope: "default",
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: false,
            snapMode: "both",
            snapTolerance: 20,
            stack: false,
            zIndex: false,

            // callbacks
            drag: null,
            start: null,
            stop: null
        },
        _create: function() {

            if (this.options.helper === "original" && !(/^(?:r|a|f)/).test(this.element.css("position"))) {
                this.element[0].style.position = "relative";
            }
            if (this.options.addClasses){
                this.element.addClass("ui-draggable");
            }
            if (this.options.disabled){
                this.element.addClass("ui-draggable-disabled");
            }

            this._mouseInit();

        },

        _destroy: function() {
            this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
            this._mouseDestroy();
        },

        _mouseCapture: function(event) {

            var o = this.options;

            // among others, prevent a drag on a resizable-handle
            if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
                return false;
            }

            //Quit if we're not on a valid handle
            this.handle = this._getHandle(event);
            if (!this.handle) {
                return false;
            }

            $(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
                $("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>")
                    .css({
                        width: this.offsetWidth+"px", height: this.offsetHeight+"px",
                        position: "absolute", opacity: "0.001", zIndex: 1000
                    })
                    .css($(this).offset())
                    .appendTo("body");
            });

            return true;

        },

        _mouseStart: function(event) {

            var o = this.options;

            //Create and append the visible helper
            this.helper = this._createHelper(event);

            this.helper.addClass("ui-draggable-dragging");

            //Cache the helper size
            this._cacheHelperProportions();

            //If ddmanager is used for droppables, set the global draggable
            if($.ui.ddmanager) {
                $.ui.ddmanager.current = this;
            }

            /*
             * - Position generation -
             * This block generates everything position related - it's the core of draggables.
             */

            //Cache the margins of the original element
            this._cacheMargins();

            //Store the helper's css position
            this.cssPosition = this.helper.css("position");
            this.scrollParent = this.helper.scrollParent();

            //The element's absolute position on the page minus margins
            this.offset = this.positionAbs = this.element.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };

            $.extend(this.offset, {
                click: { //Where the click happened, relative to the element
                    left: event.pageX - this.offset.left,
                    top: event.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
            });

            //Generate the original position
            this.originalPosition = this.position = this._generatePosition(event);
            this.originalPageX = event.pageX;
            this.originalPageY = event.pageY;

            //Adjust the mouse offset relative to the helper if "cursorAt" is supplied
            (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

            //Set a containment if given in the options
            if(o.containment) {
                this._setContainment();
            }

            //Trigger event + callbacks
            if(this._trigger("start", event) === false) {
                this._clear();
                return false;
            }

            //Recache the helper size
            this._cacheHelperProportions();

            //Prepare the droppable offsets
            if ($.ui.ddmanager && !o.dropBehaviour) {
                $.ui.ddmanager.prepareOffsets(this, event);
            }


            this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

            //If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
            if ( $.ui.ddmanager ) {
                $.ui.ddmanager.dragStart(this, event);
            }

            return true;
        },

        _mouseDrag: function(event, noPropagation) {

            //Compute the helpers position
            this.position = this._generatePosition(event);
            this.positionAbs = this._convertPositionTo("absolute");

            //Call plugins and callbacks and use the resulting position if something is returned
            if (!noPropagation) {
                var ui = this._uiHash();
                if(this._trigger("drag", event, ui) === false) {
                    this._mouseUp({});
                    return false;
                }
                this.position = ui.position;
            }

            if(!this.options.axis || this.options.axis !== "y") {
                this.helper[0].style.left = this.position.left+"px";
            }
            if(!this.options.axis || this.options.axis !== "x") {
                this.helper[0].style.top = this.position.top+"px";
            }
            if($.ui.ddmanager) {
                $.ui.ddmanager.drag(this, event);
            }

            return false;
        },

        _mouseStop: function(event) {

            //If we are using droppables, inform the manager about the drop
            var element,
                that = this,
                elementInDom = false,
                dropped = false;
            if ($.ui.ddmanager && !this.options.dropBehaviour) {
                dropped = $.ui.ddmanager.drop(this, event);
            }

            //if a drop comes from outside (a sortable)
            if(this.dropped) {
                dropped = this.dropped;
                this.dropped = false;
            }

            //if the original element is no longer in the DOM don't bother to continue (see #8269)
            element = this.element[0];
            while ( element && (element = element.parentNode) ) {
                if (element === document ) {
                    elementInDom = true;
                }
            }
            if ( !elementInDom && this.options.helper === "original" ) {
                return false;
            }

            if((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
                $(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                    if(that._trigger("stop", event) !== false) {
                        that._clear();
                    }
                });
            } else {
                if(this._trigger("stop", event) !== false) {
                    this._clear();
                }
            }

            return false;
        },

        _mouseUp: function(event) {
            //Remove frame helpers
            $("div.ui-draggable-iframeFix").each(function() {
                this.parentNode.removeChild(this);
            });

            //If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
            if( $.ui.ddmanager ) {
                $.ui.ddmanager.dragStop(this, event);
            }

            return $.ui.mouse.prototype._mouseUp.call(this, event);
        },

        cancel: function() {

            if(this.helper.is(".ui-draggable-dragging")) {
                this._mouseUp({});
            } else {
                this._clear();
            }

            return this;

        },

        _getHandle: function(event) {

            var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
            $(this.options.handle, this.element)
                .find("*")
                .addBack()
                .each(function() {
                    if(this === event.target) {
                        handle = true;
                    }
                });

            return handle;

        },

        _createHelper: function(event) {

            var o = this.options,
                helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper === "clone" ? this.element.clone().removeAttr("id") : this.element);

            if(!helper.parents("body").length) {
                helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
            }

            if(helper[0] !== this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) {
                helper.css("position", "absolute");
            }

            return helper;

        },

        _adjustOffsetFromHelper: function(obj) {
            if (typeof obj === "string") {
                obj = obj.split(" ");
            }
            if ($.isArray(obj)) {
                obj = {left: +obj[0], top: +obj[1] || 0};
            }
            if ("left" in obj) {
                this.offset.click.left = obj.left + this.margins.left;
            }
            if ("right" in obj) {
                this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
            }
            if ("top" in obj) {
                this.offset.click.top = obj.top + this.margins.top;
            }
            if ("bottom" in obj) {
                this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
            }
        },

        _getParentOffset: function() {

            //Get the offsetParent and cache its position
            this.offsetParent = this.helper.offsetParent();
            var po = this.offsetParent.offset();

            // This is a special case where we need to modify a offset calculated on start, since the following happened:
            // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
            // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
            //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
            if(this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
                po.left += this.scrollParent.scrollLeft();
                po.top += this.scrollParent.scrollTop();
            }

            //This needs to be actually done for all browsers, since pageX/pageY includes this information
            //Ugly IE fix
            if((this.offsetParent[0] === document.body) ||
                (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
                po = { top: 0, left: 0 };
            }

            return {
                top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
                left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
            };

        },

        _getRelativeOffset: function() {

            if(this.cssPosition === "relative") {
                var p = this.element.position();
                return {
                    top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
                    left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
                };
            } else {
                return { top: 0, left: 0 };
            }

        },

        _cacheMargins: function() {
            this.margins = {
                left: (parseInt(this.element.css("marginLeft"),10) || 0),
                top: (parseInt(this.element.css("marginTop"),10) || 0),
                right: (parseInt(this.element.css("marginRight"),10) || 0),
                bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
            };
        },

        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            };
        },

        _setContainment: function() {

            var over, c, ce,
                o = this.options;

            if(o.containment === "parent") {
                o.containment = this.helper[0].parentNode;
            }
            if(o.containment === "document" || o.containment === "window") {
                this.containment = [
                    o.containment === "document" ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
                    o.containment === "document" ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
                    (o.containment === "document" ? 0 : $(window).scrollLeft()) + $(o.containment === "document" ? document : window).width() - this.helperProportions.width - this.margins.left,
                    (o.containment === "document" ? 0 : $(window).scrollTop()) + ($(o.containment === "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
                ];
            }

            if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor !== Array) {
                c = $(o.containment);
                ce = c[0];

                if(!ce) {
                    return;
                }

                over = ($(ce).css("overflow") !== "hidden");

                this.containment = [
                    (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
                    (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
                    (over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
                    (over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
                ];
                this.relative_container = c;

            } else if(o.containment.constructor === Array) {
                this.containment = o.containment;
            }

        },

        _convertPositionTo: function(d, pos) {

            if(!pos) {
                pos = this.position;
            }

            var mod = d === "absolute" ? 1 : -1,
                scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

            return {
                top: (
                pos.top	+																// The absolute mouse position
                this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
                this.offset.parent.top * mod -										// The offsetParent's offset without borders (offset + border)
                ( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
                ),
                left: (
                pos.left +																// The absolute mouse position
                this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
                this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
                ( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
                )
            };

        },

        _generatePosition: function(event) {

            var containment, co, top, left,
                o = this.options,
                scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName),
                pageX = event.pageX,
                pageY = event.pageY;

            /*
             * - Position constraining -
             * Constrain the position to a mix of grid, containment.
             */

            if(this.originalPosition) { //If we are not dragging yet, we won't check for options
                if(this.containment) {
                    if (this.relative_container){
                        co = this.relative_container.offset();
                        containment = [ this.containment[0] + co.left,
                            this.containment[1] + co.top,
                            this.containment[2] + co.left,
                            this.containment[3] + co.top ];
                    }
                    else {
                        containment = this.containment;
                    }

                    if(event.pageX - this.offset.click.left < containment[0]) {
                        pageX = containment[0] + this.offset.click.left;
                    }
                    if(event.pageY - this.offset.click.top < containment[1]) {
                        pageY = containment[1] + this.offset.click.top;
                    }
                    if(event.pageX - this.offset.click.left > containment[2]) {
                        pageX = containment[2] + this.offset.click.left;
                    }
                    if(event.pageY - this.offset.click.top > containment[3]) {
                        pageY = containment[3] + this.offset.click.top;
                    }
                }

                if(o.grid) {
                    //Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
                    top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
                    pageY = containment ? ((top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3]) ? top : ((top - this.offset.click.top >= containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

                    left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
                    pageX = containment ? ((left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2]) ? left : ((left - this.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
                }

            }

            return {
                top: (
                pageY -																	// The absolute mouse position
                this.offset.click.top	-												// Click offset (relative to the element)
                this.offset.relative.top -												// Only for relative positioned nodes: Relative offset from element to offset parent
                this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
                ( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
                ),
                left: (
                pageX -																	// The absolute mouse position
                this.offset.click.left -												// Click offset (relative to the element)
                this.offset.relative.left -												// Only for relative positioned nodes: Relative offset from element to offset parent
                this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
                ( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
                )
            };

        },

        _clear: function() {
            this.helper.removeClass("ui-draggable-dragging");
            if(this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
                this.helper.remove();
            }
            this.helper = null;
            this.cancelHelperRemoval = false;
        },

        // From now on bulk stuff - mainly helpers

        _trigger: function(type, event, ui) {
            ui = ui || this._uiHash();
            $.ui.plugin.call(this, type, [event, ui]);
            //The absolute position has to be recalculated after plugins
            if(type === "drag") {
                this.positionAbs = this._convertPositionTo("absolute");
            }
            return $.Widget.prototype._trigger.call(this, type, event, ui);
        },

        plugins: {},

        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            };
        }

    });

    $.ui.plugin.add("draggable", "connectToSortable", {
        start: function(event, ui) {

            var inst = $(this).data("ui-draggable"), o = inst.options,
                uiSortable = $.extend({}, ui, { item: inst.element });
            inst.sortables = [];
            $(o.connectToSortable).each(function() {
                var sortable = $.data(this, "ui-sortable");
                if (sortable && !sortable.options.disabled) {
                    inst.sortables.push({
                        instance: sortable,
                        shouldRevert: sortable.options.revert
                    });
                    sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
                    sortable._trigger("activate", event, uiSortable);
                }
            });

        },
        stop: function(event, ui) {

            //If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
            var inst = $(this).data("ui-draggable"),
                uiSortable = $.extend({}, ui, { item: inst.element });

            $.each(inst.sortables, function() {
                if(this.instance.isOver) {

                    this.instance.isOver = 0;

                    inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
                    this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

                    //The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: "valid/invalid"
                    if(this.shouldRevert) {
                        this.instance.options.revert = true;
                    }

                    //Trigger the stop of the sortable
                    this.instance._mouseStop(event);

                    this.instance.options.helper = this.instance.options._helper;

                    //If the helper has been the original item, restore properties in the sortable
                    if(inst.options.helper === "original") {
                        this.instance.currentItem.css({ top: "auto", left: "auto" });
                    }

                } else {
                    this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
                    this.instance._trigger("deactivate", event, uiSortable);
                }

            });

        },
        drag: function(event, ui) {

            var inst = $(this).data("ui-draggable"), that = this;

            $.each(inst.sortables, function() {

                var innermostIntersecting = false,
                    thisSortable = this;

                //Copy over some variables to allow calling the sortable's native _intersectsWith
                this.instance.positionAbs = inst.positionAbs;
                this.instance.helperProportions = inst.helperProportions;
                this.instance.offset.click = inst.offset.click;

                if(this.instance._intersectsWith(this.instance.containerCache)) {
                    innermostIntersecting = true;
                    $.each(inst.sortables, function () {
                        this.instance.positionAbs = inst.positionAbs;
                        this.instance.helperProportions = inst.helperProportions;
                        this.instance.offset.click = inst.offset.click;
                        if (this !== thisSortable &&
                            this.instance._intersectsWith(this.instance.containerCache) &&
                            $.contains(thisSortable.instance.element[0], this.instance.element[0])
                        ) {
                            innermostIntersecting = false;
                        }
                        return innermostIntersecting;
                    });
                }


                if(innermostIntersecting) {
                    //If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
                    if(!this.instance.isOver) {

                        this.instance.isOver = 1;
                        //Now we fake the start of dragging for the sortable instance,
                        //by cloning the list group item, appending it to the sortable and using it as inst.currentItem
                        //We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
                        this.instance.currentItem = $(that).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item", true);
                        this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
                        this.instance.options.helper = function() { return ui.helper[0]; };

                        event.target = this.instance.currentItem[0];
                        this.instance._mouseCapture(event, true);
                        this.instance._mouseStart(event, true, true);

                        //Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
                        this.instance.offset.click.top = inst.offset.click.top;
                        this.instance.offset.click.left = inst.offset.click.left;
                        this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
                        this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

                        inst._trigger("toSortable", event);
                        inst.dropped = this.instance.element; //draggable revert needs that
                        //hack so receive/update callbacks work (mostly)
                        inst.currentItem = inst.element;
                        this.instance.fromOutside = inst;

                    }

                    //Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
                    if(this.instance.currentItem) {
                        this.instance._mouseDrag(event);
                    }

                } else {

                    //If it doesn't intersect with the sortable, and it intersected before,
                    //we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
                    if(this.instance.isOver) {

                        this.instance.isOver = 0;
                        this.instance.cancelHelperRemoval = true;

                        //Prevent reverting on this forced stop
                        this.instance.options.revert = false;

                        // The out event needs to be triggered independently
                        this.instance._trigger("out", event, this.instance._uiHash(this.instance));

                        this.instance._mouseStop(event, true);
                        this.instance.options.helper = this.instance.options._helper;

                        //Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
                        this.instance.currentItem.remove();
                        if(this.instance.placeholder) {
                            this.instance.placeholder.remove();
                        }

                        inst._trigger("fromSortable", event);
                        inst.dropped = false; //draggable revert needs that
                    }

                }

            });

        }
    });

    $.ui.plugin.add("draggable", "cursor", {
        start: function() {
            var t = $("body"), o = $(this).data("ui-draggable").options;
            if (t.css("cursor")) {
                o._cursor = t.css("cursor");
            }
            t.css("cursor", o.cursor);
        },
        stop: function() {
            var o = $(this).data("ui-draggable").options;
            if (o._cursor) {
                $("body").css("cursor", o._cursor);
            }
        }
    });

    $.ui.plugin.add("draggable", "opacity", {
        start: function(event, ui) {
            var t = $(ui.helper), o = $(this).data("ui-draggable").options;
            if(t.css("opacity")) {
                o._opacity = t.css("opacity");
            }
            t.css("opacity", o.opacity);
        },
        stop: function(event, ui) {
            var o = $(this).data("ui-draggable").options;
            if(o._opacity) {
                $(ui.helper).css("opacity", o._opacity);
            }
        }
    });

    $.ui.plugin.add("draggable", "scroll", {
        start: function() {
            var i = $(this).data("ui-draggable");
            if(i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {
                i.overflowOffset = i.scrollParent.offset();
            }
        },
        drag: function( event ) {

            var i = $(this).data("ui-draggable"), o = i.options, scrolled = false;

            if(i.scrollParent[0] !== document && i.scrollParent[0].tagName !== "HTML") {

                if(!o.axis || o.axis !== "x") {
                    if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
                        i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
                    } else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity) {
                        i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
                    }
                }

                if(!o.axis || o.axis !== "y") {
                    if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
                        i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
                    } else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity) {
                        i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
                    }
                }

            } else {

                if(!o.axis || o.axis !== "x") {
                    if(event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
                        scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
                    } else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
                        scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
                    }
                }

                if(!o.axis || o.axis !== "y") {
                    if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
                        scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
                    } else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
                        scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
                    }
                }

            }

            if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
                $.ui.ddmanager.prepareOffsets(i, event);
            }

        }
    });

    $.ui.plugin.add("draggable", "snap", {
        start: function() {

            var i = $(this).data("ui-draggable"),
                o = i.options;

            i.snapElements = [];

            $(o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap).each(function() {
                var $t = $(this),
                    $o = $t.offset();
                if(this !== i.element[0]) {
                    i.snapElements.push({
                        item: this,
                        width: $t.outerWidth(), height: $t.outerHeight(),
                        top: $o.top, left: $o.left
                    });
                }
            });

        },
        drag: function(event, ui) {

            var ts, bs, ls, rs, l, r, t, b, i, first,
                inst = $(this).data("ui-draggable"),
                o = inst.options,
                d = o.snapTolerance,
                x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
                y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

            for (i = inst.snapElements.length - 1; i >= 0; i--){

                l = inst.snapElements[i].left;
                r = l + inst.snapElements[i].width;
                t = inst.snapElements[i].top;
                b = t + inst.snapElements[i].height;

                //Yes, I know, this is insane ;)
                if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
                    if(inst.snapElements[i].snapping) {
                        (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
                    }
                    inst.snapElements[i].snapping = false;
                    continue;
                }

                if(o.snapMode !== "inner") {
                    ts = Math.abs(t - y2) <= d;
                    bs = Math.abs(b - y1) <= d;
                    ls = Math.abs(l - x2) <= d;
                    rs = Math.abs(r - x1) <= d;
                    if(ts) {
                        ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
                    }
                    if(bs) {
                        ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
                    }
                    if(ls) {
                        ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
                    }
                    if(rs) {
                        ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
                    }
                }

                first = (ts || bs || ls || rs);

                if(o.snapMode !== "outer") {
                    ts = Math.abs(t - y1) <= d;
                    bs = Math.abs(b - y2) <= d;
                    ls = Math.abs(l - x1) <= d;
                    rs = Math.abs(r - x2) <= d;
                    if(ts) {
                        ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
                    }
                    if(bs) {
                        ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
                    }
                    if(ls) {
                        ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
                    }
                    if(rs) {
                        ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
                    }
                }

                if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
                    (inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
                }
                inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

            }

        }
    });

    $.ui.plugin.add("draggable", "stack", {
        start: function() {
            var min,
                o = this.data("ui-draggable").options,
                group = $.makeArray($(o.stack)).sort(function(a,b) {
                    return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
                });

            if (!group.length) { return; }

            min = parseInt($(group[0]).css("zIndex"), 10) || 0;
            $(group).each(function(i) {
                $(this).css("zIndex", min + i);
            });
            this.css("zIndex", (min + group.length));
        }
    });

    $.ui.plugin.add("draggable", "zIndex", {
        start: function(event, ui) {
            var t = $(ui.helper), o = $(this).data("ui-draggable").options;
            if(t.css("zIndex")) {
                o._zIndex = t.css("zIndex");
            }
            t.css("zIndex", o.zIndex);
        },
        stop: function(event, ui) {
            var o = $(this).data("ui-draggable").options;
            if(o._zIndex) {
                $(ui.helper).css("zIndex", o._zIndex);
            }
        }
    });

})(jQuery);
(function( $, undefined ) {

    function isOverAxis( x, reference, size ) {
        return ( x > reference ) && ( x < ( reference + size ) );
    }

    $.widget("ui.droppable", {
        version: "1.10.1",
        widgetEventPrefix: "drop",
        options: {
            accept: "*",
            activeClass: false,
            addClasses: true,
            greedy: false,
            hoverClass: false,
            scope: "default",
            tolerance: "intersect",

            // callbacks
            activate: null,
            deactivate: null,
            drop: null,
            out: null,
            over: null
        },
        _create: function() {

            var o = this.options,
                accept = o.accept;

            this.isover = false;
            this.isout = true;

            this.accept = $.isFunction(accept) ? accept : function(d) {
                return d.is(accept);
            };

            //Store the droppable's proportions
            this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

            // Add the reference and positions to the manager
            $.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
            $.ui.ddmanager.droppables[o.scope].push(this);

            (o.addClasses && this.element.addClass("ui-droppable"));

        },

        _destroy: function() {
            var i = 0,
                drop = $.ui.ddmanager.droppables[this.options.scope];

            for ( ; i < drop.length; i++ ) {
                if ( drop[i] === this ) {
                    drop.splice(i, 1);
                }
            }

            this.element.removeClass("ui-droppable ui-droppable-disabled");
        },

        _setOption: function(key, value) {

            if(key === "accept") {
                this.accept = $.isFunction(value) ? value : function(d) {
                    return d.is(value);
                };
            }
            $.Widget.prototype._setOption.apply(this, arguments);
        },

        _activate: function(event) {
            var draggable = $.ui.ddmanager.current;
            if(this.options.activeClass) {
                this.element.addClass(this.options.activeClass);
            }
            if(draggable){
                this._trigger("activate", event, this.ui(draggable));
            }
        },

        _deactivate: function(event) {
            var draggable = $.ui.ddmanager.current;
            if(this.options.activeClass) {
                this.element.removeClass(this.options.activeClass);
            }
            if(draggable){
                this._trigger("deactivate", event, this.ui(draggable));
            }
        },

        _over: function(event) {

            var draggable = $.ui.ddmanager.current;

            // Bail if draggable and droppable are same element
            if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
                return;
            }

            if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
                if(this.options.hoverClass) {
                    this.element.addClass(this.options.hoverClass);
                }
                this._trigger("over", event, this.ui(draggable));
            }

        },

        _out: function(event) {

            var draggable = $.ui.ddmanager.current;

            // Bail if draggable and droppable are same element
            if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
                return;
            }

            if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
                if(this.options.hoverClass) {
                    this.element.removeClass(this.options.hoverClass);
                }
                this._trigger("out", event, this.ui(draggable));
            }

        },

        _drop: function(event,custom) {

            var draggable = custom || $.ui.ddmanager.current,
                childrenIntersection = false;

            // Bail if draggable and droppable are same element
            if (!draggable || (draggable.currentItem || draggable.element)[0] === this.element[0]) {
                return false;
            }

            this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function() {
                var inst = $.data(this, "ui-droppable");
                if(
                    inst.options.greedy &&
                    !inst.options.disabled &&
                    inst.options.scope === draggable.options.scope &&
                    inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element)) &&
                    $.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance)
                ) { childrenIntersection = true; return false; }
            });
            if(childrenIntersection) {
                return false;
            }

            if(this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
                if(this.options.activeClass) {
                    this.element.removeClass(this.options.activeClass);
                }
                if(this.options.hoverClass) {
                    this.element.removeClass(this.options.hoverClass);
                }
                this._trigger("drop", event, this.ui(draggable));
                return this.element;
            }

            return false;

        },

        ui: function(c) {
            return {
                draggable: (c.currentItem || c.element),
                helper: c.helper,
                position: c.position,
                offset: c.positionAbs
            };
        }

    });

    $.ui.intersect = function(draggable, droppable, toleranceMode) {

        if (!droppable.offset) {
            return false;
        }

        var draggableLeft, draggableTop,
            x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
            y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height,
            l = droppable.offset.left, r = l + droppable.proportions.width,
            t = droppable.offset.top, b = t + droppable.proportions.height;

        switch (toleranceMode) {
            case "fit":
                return (l <= x1 && x2 <= r && t <= y1 && y2 <= b);
            case "intersect":
                return (l < x1 + (draggable.helperProportions.width / 2) && // Right Half
                x2 - (draggable.helperProportions.width / 2) < r && // Left Half
                t < y1 + (draggable.helperProportions.height / 2) && // Bottom Half
                y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
            case "pointer":
                draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left);
                draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top);
                return isOverAxis( draggableTop, t, droppable.proportions.height ) && isOverAxis( draggableLeft, l, droppable.proportions.width );
            case "touch":
                return (
                    (y1 >= t && y1 <= b) ||	// Top edge touching
                    (y2 >= t && y2 <= b) ||	// Bottom edge touching
                    (y1 < t && y2 > b)		// Surrounded vertically
                    ) && (
                    (x1 >= l && x1 <= r) ||	// Left edge touching
                    (x2 >= l && x2 <= r) ||	// Right edge touching
                    (x1 < l && x2 > r)		// Surrounded horizontally
                    );
            default:
                return false;
        }

    };

    /*
     This manager tracks offsets of draggables and droppables
     */
    $.ui.ddmanager = {
        current: null,
        droppables: { "default": [] },
        prepareOffsets: function(t, event) {

            var i, j,
                m = $.ui.ddmanager.droppables[t.options.scope] || [],
                type = event ? event.type : null, // workaround for #2317
                list = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();

            droppablesLoop: for (i = 0; i < m.length; i++) {

                //No disabled and non-accepted
                if(m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0],(t.currentItem || t.element)))) {
                    continue;
                }

                // Filter out elements in the current dragged item
                for (j=0; j < list.length; j++) {
                    if(list[j] === m[i].element[0]) {
                        m[i].proportions.height = 0;
                        continue droppablesLoop;
                    }
                }

                m[i].visible = m[i].element.css("display") !== "none";
                if(!m[i].visible) {
                    continue;
                }

                //Activate the droppable if used directly from draggables
                if(type === "mousedown") {
                    m[i]._activate.call(m[i], event);
                }

                m[i].offset = m[i].element.offset();
                m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

            }

        },
        drop: function(draggable, event) {

            var dropped = false;
            $.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

                if(!this.options) {
                    return;
                }
                if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance)) {
                    dropped = this._drop.call(this, event) || dropped;
                }

                if (!this.options.disabled && this.visible && this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
                    this.isout = true;
                    this.isover = false;
                    this._deactivate.call(this, event);
                }

            });
            return dropped;

        },
        dragStart: function( draggable, event ) {
            //Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
            draggable.element.parentsUntil( "body" ).bind( "scroll.droppable", function() {
                if( !draggable.options.refreshPositions ) {
                    $.ui.ddmanager.prepareOffsets( draggable, event );
                }
            });
        },
        drag: function(draggable, event) {

            //If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
            if(draggable.options.refreshPositions) {
                $.ui.ddmanager.prepareOffsets(draggable, event);
            }

            //Run through all droppables and check their positions based on specific tolerance options
            $.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

                if(this.options.disabled || this.greedyChild || !this.visible) {
                    return;
                }

                var parentInstance, scope, parent,
                    intersects = $.ui.intersect(draggable, this, this.options.tolerance),
                    c = !intersects && this.isover ? "isout" : (intersects && !this.isover ? "isover" : null);
                if(!c) {
                    return;
                }

                if (this.options.greedy) {
                    // find droppable parents with same scope
                    scope = this.options.scope;
                    parent = this.element.parents(":data(ui-droppable)").filter(function () {
                        return $.data(this, "ui-droppable").options.scope === scope;
                    });

                    if (parent.length) {
                        parentInstance = $.data(parent[0], "ui-droppable");
                        parentInstance.greedyChild = (c === "isover");
                    }
                }

                // we just moved into a greedy child
                if (parentInstance && c === "isover") {
                    parentInstance.isover = false;
                    parentInstance.isout = true;
                    parentInstance._out.call(parentInstance, event);
                }

                this[c] = true;
                this[c === "isout" ? "isover" : "isout"] = false;
                this[c === "isover" ? "_over" : "_out"].call(this, event);

                // we just moved out of a greedy child
                if (parentInstance && c === "isout") {
                    parentInstance.isout = false;
                    parentInstance.isover = true;
                    parentInstance._over.call(parentInstance, event);
                }
            });

        },
        dragStop: function( draggable, event ) {
            draggable.element.parentsUntil( "body" ).unbind( "scroll.droppable" );
            //Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
            if( !draggable.options.refreshPositions ) {
                $.ui.ddmanager.prepareOffsets( draggable, event );
            }
        }
    };

})(jQuery);
(function( $, undefined ) {

    /*jshint loopfunc: true */

    function isOverAxis( x, reference, size ) {
        return ( x > reference ) && ( x < ( reference + size ) );
    }

    $.widget("ui.sortable", $.ui.mouse, {
        version: "1.10.1",
        widgetEventPrefix: "sort",
        ready: false,
        options: {
            appendTo: "parent",
            axis: false,
            connectWith: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            dropOnEmpty: true,
            forcePlaceholderSize: false,
            forceHelperSize: false,
            grid: false,
            handle: false,
            helper: "original",
            items: "> *",
            opacity: false,
            placeholder: false,
            revert: false,
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1000,

            // callbacks
            activate: null,
            beforeStop: null,
            change: null,
            deactivate: null,
            out: null,
            over: null,
            receive: null,
            remove: null,
            sort: null,
            start: null,
            stop: null,
            update: null
        },
        _create: function() {

            var o = this.options;
            this.containerCache = {};
            this.element.addClass("ui-sortable");

            //Get the items
            this.refresh();

            //Let's determine if the items are being displayed horizontally
            this.floating = this.items.length ? o.axis === "x" || (/left|right/).test(this.items[0].item.css("float")) || (/inline|table-cell/).test(this.items[0].item.css("display")) : false;

            //Let's determine the parent's offset
            this.offset = this.element.offset();

            //Initialize mouse events for interaction
            this._mouseInit();

            //We're ready to go
            this.ready = true;

        },

        _destroy: function() {
            this.element
                .removeClass("ui-sortable ui-sortable-disabled");
            this._mouseDestroy();

            for ( var i = this.items.length - 1; i >= 0; i-- ) {
                this.items[i].item.removeData(this.widgetName + "-item");
            }

            return this;
        },

        _setOption: function(key, value){
            if ( key === "disabled" ) {
                this.options[ key ] = value;

                this.widget().toggleClass( "ui-sortable-disabled", !!value );
            } else {
                // Don't call widget base _setOption for disable as it adds ui-state-disabled class
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },

        _mouseCapture: function(event, overrideHandle) {
            var currentItem = null,
                validHandle = false,
                that = this;

            if (this.reverting) {
                return false;
            }

            if(this.options.disabled || this.options.type === "static") {
                return false;
            }

            //We have to refresh the items data once first
            this._refreshItems(event);

            //Find out if the clicked node (or one of its parents) is a actual item in this.items
            $(event.target).parents().each(function() {
                if($.data(this, that.widgetName + "-item") === that) {
                    currentItem = $(this);
                    return false;
                }
            });
            if($.data(event.target, that.widgetName + "-item") === that) {
                currentItem = $(event.target);
            }

            if(!currentItem) {
                return false;
            }
            if(this.options.handle && !overrideHandle) {
                $(this.options.handle, currentItem).find("*").addBack().each(function() {
                    if(this === event.target) {
                        validHandle = true;
                    }
                });
                if(!validHandle) {
                    return false;
                }
            }

            this.currentItem = currentItem;
            this._removeCurrentsFromItems();
            return true;

        },

        _mouseStart: function(event, overrideHandle, noActivation) {

            var i,
                o = this.options;

            this.currentContainer = this;

            //We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
            this.refreshPositions();

            //Create and append the visible helper
            this.helper = this._createHelper(event);

            //Cache the helper size
            this._cacheHelperProportions();

            /*
             * - Position generation -
             * This block generates everything position related - it's the core of draggables.
             */

            //Cache the margins of the original element
            this._cacheMargins();

            //Get the next scrolling parent
            this.scrollParent = this.helper.scrollParent();

            //The element's absolute position on the page minus margins
            this.offset = this.currentItem.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };

            $.extend(this.offset, {
                click: { //Where the click happened, relative to the element
                    left: event.pageX - this.offset.left,
                    top: event.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
            });

            // Only after we got the offset, we can change the helper's position to absolute
            // TODO: Still need to figure out a way to make relative sorting possible
            this.helper.css("position", "absolute");
            this.cssPosition = this.helper.css("position");

            //Generate the original position
            this.originalPosition = this._generatePosition(event);
            this.originalPageX = event.pageX;
            this.originalPageY = event.pageY;

            //Adjust the mouse offset relative to the helper if "cursorAt" is supplied
            (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

            //Cache the former DOM position
            this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

            //If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
            if(this.helper[0] !== this.currentItem[0]) {
                this.currentItem.hide();
            }

            //Create the placeholder
            this._createPlaceholder();

            //Set a containment if given in the options
            if(o.containment) {
                this._setContainment();
            }

            if(o.cursor) { // cursor option
                if ($("body").css("cursor")) {
                    this._storedCursor = $("body").css("cursor");
                }
                $("body").css("cursor", o.cursor);
            }

            if(o.opacity) { // opacity option
                if (this.helper.css("opacity")) {
                    this._storedOpacity = this.helper.css("opacity");
                }
                this.helper.css("opacity", o.opacity);
            }

            if(o.zIndex) { // zIndex option
                if (this.helper.css("zIndex")) {
                    this._storedZIndex = this.helper.css("zIndex");
                }
                this.helper.css("zIndex", o.zIndex);
            }

            //Prepare scrolling
            if(this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {
                this.overflowOffset = this.scrollParent.offset();
            }

            //Call callbacks
            this._trigger("start", event, this._uiHash());

            //Recache the helper size
            if(!this._preserveHelperProportions) {
                this._cacheHelperProportions();
            }


            //Post "activate" events to possible containers
            if( !noActivation ) {
                for ( i = this.containers.length - 1; i >= 0; i-- ) {
                    this.containers[ i ]._trigger( "activate", event, this._uiHash( this ) );
                }
            }

            //Prepare possible droppables
            if($.ui.ddmanager) {
                $.ui.ddmanager.current = this;
            }

            if ($.ui.ddmanager && !o.dropBehaviour) {
                $.ui.ddmanager.prepareOffsets(this, event);
            }

            this.dragging = true;

            this.helper.addClass("ui-sortable-helper");
            this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
            return true;

        },

        _mouseDrag: function(event) {
            var i, item, itemElement, intersection,
                o = this.options,
                scrolled = false;

            //Compute the helpers position
            this.position = this._generatePosition(event);
            this.positionAbs = this._convertPositionTo("absolute");

            if (!this.lastPositionAbs) {
                this.lastPositionAbs = this.positionAbs;
            }

            //Do scrolling
            if(this.options.scroll) {
                if(this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {

                    if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
                        this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
                    } else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
                        this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
                    }

                    if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
                        this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
                    } else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
                        this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
                    }

                } else {

                    if(event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
                        scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
                    } else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
                        scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
                    }

                    if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
                        scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
                    } else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
                        scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
                    }

                }

                if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
                    $.ui.ddmanager.prepareOffsets(this, event);
                }
            }

            //Regenerate the absolute position used for position checks
            this.positionAbs = this._convertPositionTo("absolute");

            //Set the helper position
            if(!this.options.axis || this.options.axis !== "y") {
                this.helper[0].style.left = this.position.left+"px";
            }
            if(!this.options.axis || this.options.axis !== "x") {
                this.helper[0].style.top = this.position.top+"px";
            }

            //Rearrange
            for (i = this.items.length - 1; i >= 0; i--) {

                //Cache variables and intersection, continue if no intersection
                item = this.items[i];
                itemElement = item.item[0];
                intersection = this._intersectsWithPointer(item);
                if (!intersection) {
                    continue;
                }

                // Only put the placeholder inside the current Container, skip all
                // items form other containers. This works because when moving
                // an item from one container to another the
                // currentContainer is switched before the placeholder is moved.
                //
                // Without this moving items in "sub-sortables" can cause the placeholder to jitter
                // beetween the outer and inner container.
                if (item.instance !== this.currentContainer) {
                    continue;
                }

                // cannot intersect with itself
                // no useless actions that have been done before
                // no action if the item moved is the parent of the item checked
                if (itemElement !== this.currentItem[0] &&
                    this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement &&
                    !$.contains(this.placeholder[0], itemElement) &&
                    (this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)
                ) {

                    this.direction = intersection === 1 ? "down" : "up";

                    if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
                        this._rearrange(event, item);
                    } else {
                        break;
                    }

                    this._trigger("change", event, this._uiHash());
                    break;
                }
            }

            //Post events to containers
            this._contactContainers(event);

            //Interconnect with droppables
            if($.ui.ddmanager) {
                $.ui.ddmanager.drag(this, event);
            }

            //Call callbacks
            this._trigger("sort", event, this._uiHash());

            this.lastPositionAbs = this.positionAbs;
            return false;

        },

        _mouseStop: function(event, noPropagation) {

            if(!event) {
                return;
            }

            //If we are using droppables, inform the manager about the drop
            if ($.ui.ddmanager && !this.options.dropBehaviour) {
                $.ui.ddmanager.drop(this, event);
            }

            if(this.options.revert) {
                var that = this,
                    cur = this.placeholder.offset();

                this.reverting = true;

                $(this.helper).animate({
                    left: cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft),
                    top: cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop)
                }, parseInt(this.options.revert, 10) || 500, function() {
                    that._clear(event);
                });
            } else {
                this._clear(event, noPropagation);
            }

            return false;

        },

        cancel: function() {

            if(this.dragging) {

                this._mouseUp({ target: null });

                if(this.options.helper === "original") {
                    this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
                } else {
                    this.currentItem.show();
                }

                //Post deactivating events to containers
                for (var i = this.containers.length - 1; i >= 0; i--){
                    this.containers[i]._trigger("deactivate", null, this._uiHash(this));
                    if(this.containers[i].containerCache.over) {
                        this.containers[i]._trigger("out", null, this._uiHash(this));
                        this.containers[i].containerCache.over = 0;
                    }
                }

            }

            if (this.placeholder) {
                //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
                if(this.placeholder[0].parentNode) {
                    this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
                }
                if(this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
                    this.helper.remove();
                }

                $.extend(this, {
                    helper: null,
                    dragging: false,
                    reverting: false,
                    _noFinalSort: null
                });

                if(this.domPosition.prev) {
                    $(this.domPosition.prev).after(this.currentItem);
                } else {
                    $(this.domPosition.parent).prepend(this.currentItem);
                }
            }

            return this;

        },

        serialize: function(o) {

            var items = this._getItemsAsjQuery(o && o.connected),
                str = [];
            o = o || {};

            $(items).each(function() {
                var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || (/(.+)[\-=_](.+)/));
                if (res) {
                    str.push((o.key || res[1]+"[]")+"="+(o.key && o.expression ? res[1] : res[2]));
                }
            });

            if(!str.length && o.key) {
                str.push(o.key + "=");
            }

            return str.join("&");

        },

        toArray: function(o) {

            var items = this._getItemsAsjQuery(o && o.connected),
                ret = [];

            o = o || {};

            items.each(function() { ret.push($(o.item || this).attr(o.attribute || "id") || ""); });
            return ret;

        },

        /* Be careful with the following core functions */
        _intersectsWith: function(item) {

            var x1 = this.positionAbs.left,
                x2 = x1 + this.helperProportions.width,
                y1 = this.positionAbs.top,
                y2 = y1 + this.helperProportions.height,
                l = item.left,
                r = l + item.width,
                t = item.top,
                b = t + item.height,
                dyClick = this.offset.click.top,
                dxClick = this.offset.click.left,
                isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;

            if ( this.options.tolerance === "pointer" ||
                this.options.forcePointerForContainers ||
                (this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"])
            ) {
                return isOverElement;
            } else {

                return (l < x1 + (this.helperProportions.width / 2) && // Right Half
                x2 - (this.helperProportions.width / 2) < r && // Left Half
                t < y1 + (this.helperProportions.height / 2) && // Bottom Half
                y2 - (this.helperProportions.height / 2) < b ); // Top Half

            }
        },

        _intersectsWithPointer: function(item) {

            var isOverElementHeight = (this.options.axis === "x") || isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
                isOverElementWidth = (this.options.axis === "y") || isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
                isOverElement = isOverElementHeight && isOverElementWidth,
                verticalDirection = this._getDragVerticalDirection(),
                horizontalDirection = this._getDragHorizontalDirection();

            if (!isOverElement) {
                return false;
            }

            return this.floating ?
                ( ((horizontalDirection && horizontalDirection === "right") || verticalDirection === "down") ? 2 : 1 )
                : ( verticalDirection && (verticalDirection === "down" ? 2 : 1) );

        },

        _intersectsWithSides: function(item) {

            var isOverBottomHalf = isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
                isOverRightHalf = isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
                verticalDirection = this._getDragVerticalDirection(),
                horizontalDirection = this._getDragHorizontalDirection();

            if (this.floating && horizontalDirection) {
                return ((horizontalDirection === "right" && isOverRightHalf) || (horizontalDirection === "left" && !isOverRightHalf));
            } else {
                return verticalDirection && ((verticalDirection === "down" && isOverBottomHalf) || (verticalDirection === "up" && !isOverBottomHalf));
            }

        },

        _getDragVerticalDirection: function() {
            var delta = this.positionAbs.top - this.lastPositionAbs.top;
            return delta !== 0 && (delta > 0 ? "down" : "up");
        },

        _getDragHorizontalDirection: function() {
            var delta = this.positionAbs.left - this.lastPositionAbs.left;
            return delta !== 0 && (delta > 0 ? "right" : "left");
        },

        refresh: function(event) {
            this._refreshItems(event);
            this.refreshPositions();
            return this;
        },

        _connectWith: function() {
            var options = this.options;
            return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
        },

        _getItemsAsjQuery: function(connected) {

            var i, j, cur, inst,
                items = [],
                queries = [],
                connectWith = this._connectWith();

            if(connectWith && connected) {
                for (i = connectWith.length - 1; i >= 0; i--){
                    cur = $(connectWith[i]);
                    for ( j = cur.length - 1; j >= 0; j--){
                        inst = $.data(cur[j], this.widgetFullName);
                        if(inst && inst !== this && !inst.options.disabled) {
                            queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
                        }
                    }
                }
            }

            queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

            for (i = queries.length - 1; i >= 0; i--){
                queries[i][0].each(function() {
                    items.push(this);
                });
            }

            return $(items);

        },

        _removeCurrentsFromItems: function() {

            var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

            this.items = $.grep(this.items, function (item) {
                for (var j=0; j < list.length; j++) {
                    if(list[j] === item.item[0]) {
                        return false;
                    }
                }
                return true;
            });

        },

        _refreshItems: function(event) {

            this.items = [];
            this.containers = [this];

            var i, j, cur, inst, targetData, _queries, item, queriesLength,
                items = this.items,
                queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]],
                connectWith = this._connectWith();

            if(connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
                for (i = connectWith.length - 1; i >= 0; i--){
                    cur = $(connectWith[i]);
                    for (j = cur.length - 1; j >= 0; j--){
                        inst = $.data(cur[j], this.widgetFullName);
                        if(inst && inst !== this && !inst.options.disabled) {
                            queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
                            this.containers.push(inst);
                        }
                    }
                }
            }

            for (i = queries.length - 1; i >= 0; i--) {
                targetData = queries[i][1];
                _queries = queries[i][0];

                for (j=0, queriesLength = _queries.length; j < queriesLength; j++) {
                    item = $(_queries[j]);

                    item.data(this.widgetName + "-item", targetData); // Data for target checking (mouse manager)

                    items.push({
                        item: item,
                        instance: targetData,
                        width: 0, height: 0,
                        left: 0, top: 0
                    });
                }
            }

        },

        refreshPositions: function(fast) {

            //This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
            if(this.offsetParent && this.helper) {
                this.offset.parent = this._getParentOffset();
            }

            var i, item, t, p;

            for (i = this.items.length - 1; i >= 0; i--){
                item = this.items[i];

                //We ignore calculating positions of all connected containers when we're not over them
                if(item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
                    continue;
                }

                t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

                if (!fast) {
                    item.width = t.outerWidth();
                    item.height = t.outerHeight();
                }

                p = t.offset();
                item.left = p.left;
                item.top = p.top;
            }

            if(this.options.custom && this.options.custom.refreshContainers) {
                this.options.custom.refreshContainers.call(this);
            } else {
                for (i = this.containers.length - 1; i >= 0; i--){
                    p = this.containers[i].element.offset();
                    this.containers[i].containerCache.left = p.left;
                    this.containers[i].containerCache.top = p.top;
                    this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
                    this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
                }
            }

            return this;
        },

        _createPlaceholder: function(that) {
            that = that || this;
            var className,
                o = that.options;

            if(!o.placeholder || o.placeholder.constructor === String) {
                className = o.placeholder;
                o.placeholder = {
                    element: function() {

                        var el = $(document.createElement(that.currentItem[0].nodeName))
                            .addClass(className || that.currentItem[0].className+" ui-sortable-placeholder")
                            .removeClass("ui-sortable-helper")[0];

                        if(!className) {
                            el.style.visibility = "hidden";
                        }

                        return el;
                    },
                    update: function(container, p) {

                        // 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
                        // 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
                        if(className && !o.forcePlaceholderSize) {
                            return;
                        }

                        //If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
                        if(!p.height()) { p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop")||0, 10) - parseInt(that.currentItem.css("paddingBottom")||0, 10)); }
                        if(!p.width()) { p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft")||0, 10) - parseInt(that.currentItem.css("paddingRight")||0, 10)); }
                    }
                };
            }

            //Create the placeholder
            that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

            //Append it after the actual current item
            that.currentItem.after(that.placeholder);

            //Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
            o.placeholder.update(that, that.placeholder);

        },

        _contactContainers: function(event) {
            var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, base, cur, nearBottom,
                innermostContainer = null,
                innermostIndex = null;

            // get innermost container that intersects with item
            for (i = this.containers.length - 1; i >= 0; i--) {

                // never consider a container that's located within the item itself
                if($.contains(this.currentItem[0], this.containers[i].element[0])) {
                    continue;
                }

                if(this._intersectsWith(this.containers[i].containerCache)) {

                    // if we've already found a container and it's more "inner" than this, then continue
                    if(innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
                        continue;
                    }

                    innermostContainer = this.containers[i];
                    innermostIndex = i;

                } else {
                    // container doesn't intersect. trigger "out" event if necessary
                    if(this.containers[i].containerCache.over) {
                        this.containers[i]._trigger("out", event, this._uiHash(this));
                        this.containers[i].containerCache.over = 0;
                    }
                }

            }

            // if no intersecting containers found, return
            if(!innermostContainer) {
                return;
            }

            // move the item into the container if it's not there already
            if(this.containers.length === 1) {
                this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
                this.containers[innermostIndex].containerCache.over = 1;
            } else {

                //When entering a new container, we will find the item with the least distance and append our item near it
                dist = 10000;
                itemWithLeastDistance = null;
                posProperty = this.containers[innermostIndex].floating ? "left" : "top";
                sizeProperty = this.containers[innermostIndex].floating ? "width" : "height";
                base = this.positionAbs[posProperty] + this.offset.click[posProperty];
                for (j = this.items.length - 1; j >= 0; j--) {
                    if(!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
                        continue;
                    }
                    if(this.items[j].item[0] === this.currentItem[0]) {
                        continue;
                    }
                    cur = this.items[j].item.offset()[posProperty];
                    nearBottom = false;
                    if(Math.abs(cur - base) > Math.abs(cur + this.items[j][sizeProperty] - base)){
                        nearBottom = true;
                        cur += this.items[j][sizeProperty];
                    }

                    if(Math.abs(cur - base) < dist) {
                        dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j];
                        this.direction = nearBottom ? "up": "down";
                    }
                }

                //Check if dropOnEmpty is enabled
                if(!itemWithLeastDistance && !this.options.dropOnEmpty) {
                    return;
                }

                this.currentContainer = this.containers[innermostIndex];
                itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
                this._trigger("change", event, this._uiHash());
                this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));

                //Update the placeholder
                this.options.placeholder.update(this.currentContainer, this.placeholder);

                this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
                this.containers[innermostIndex].containerCache.over = 1;
            }


        },

        _createHelper: function(event) {

            var o = this.options,
                helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper === "clone" ? this.currentItem.clone() : this.currentItem);

            //Add the helper to the DOM if that didn't happen already
            if(!helper.parents("body").length) {
                $(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
            }

            if(helper[0] === this.currentItem[0]) {
                this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };
            }

            if(!helper[0].style.width || o.forceHelperSize) {
                helper.width(this.currentItem.width());
            }
            if(!helper[0].style.height || o.forceHelperSize) {
                helper.height(this.currentItem.height());
            }

            return helper;

        },

        _adjustOffsetFromHelper: function(obj) {
            if (typeof obj === "string") {
                obj = obj.split(" ");
            }
            if ($.isArray(obj)) {
                obj = {left: +obj[0], top: +obj[1] || 0};
            }
            if ("left" in obj) {
                this.offset.click.left = obj.left + this.margins.left;
            }
            if ("right" in obj) {
                this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
            }
            if ("top" in obj) {
                this.offset.click.top = obj.top + this.margins.top;
            }
            if ("bottom" in obj) {
                this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
            }
        },

        _getParentOffset: function() {


            //Get the offsetParent and cache its position
            this.offsetParent = this.helper.offsetParent();
            var po = this.offsetParent.offset();

            // This is a special case where we need to modify a offset calculated on start, since the following happened:
            // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
            // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
            //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
            if(this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
                po.left += this.scrollParent.scrollLeft();
                po.top += this.scrollParent.scrollTop();
            }

            // This needs to be actually done for all browsers, since pageX/pageY includes this information
            // with an ugly IE fix
            if( this.offsetParent[0] === document.body || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
                po = { top: 0, left: 0 };
            }

            return {
                top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
                left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
            };

        },

        _getRelativeOffset: function() {

            if(this.cssPosition === "relative") {
                var p = this.currentItem.position();
                return {
                    top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
                    left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
                };
            } else {
                return { top: 0, left: 0 };
            }

        },

        _cacheMargins: function() {
            this.margins = {
                left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
                top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
            };
        },

        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            };
        },

        _setContainment: function() {

            var ce, co, over,
                o = this.options;
            if(o.containment === "parent") {
                o.containment = this.helper[0].parentNode;
            }
            if(o.containment === "document" || o.containment === "window") {
                this.containment = [
                    0 - this.offset.relative.left - this.offset.parent.left,
                    0 - this.offset.relative.top - this.offset.parent.top,
                    $(o.containment === "document" ? document : window).width() - this.helperProportions.width - this.margins.left,
                    ($(o.containment === "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
                ];
            }

            if(!(/^(document|window|parent)$/).test(o.containment)) {
                ce = $(o.containment)[0];
                co = $(o.containment).offset();
                over = ($(ce).css("overflow") !== "hidden");

                this.containment = [
                    co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
                    co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
                    co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
                    co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
                ];
            }

        },

        _convertPositionTo: function(d, pos) {

            if(!pos) {
                pos = this.position;
            }
            var mod = d === "absolute" ? 1 : -1,
                scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

            return {
                top: (
                pos.top	+																// The absolute mouse position
                this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
                this.offset.parent.top * mod -											// The offsetParent's offset without borders (offset + border)
                ( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
                ),
                left: (
                pos.left +																// The absolute mouse position
                this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
                this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
                ( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
                )
            };

        },

        _generatePosition: function(event) {

            var top, left,
                o = this.options,
                pageX = event.pageX,
                pageY = event.pageY,
                scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

            // This is another very weird special case that only happens for relative elements:
            // 1. If the css position is relative
            // 2. and the scroll parent is the document or similar to the offset parent
            // we have to refresh the relative offset during the scroll so there are no jumps
            if(this.cssPosition === "relative" && !(this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0])) {
                this.offset.relative = this._getRelativeOffset();
            }

            /*
             * - Position constraining -
             * Constrain the position to a mix of grid, containment.
             */

            if(this.originalPosition) { //If we are not dragging yet, we won't check for options

                if(this.containment) {
                    if(event.pageX - this.offset.click.left < this.containment[0]) {
                        pageX = this.containment[0] + this.offset.click.left;
                    }
                    if(event.pageY - this.offset.click.top < this.containment[1]) {
                        pageY = this.containment[1] + this.offset.click.top;
                    }
                    if(event.pageX - this.offset.click.left > this.containment[2]) {
                        pageX = this.containment[2] + this.offset.click.left;
                    }
                    if(event.pageY - this.offset.click.top > this.containment[3]) {
                        pageY = this.containment[3] + this.offset.click.top;
                    }
                }

                if(o.grid) {
                    top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
                    pageY = this.containment ? ( (top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3]) ? top : ((top - this.offset.click.top >= this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

                    left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
                    pageX = this.containment ? ( (left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2]) ? left : ((left - this.offset.click.left >= this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
                }

            }

            return {
                top: (
                pageY -																// The absolute mouse position
                this.offset.click.top -													// Click offset (relative to the element)
                this.offset.relative.top	-											// Only for relative positioned nodes: Relative offset from element to offset parent
                this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
                ( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
                ),
                left: (
                pageX -																// The absolute mouse position
                this.offset.click.left -												// Click offset (relative to the element)
                this.offset.relative.left	-											// Only for relative positioned nodes: Relative offset from element to offset parent
                this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
                ( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
                )
            };

        },

        _rearrange: function(event, i, a, hardRefresh) {

            a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction === "down" ? i.item[0] : i.item[0].nextSibling));

            //Various things done here to improve the performance:
            // 1. we create a setTimeout, that calls refreshPositions
            // 2. on the instance, we have a counter variable, that get's higher after every append
            // 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
            // 4. this lets only the last addition to the timeout stack through
            this.counter = this.counter ? ++this.counter : 1;
            var counter = this.counter;

            this._delay(function() {
                if(counter === this.counter) {
                    this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
                }
            });

        },

        _clear: function(event, noPropagation) {

            this.reverting = false;
            // We delay all events that have to be triggered to after the point where the placeholder has been removed and
            // everything else normalized again
            var i,
                delayedTriggers = [];

            // We first have to update the dom position of the actual currentItem
            // Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
            if(!this._noFinalSort && this.currentItem.parent().length) {
                this.placeholder.before(this.currentItem);
            }
            this._noFinalSort = null;

            if(this.helper[0] === this.currentItem[0]) {
                for(i in this._storedCSS) {
                    if(this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
                        this._storedCSS[i] = "";
                    }
                }
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
            } else {
                this.currentItem.show();
            }

            if(this.fromOutside && !noPropagation) {
                delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
            }
            if((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
                delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
            }

            // Check if the items Container has Changed and trigger appropriate
            // events.
            if (this !== this.currentContainer) {
                if(!noPropagation) {
                    delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
                    delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.currentContainer));
                    delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.currentContainer));
                }
            }


            //Post events to containers
            for (i = this.containers.length - 1; i >= 0; i--){
                if(!noPropagation) {
                    delayedTriggers.push((function(c) { return function(event) { c._trigger("deactivate", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
                }
                if(this.containers[i].containerCache.over) {
                    delayedTriggers.push((function(c) { return function(event) { c._trigger("out", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
                    this.containers[i].containerCache.over = 0;
                }
            }

            //Do what was originally in plugins
            if(this._storedCursor) {
                $("body").css("cursor", this._storedCursor);
            }
            if(this._storedOpacity) {
                this.helper.css("opacity", this._storedOpacity);
            }
            if(this._storedZIndex) {
                this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
            }

            this.dragging = false;
            if(this.cancelHelperRemoval) {
                if(!noPropagation) {
                    this._trigger("beforeStop", event, this._uiHash());
                    for (i=0; i < delayedTriggers.length; i++) {
                        delayedTriggers[i].call(this, event);
                    } //Trigger all delayed events
                    this._trigger("stop", event, this._uiHash());
                }

                this.fromOutside = false;
                return false;
            }

            if(!noPropagation) {
                this._trigger("beforeStop", event, this._uiHash());
            }

            //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
            this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

            if(this.helper[0] !== this.currentItem[0]) {
                this.helper.remove();
            }
            this.helper = null;

            if(!noPropagation) {
                for (i=0; i < delayedTriggers.length; i++) {
                    delayedTriggers[i].call(this, event);
                } //Trigger all delayed events
                this._trigger("stop", event, this._uiHash());
            }

            this.fromOutside = false;
            return true;

        },

        _trigger: function() {
            if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
                this.cancel();
            }
        },

        _uiHash: function(_inst) {
            var inst = _inst || this;
            return {
                helper: inst.helper,
                placeholder: inst.placeholder || $([]),
                position: inst.position,
                originalPosition: inst.originalPosition,
                offset: inst.positionAbs,
                item: inst.currentItem,
                sender: _inst ? _inst.element : null
            };
        }

    });

})(jQuery);
(function( $, undefined ) {

// used to prevent race conditions with remote data sources
    var requestIndex = 0;

    $.widget( "ui.autocomplete", {
        version: "1.10.1",
        defaultElement: "<input>",
        options: {
            appendTo: null,
            autoFocus: false,
            delay: 300,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null,

            // callbacks
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null
        },

        pending: 0,

        _create: function() {
            // Some browsers only repeat keydown events, not keypress events,
            // so we use the suppressKeyPress flag to determine if we've already
            // handled the keydown event. #7269
            // Unfortunately the code for & in keypress is the same as the up arrow,
            // so we use the suppressKeyPressRepeat flag to avoid handling keypress
            // events when we know the keydown event was used to modify the
            // search term. #7799
            var suppressKeyPress, suppressKeyPressRepeat, suppressInput,
                nodeName = this.element[0].nodeName.toLowerCase(),
                isTextarea = nodeName === "textarea",
                isInput = nodeName === "input";

            this.isMultiLine =
                // Textareas are always multi-line
                isTextarea ? true :
                    // Inputs are always single-line, even if inside a contentEditable element
                    // IE also treats inputs as contentEditable
                    isInput ? false :
                        // All other element types are determined by whether or not they're contentEditable
                        this.element.prop( "isContentEditable" );

            this.valueMethod = this.element[ isTextarea || isInput ? "val" : "text" ];
            this.isNewMenu = true;

            this.element
                .addClass( "ui-autocomplete-input" )
                .attr( "autocomplete", "off" );

            this._on( this.element, {
                keydown: function( event ) {
                    /*jshint maxcomplexity:15*/
                    if ( this.element.prop( "readOnly" ) ) {
                        suppressKeyPress = true;
                        suppressInput = true;
                        suppressKeyPressRepeat = true;
                        return;
                    }

                    suppressKeyPress = false;
                    suppressInput = false;
                    suppressKeyPressRepeat = false;
                    var keyCode = $.ui.keyCode;
                    switch( event.keyCode ) {
                        case keyCode.PAGE_UP:
                            suppressKeyPress = true;
                            this._move( "previousPage", event );
                            break;
                        case keyCode.PAGE_DOWN:
                            suppressKeyPress = true;
                            this._move( "nextPage", event );
                            break;
                        case keyCode.UP:
                            suppressKeyPress = true;
                            this._keyEvent( "previous", event );
                            break;
                        case keyCode.DOWN:
                            suppressKeyPress = true;
                            this._keyEvent( "next", event );
                            break;
                        case keyCode.ENTER:
                        case keyCode.NUMPAD_ENTER:
                            // when menu is open and has focus
                            if ( this.menu.active ) {
                                // #6055 - Opera still allows the keypress to occur
                                // which causes forms to submit
                                suppressKeyPress = true;
                                event.preventDefault();
                                this.menu.select( event );
                            }
                            break;
                        case keyCode.TAB:
                            if ( this.menu.active ) {
                                this.menu.select( event );
                            }
                            break;
                        case keyCode.ESCAPE:
                            if ( this.menu.element.is( ":visible" ) ) {
                                this._value( this.term );
                                this.close( event );
                                // Different browsers have different default behavior for escape
                                // Single press can mean undo or clear
                                // Double press in IE means clear the whole form
                                event.preventDefault();
                            }
                            break;
                        default:
                            suppressKeyPressRepeat = true;
                            // search timeout should be triggered before the input value is changed
                            this._searchTimeout( event );
                            break;
                    }
                },
                keypress: function( event ) {
                    if ( suppressKeyPress ) {
                        suppressKeyPress = false;
                        event.preventDefault();
                        return;
                    }
                    if ( suppressKeyPressRepeat ) {
                        return;
                    }

                    // replicate some key handlers to allow them to repeat in Firefox and Opera
                    var keyCode = $.ui.keyCode;
                    switch( event.keyCode ) {
                        case keyCode.PAGE_UP:
                            this._move( "previousPage", event );
                            break;
                        case keyCode.PAGE_DOWN:
                            this._move( "nextPage", event );
                            break;
                        case keyCode.UP:
                            this._keyEvent( "previous", event );
                            break;
                        case keyCode.DOWN:
                            this._keyEvent( "next", event );
                            break;
                    }
                },
                input: function( event ) {
                    if ( suppressInput ) {
                        suppressInput = false;
                        event.preventDefault();
                        return;
                    }
                    this._searchTimeout( event );
                },
                focus: function() {
                    this.selectedItem = null;
                    this.previous = this._value();
                },
                blur: function( event ) {
                    if ( this.cancelBlur ) {
                        delete this.cancelBlur;
                        return;
                    }

                    clearTimeout( this.searching );
                    this.close( event );
                    this._change( event );
                }
            });

            this._initSource();
            this.menu = $( "<ul>" )
                .addClass( "ui-autocomplete ui-front" )
                .appendTo( this._appendTo() )
                .menu({
                    // custom key handling for now
                    input: $(),
                    // disable ARIA support, the live region takes care of that
                    role: null
                })
                .hide()
                .data( "ui-menu" );

            this._on( this.menu.element, {
                mousedown: function( event ) {
                    // prevent moving focus out of the text field
                    event.preventDefault();

                    // IE doesn't prevent moving focus even with event.preventDefault()
                    // so we set a flag to know when we should ignore the blur event
                    this.cancelBlur = true;
                    this._delay(function() {
                        delete this.cancelBlur;
                    });

                    // clicking on the scrollbar causes focus to shift to the body
                    // but we can't detect a mouseup or a click immediately afterward
                    // so we have to track the next mousedown and close the menu if
                    // the user clicks somewhere outside of the autocomplete
                    var menuElement = this.menu.element[ 0 ];
                    if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
                        this._delay(function() {
                            var that = this;
                            this.document.one( "mousedown", function( event ) {
                                if ( event.target !== that.element[ 0 ] &&
                                    event.target !== menuElement &&
                                    !$.contains( menuElement, event.target ) ) {
                                    that.close();
                                }
                            });
                        });
                    }
                },
                menufocus: function( event, ui ) {
                    // #7024 - Prevent accidental activation of menu items in Firefox
                    if ( this.isNewMenu ) {
                        this.isNewMenu = false;
                        if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
                            this.menu.blur();

                            this.document.one( "mousemove", function() {
                                $( event.target ).trigger( event.originalEvent );
                            });

                            return;
                        }
                    }

                    var item = ui.item.data( "ui-autocomplete-item" );
                    if ( false !== this._trigger( "focus", event, { item: item } ) ) {
                        // use value to match what will end up in the input, if it was a key event
                        if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
                            this._value( item.value );
                        }
                    } else {
                        // Normally the input is populated with the item's value as the
                        // menu is navigated, causing screen readers to notice a change and
                        // announce the item. Since the focus event was canceled, this doesn't
                        // happen, so we update the live region so that screen readers can
                        // still notice the change and announce it.
                        this.liveRegion.text( item.value );
                    }
                },
                menuselect: function( event, ui ) {
                    var item = ui.item.data( "ui-autocomplete-item" ),
                        previous = this.previous;

                    // only trigger when focus was lost (click on menu)
                    if ( this.element[0] !== this.document[0].activeElement ) {
                        this.element.focus();
                        this.previous = previous;
                        // #6109 - IE triggers two focus events and the second
                        // is asynchronous, so we need to reset the previous
                        // term synchronously and asynchronously :-(
                        this._delay(function() {
                            this.previous = previous;
                            this.selectedItem = item;
                        });
                    }

                    if ( false !== this._trigger( "select", event, { item: item } ) ) {
                        this._value( item.value );
                    }
                    // reset the term after the select event
                    // this allows custom select handling to work properly
                    this.term = this._value();

                    this.close( event );
                    this.selectedItem = item;
                }
            });

            this.liveRegion = $( "<span>", {
                role: "status",
                "aria-live": "polite"
            })
                .addClass( "ui-helper-hidden-accessible" )
                .insertAfter( this.element );

            // turning off autocomplete prevents the browser from remembering the
            // value when navigating through history, so we re-enable autocomplete
            // if the page is unloaded before the widget is destroyed. #7790
            this._on( this.window, {
                beforeunload: function() {
                    this.element.removeAttr( "autocomplete" );
                }
            });
        },

        _destroy: function() {
            clearTimeout( this.searching );
            this.element
                .removeClass( "ui-autocomplete-input" )
                .removeAttr( "autocomplete" );
            this.menu.element.remove();
            this.liveRegion.remove();
        },

        _setOption: function( key, value ) {
            this._super( key, value );
            if ( key === "source" ) {
                this._initSource();
            }
            if ( key === "appendTo" ) {
                this.menu.element.appendTo( this._appendTo() );
            }
            if ( key === "disabled" && value && this.xhr ) {
                this.xhr.abort();
            }
        },

        _appendTo: function() {
            var element = this.options.appendTo;

            if ( element ) {
                element = element.jquery || element.nodeType ?
                    $( element ) :
                    this.document.find( element ).eq( 0 );
            }

            if ( !element ) {
                element = this.element.closest( ".ui-front" );
            }

            if ( !element.length ) {
                element = this.document[0].body;
            }

            return element;
        },

        _initSource: function() {
            var array, url,
                that = this;
            if ( $.isArray(this.options.source) ) {
                array = this.options.source;
                this.source = function( request, response ) {
                    response( $.ui.autocomplete.filter( array, request.term ) );
                };
            } else if ( typeof this.options.source === "string" ) {
                url = this.options.source;
                this.source = function( request, response ) {
                    if ( that.xhr ) {
                        that.xhr.abort();
                    }
                    that.xhr = $.ajax({
                        url: url,
                        data: request,
                        dataType: "json",
                        success: function( data ) {
                            response( data );
                        },
                        error: function() {
                            response( [] );
                        }
                    });
                };
            } else {
                this.source = this.options.source;
            }
        },

        _searchTimeout: function( event ) {
            clearTimeout( this.searching );
            this.searching = this._delay(function() {
                // only search if the value has changed
                if ( this.term !== this._value() ) {
                    this.selectedItem = null;
                    this.search( null, event );
                }
            }, this.options.delay );
        },

        search: function( value, event ) {
            value = value != null ? value : this._value();

            // always save the actual value, not the one passed as an argument
            this.term = this._value();

            if ( value.length < this.options.minLength ) {
                return this.close( event );
            }

            if ( this._trigger( "search", event ) === false ) {
                return;
            }

            return this._search( value );
        },

        _search: function( value ) {
            this.pending++;
            this.element.addClass( "ui-autocomplete-loading" );
            this.cancelSearch = false;

            this.source( { term: value }, this._response() );
        },

        _response: function() {
            var that = this,
                index = ++requestIndex;

            return function( content ) {
                if ( index === requestIndex ) {
                    that.__response( content );
                }

                that.pending--;
                if ( !that.pending ) {
                    that.element.removeClass( "ui-autocomplete-loading" );
                }
            };
        },

        __response: function( content ) {
            if ( content ) {
                content = this._normalize( content );
            }
            this._trigger( "response", null, { content: content } );
            if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
                this._suggest( content );
                this._trigger( "open" );
            } else {
                // use ._close() instead of .close() so we don't cancel future searches
                this._close();
            }
        },

        close: function( event ) {
            this.cancelSearch = true;
            this._close( event );
        },

        _close: function( event ) {
            if ( this.menu.element.is( ":visible" ) ) {
                this.menu.element.hide();
                this.menu.blur();
                this.isNewMenu = true;
                this._trigger( "close", event );
            }
        },

        _change: function( event ) {
            if ( this.previous !== this._value() ) {
                this._trigger( "change", event, { item: this.selectedItem } );
            }
        },

        _normalize: function( items ) {
            // assume all items have the right format when the first item is complete
            if ( items.length && items[0].label && items[0].value ) {
                return items;
            }
            return $.map( items, function( item ) {
                if ( typeof item === "string" ) {
                    return {
                        label: item,
                        value: item
                    };
                }
                return $.extend({
                    label: item.label || item.value,
                    value: item.value || item.label
                }, item );
            });
        },

        _suggest: function( items ) {
            var ul = this.menu.element.empty();
            this._renderMenu( ul, items );
            this.menu.refresh();

            // size and position menu
            ul.show();
            this._resizeMenu();
            ul.position( $.extend({
                of: this.element
            }, this.options.position ));

            if ( this.options.autoFocus ) {
                this.menu.next();
            }
        },

        _resizeMenu: function() {
            var ul = this.menu.element;
            ul.outerWidth( Math.max(
                // Firefox wraps long text (possibly a rounding bug)
                // so we add 1px to avoid the wrapping (#7513)
                ul.width( "" ).outerWidth() + 1,
                this.element.outerWidth()
            ) );
        },

        _renderMenu: function( ul, items ) {
            var that = this;
            $.each( items, function( index, item ) {
                that._renderItemData( ul, item );
            });
        },

        _renderItemData: function( ul, item ) {
            return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
        },

        _renderItem: function( ul, item ) {
            return $( "<li>" )
                .append( $( "<a>" ).text( item.label ) )
                .appendTo( ul );
        },

        _move: function( direction, event ) {
            if ( !this.menu.element.is( ":visible" ) ) {
                this.search( null, event );
                return;
            }
            if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
                this.menu.isLastItem() && /^next/.test( direction ) ) {
                this._value( this.term );
                this.menu.blur();
                return;
            }
            this.menu[ direction ]( event );
        },

        widget: function() {
            return this.menu.element;
        },

        _value: function() {
            return this.valueMethod.apply( this.element, arguments );
        },

        _keyEvent: function( keyEvent, event ) {
            if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
                this._move( keyEvent, event );

                // prevents moving cursor to beginning/end of the text field in some browsers
                event.preventDefault();
            }
        }
    });

    $.extend( $.ui.autocomplete, {
        escapeRegex: function( value ) {
            return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
        },
        filter: function(array, term) {
            var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
            return $.grep( array, function(value) {
                return matcher.test( value.label || value.value || value );
            });
        }
    });


// live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
    $.widget( "ui.autocomplete", $.ui.autocomplete, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function( amount ) {
                    return amount + ( amount > 1 ? " results are" : " result is" ) +
                        " available, use up and down arrow keys to navigate.";
                }
            }
        },

        __response: function( content ) {
            var message;
            this._superApply( arguments );
            if ( this.options.disabled || this.cancelSearch ) {
                return;
            }
            if ( content && content.length ) {
                message = this.options.messages.results( content.length );
            } else {
                message = this.options.messages.noResults;
            }
            this.liveRegion.text( message );
        }
    });

}( jQuery ));
(function( $, undefined ) {

    var lastActive, startXPos, startYPos, clickDragged,
        baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
        stateClasses = "ui-state-hover ui-state-active ",
        typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
        formResetHandler = function() {
            var buttons = $( this ).find( ":ui-button" );
            setTimeout(function() {
                buttons.button( "refresh" );
            }, 1 );
        },
        radioGroup = function( radio ) {
            var name = radio.name,
                form = radio.form,
                radios = $( [] );
            if ( name ) {
                name = name.replace( /'/g, "\\'" );
                if ( form ) {
                    radios = $( form ).find( "[name='" + name + "']" );
                } else {
                    radios = $( "[name='" + name + "']", radio.ownerDocument )
                        .filter(function() {
                            return !this.form;
                        });
                }
            }
            return radios;
        };

    $.widget( "ui.button", {
        version: "1.10.1",
        defaultElement: "<button>",
        options: {
            disabled: null,
            text: true,
            label: null,
            icons: {
                primary: null,
                secondary: null
            }
        },
        _create: function() {
            this.element.closest( "form" )
                .unbind( "reset" + this.eventNamespace )
                .bind( "reset" + this.eventNamespace, formResetHandler );

            if ( typeof this.options.disabled !== "boolean" ) {
                this.options.disabled = !!this.element.prop( "disabled" );
            } else {
                this.element.prop( "disabled", this.options.disabled );
            }

            this._determineButtonType();
            this.hasTitle = !!this.buttonElement.attr( "title" );

            var that = this,
                options = this.options,
                toggleButton = this.type === "checkbox" || this.type === "radio",
                activeClass = !toggleButton ? "ui-state-active" : "",
                focusClass = "ui-state-focus";

            if ( options.label === null ) {
                options.label = (this.type === "input" ? this.buttonElement.val() : this.buttonElement.html());
            }

            this._hoverable( this.buttonElement );

            this.buttonElement
                .addClass( baseClasses )
                .attr( "role", "button" )
                .bind( "mouseenter" + this.eventNamespace, function() {
                    if ( options.disabled ) {
                        return;
                    }
                    if ( this === lastActive ) {
                        $( this ).addClass( "ui-state-active" );
                    }
                })
                .bind( "mouseleave" + this.eventNamespace, function() {
                    if ( options.disabled ) {
                        return;
                    }
                    $( this ).removeClass( activeClass );
                })
                .bind( "click" + this.eventNamespace, function( event ) {
                    if ( options.disabled ) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                    }
                });

            this.element
                .bind( "focus" + this.eventNamespace, function() {
                    // no need to check disabled, focus won't be triggered anyway
                    that.buttonElement.addClass( focusClass );
                })
                .bind( "blur" + this.eventNamespace, function() {
                    that.buttonElement.removeClass( focusClass );
                });

            if ( toggleButton ) {
                this.element.bind( "change" + this.eventNamespace, function() {
                    if ( clickDragged ) {
                        return;
                    }
                    that.refresh();
                });
                // if mouse moves between mousedown and mouseup (drag) set clickDragged flag
                // prevents issue where button state changes but checkbox/radio checked state
                // does not in Firefox (see ticket #6970)
                this.buttonElement
                    .bind( "mousedown" + this.eventNamespace, function( event ) {
                        if ( options.disabled ) {
                            return;
                        }
                        clickDragged = false;
                        startXPos = event.pageX;
                        startYPos = event.pageY;
                    })
                    .bind( "mouseup" + this.eventNamespace, function( event ) {
                        if ( options.disabled ) {
                            return;
                        }
                        if ( startXPos !== event.pageX || startYPos !== event.pageY ) {
                            clickDragged = true;
                        }
                    });
            }

            if ( this.type === "checkbox" ) {
                this.buttonElement.bind( "click" + this.eventNamespace, function() {
                    if ( options.disabled || clickDragged ) {
                        return false;
                    }
                });
            } else if ( this.type === "radio" ) {
                this.buttonElement.bind( "click" + this.eventNamespace, function() {
                    if ( options.disabled || clickDragged ) {
                        return false;
                    }
                    $( this ).addClass( "ui-state-active" );
                    that.buttonElement.attr( "aria-pressed", "true" );

                    var radio = that.element[ 0 ];
                    radioGroup( radio )
                        .not( radio )
                        .map(function() {
                            return $( this ).button( "widget" )[ 0 ];
                        })
                        .removeClass( "ui-state-active" )
                        .attr( "aria-pressed", "false" );
                });
            } else {
                this.buttonElement
                    .bind( "mousedown" + this.eventNamespace, function() {
                        if ( options.disabled ) {
                            return false;
                        }
                        $( this ).addClass( "ui-state-active" );
                        lastActive = this;
                        that.document.one( "mouseup", function() {
                            lastActive = null;
                        });
                    })
                    .bind( "mouseup" + this.eventNamespace, function() {
                        if ( options.disabled ) {
                            return false;
                        }
                        $( this ).removeClass( "ui-state-active" );
                    })
                    .bind( "keydown" + this.eventNamespace, function(event) {
                        if ( options.disabled ) {
                            return false;
                        }
                        if ( event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER ) {
                            $( this ).addClass( "ui-state-active" );
                        }
                    })
                    // see #8559, we bind to blur here in case the button element loses
                    // focus between keydown and keyup, it would be left in an "active" state
                    .bind( "keyup" + this.eventNamespace + " blur" + this.eventNamespace, function() {
                        $( this ).removeClass( "ui-state-active" );
                    });

                if ( this.buttonElement.is("a") ) {
                    this.buttonElement.keyup(function(event) {
                        if ( event.keyCode === $.ui.keyCode.SPACE ) {
                            // TODO pass through original event correctly (just as 2nd argument doesn't work)
                            $( this ).click();
                        }
                    });
                }
            }

            // TODO: pull out $.Widget's handling for the disabled option into
            // $.Widget.prototype._setOptionDisabled so it's easy to proxy and can
            // be overridden by individual plugins
            this._setOption( "disabled", options.disabled );
            this._resetButton();
        },

        _determineButtonType: function() {
            var ancestor, labelSelector, checked;

            if ( this.element.is("[type=checkbox]") ) {
                this.type = "checkbox";
            } else if ( this.element.is("[type=radio]") ) {
                this.type = "radio";
            } else if ( this.element.is("input") ) {
                this.type = "input";
            } else {
                this.type = "button";
            }

            if ( this.type === "checkbox" || this.type === "radio" ) {
                // we don't search against the document in case the element
                // is disconnected from the DOM
                ancestor = this.element.parents().last();
                labelSelector = "label[for='" + this.element.attr("id") + "']";
                this.buttonElement = ancestor.find( labelSelector );
                if ( !this.buttonElement.length ) {
                    ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
                    this.buttonElement = ancestor.filter( labelSelector );
                    if ( !this.buttonElement.length ) {
                        this.buttonElement = ancestor.find( labelSelector );
                    }
                }
                this.element.addClass( "ui-helper-hidden-accessible" );

                checked = this.element.is( ":checked" );
                if ( checked ) {
                    this.buttonElement.addClass( "ui-state-active" );
                }
                this.buttonElement.prop( "aria-pressed", checked );
            } else {
                this.buttonElement = this.element;
            }
        },

        widget: function() {
            return this.buttonElement;
        },

        _destroy: function() {
            this.element
                .removeClass( "ui-helper-hidden-accessible" );
            this.buttonElement
                .removeClass( baseClasses + " " + stateClasses + " " + typeClasses )
                .removeAttr( "role" )
                .removeAttr( "aria-pressed" )
                .html( this.buttonElement.find(".ui-button-text").html() );

            if ( !this.hasTitle ) {
                this.buttonElement.removeAttr( "title" );
            }
        },

        _setOption: function( key, value ) {
            this._super( key, value );
            if ( key === "disabled" ) {
                if ( value ) {
                    this.element.prop( "disabled", true );
                } else {
                    this.element.prop( "disabled", false );
                }
                return;
            }
            this._resetButton();
        },

        refresh: function() {
            //See #8237 & #8828
            var isDisabled = this.element.is( "input, button" ) ? this.element.is( ":disabled" ) : this.element.hasClass( "ui-button-disabled" );

            if ( isDisabled !== this.options.disabled ) {
                this._setOption( "disabled", isDisabled );
            }
            if ( this.type === "radio" ) {
                radioGroup( this.element[0] ).each(function() {
                    if ( $( this ).is( ":checked" ) ) {
                        $( this ).button( "widget" )
                            .addClass( "ui-state-active" )
                            .attr( "aria-pressed", "true" );
                    } else {
                        $( this ).button( "widget" )
                            .removeClass( "ui-state-active" )
                            .attr( "aria-pressed", "false" );
                    }
                });
            } else if ( this.type === "checkbox" ) {
                if ( this.element.is( ":checked" ) ) {
                    this.buttonElement
                        .addClass( "ui-state-active" )
                        .attr( "aria-pressed", "true" );
                } else {
                    this.buttonElement
                        .removeClass( "ui-state-active" )
                        .attr( "aria-pressed", "false" );
                }
            }
        },

        _resetButton: function() {
            if ( this.type === "input" ) {
                if ( this.options.label ) {
                    this.element.val( this.options.label );
                }
                return;
            }
            var buttonElement = this.buttonElement.removeClass( typeClasses ),
                buttonText = $( "<span></span>", this.document[0] )
                    .addClass( "ui-button-text" )
                    .html( this.options.label )
                    .appendTo( buttonElement.empty() )
                    .text(),
                icons = this.options.icons,
                multipleIcons = icons.primary && icons.secondary,
                buttonClasses = [];

            if ( icons.primary || icons.secondary ) {
                if ( this.options.text ) {
                    buttonClasses.push( "ui-button-text-icon" + ( multipleIcons ? "s" : ( icons.primary ? "-primary" : "-secondary" ) ) );
                }

                if ( icons.primary ) {
                    buttonElement.prepend( "<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>" );
                }

                if ( icons.secondary ) {
                    buttonElement.append( "<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>" );
                }

                if ( !this.options.text ) {
                    buttonClasses.push( multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only" );

                    if ( !this.hasTitle ) {
                        buttonElement.attr( "title", $.trim( buttonText ) );
                    }
                }
            } else {
                buttonClasses.push( "ui-button-text-only" );
            }
            buttonElement.addClass( buttonClasses.join( " " ) );
        }
    });

    $.widget( "ui.buttonset", {
        version: "1.10.1",
        options: {
            items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"
        },

        _create: function() {
            this.element.addClass( "ui-buttonset" );
        },

        _init: function() {
            this.refresh();
        },

        _setOption: function( key, value ) {
            if ( key === "disabled" ) {
                this.buttons.button( "option", key, value );
            }

            this._super( key, value );
        },

        refresh: function() {
            var rtl = this.element.css( "direction" ) === "rtl";

            this.buttons = this.element.find( this.options.items )
                .filter( ":ui-button" )
                .button( "refresh" )
                .end()
                .not( ":ui-button" )
                .button()
                .end()
                .map(function() {
                    return $( this ).button( "widget" )[ 0 ];
                })
                .removeClass( "ui-corner-all ui-corner-left ui-corner-right" )
                .filter( ":first" )
                .addClass( rtl ? "ui-corner-right" : "ui-corner-left" )
                .end()
                .filter( ":last" )
                .addClass( rtl ? "ui-corner-left" : "ui-corner-right" )
                .end()
                .end();
        },

        _destroy: function() {
            this.element.removeClass( "ui-buttonset" );
            this.buttons
                .map(function() {
                    return $( this ).button( "widget" )[ 0 ];
                })
                .removeClass( "ui-corner-left ui-corner-right" )
                .end()
                .button( "destroy" );
        }
    });

}( jQuery ) );
(function( $, undefined ) {

    $.widget( "ui.menu", {
        version: "1.10.1",
        defaultElement: "<ul>",
        delay: 300,
        options: {
            icons: {
                submenu: "ui-icon-carat-1-e"
            },
            menus: "ul",
            position: {
                my: "left top",
                at: "right top"
            },
            role: "menu",

            // callbacks
            blur: null,
            focus: null,
            select: null
        },

        _create: function() {
            this.activeMenu = this.element;
            // flag used to prevent firing of the click handler
            // as the event bubbles up through nested menus
            this.mouseHandled = false;
            this.element
                .uniqueId()
                .addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
                .toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length )
                .attr({
                    role: this.options.role,
                    tabIndex: 0
                })
                // need to catch all clicks on disabled menu
                // not possible through _on
                .bind( "click" + this.eventNamespace, $.proxy(function( event ) {
                    if ( this.options.disabled ) {
                        event.preventDefault();
                    }
                }, this ));

            if ( this.options.disabled ) {
                this.element
                    .addClass( "ui-state-disabled" )
                    .attr( "aria-disabled", "true" );
            }

            this._on({
                // Prevent focus from sticking to links inside menu after clicking
                // them (focus should always stay on UL during navigation).
                "mousedown .ui-menu-item > a": function( event ) {
                    event.preventDefault();
                },
                "click .ui-state-disabled > a": function( event ) {
                    event.preventDefault();
                },
                "click .ui-menu-item:has(a)": function( event ) {
                    var target = $( event.target ).closest( ".ui-menu-item" );
                    if ( !this.mouseHandled && target.not( ".ui-state-disabled" ).length ) {
                        this.mouseHandled = true;

                        this.select( event );
                        // Open submenu on click
                        if ( target.has( ".ui-menu" ).length ) {
                            this.expand( event );
                        } else if ( !this.element.is( ":focus" ) ) {
                            // Redirect focus to the menu
                            this.element.trigger( "focus", [ true ] );

                            // If the active item is on the top level, let it stay active.
                            // Otherwise, blur the active item since it is no longer visible.
                            if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
                                clearTimeout( this.timer );
                            }
                        }
                    }
                },
                "mouseenter .ui-menu-item": function( event ) {
                    var target = $( event.currentTarget );
                    // Remove ui-state-active class from siblings of the newly focused menu item
                    // to avoid a jump caused by adjacent elements both having a class with a border
                    target.siblings().children( ".ui-state-active" ).removeClass( "ui-state-active" );
                    this.focus( event, target );
                },
                mouseleave: "collapseAll",
                "mouseleave .ui-menu": "collapseAll",
                focus: function( event, keepActiveItem ) {
                    // If there's already an active item, keep it active
                    // If not, activate the first item
                    var item = this.active || this.element.children( ".ui-menu-item" ).eq( 0 );

                    if ( !keepActiveItem ) {
                        this.focus( event, item );
                    }
                },
                blur: function( event ) {
                    this._delay(function() {
                        if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
                            this.collapseAll( event );
                        }
                    });
                },
                keydown: "_keydown"
            });

            this.refresh();

            // Clicks outside of a menu collapse any open menus
            this._on( this.document, {
                click: function( event ) {
                    if ( !$( event.target ).closest( ".ui-menu" ).length ) {
                        this.collapseAll( event );
                    }

                    // Reset the mouseHandled flag
                    this.mouseHandled = false;
                }
            });
        },

        _destroy: function() {
            // Destroy (sub)menus
            this.element
                .removeAttr( "aria-activedescendant" )
                .find( ".ui-menu" ).addBack()
                .removeClass( "ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons" )
                .removeAttr( "role" )
                .removeAttr( "tabIndex" )
                .removeAttr( "aria-labelledby" )
                .removeAttr( "aria-expanded" )
                .removeAttr( "aria-hidden" )
                .removeAttr( "aria-disabled" )
                .removeUniqueId()
                .show();

            // Destroy menu items
            this.element.find( ".ui-menu-item" )
                .removeClass( "ui-menu-item" )
                .removeAttr( "role" )
                .removeAttr( "aria-disabled" )
                .children( "a" )
                .removeUniqueId()
                .removeClass( "ui-corner-all ui-state-hover" )
                .removeAttr( "tabIndex" )
                .removeAttr( "role" )
                .removeAttr( "aria-haspopup" )
                .children().each( function() {
                    var elem = $( this );
                    if ( elem.data( "ui-menu-submenu-carat" ) ) {
                        elem.remove();
                    }
                });

            // Destroy menu dividers
            this.element.find( ".ui-menu-divider" ).removeClass( "ui-menu-divider ui-widget-content" );
        },

        _keydown: function( event ) {
            /*jshint maxcomplexity:20*/
            var match, prev, character, skip, regex,
                preventDefault = true;

            function escape( value ) {
                return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
            }

            switch ( event.keyCode ) {
                case $.ui.keyCode.PAGE_UP:
                    this.previousPage( event );
                    break;
                case $.ui.keyCode.PAGE_DOWN:
                    this.nextPage( event );
                    break;
                case $.ui.keyCode.HOME:
                    this._move( "first", "first", event );
                    break;
                case $.ui.keyCode.END:
                    this._move( "last", "last", event );
                    break;
                case $.ui.keyCode.UP:
                    this.previous( event );
                    break;
                case $.ui.keyCode.DOWN:
                    this.next( event );
                    break;
                case $.ui.keyCode.LEFT:
                    this.collapse( event );
                    break;
                case $.ui.keyCode.RIGHT:
                    if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
                        this.expand( event );
                    }
                    break;
                case $.ui.keyCode.ENTER:
                case $.ui.keyCode.SPACE:
                    this._activate( event );
                    break;
                case $.ui.keyCode.ESCAPE:
                    this.collapse( event );
                    break;
                default:
                    preventDefault = false;
                    prev = this.previousFilter || "";
                    character = String.fromCharCode( event.keyCode );
                    skip = false;

                    clearTimeout( this.filterTimer );

                    if ( character === prev ) {
                        skip = true;
                    } else {
                        character = prev + character;
                    }

                    regex = new RegExp( "^" + escape( character ), "i" );
                    match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
                        return regex.test( $( this ).children( "a" ).text() );
                    });
                    match = skip && match.index( this.active.next() ) !== -1 ?
                        this.active.nextAll( ".ui-menu-item" ) :
                        match;

                    // If no matches on the current filter, reset to the last character pressed
                    // to move down the menu to the first item that starts with that character
                    if ( !match.length ) {
                        character = String.fromCharCode( event.keyCode );
                        regex = new RegExp( "^" + escape( character ), "i" );
                        match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
                            return regex.test( $( this ).children( "a" ).text() );
                        });
                    }

                    if ( match.length ) {
                        this.focus( event, match );
                        if ( match.length > 1 ) {
                            this.previousFilter = character;
                            this.filterTimer = this._delay(function() {
                                delete this.previousFilter;
                            }, 1000 );
                        } else {
                            delete this.previousFilter;
                        }
                    } else {
                        delete this.previousFilter;
                    }
            }

            if ( preventDefault ) {
                event.preventDefault();
            }
        },

        _activate: function( event ) {
            if ( !this.active.is( ".ui-state-disabled" ) ) {
                if ( this.active.children( "a[aria-haspopup='true']" ).length ) {
                    this.expand( event );
                } else {
                    this.select( event );
                }
            }
        },

        refresh: function() {
            var menus,
                icon = this.options.icons.submenu,
                submenus = this.element.find( this.options.menus );

            // Initialize nested menus
            submenus.filter( ":not(.ui-menu)" )
                .addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
                .hide()
                .attr({
                    role: this.options.role,
                    "aria-hidden": "true",
                    "aria-expanded": "false"
                })
                .each(function() {
                    var menu = $( this ),
                        item = menu.prev( "a" ),
                        submenuCarat = $( "<span>" )
                            .addClass( "ui-menu-icon ui-icon " + icon )
                            .data( "ui-menu-submenu-carat", true );

                    item
                        .attr( "aria-haspopup", "true" )
                        .prepend( submenuCarat );
                    menu.attr( "aria-labelledby", item.attr( "id" ) );
                });

            menus = submenus.add( this.element );

            // Don't refresh list items that are already adapted
            menus.children( ":not(.ui-menu-item):has(a)" )
                .addClass( "ui-menu-item" )
                .attr( "role", "presentation" )
                .children( "a" )
                .uniqueId()
                .addClass( "ui-corner-all" )
                .attr({
                    tabIndex: -1,
                    role: this._itemRole()
                });

            // Initialize unlinked menu-items containing spaces and/or dashes only as dividers
            menus.children( ":not(.ui-menu-item)" ).each(function() {
                var item = $( this );
                // hyphen, em dash, en dash
                if ( !/[^\-\u2014\u2013\s]/.test( item.text() ) ) {
                    item.addClass( "ui-widget-content ui-menu-divider" );
                }
            });

            // Add aria-disabled attribute to any disabled menu item
            menus.children( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

            // If the active item has been removed, blur the menu
            if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
                this.blur();
            }
        },

        _itemRole: function() {
            return {
                menu: "menuitem",
                listbox: "option"
            }[ this.options.role ];
        },

        _setOption: function( key, value ) {
            if ( key === "icons" ) {
                this.element.find( ".ui-menu-icon" )
                    .removeClass( this.options.icons.submenu )
                    .addClass( value.submenu );
            }
            this._super( key, value );
        },

        focus: function( event, item ) {
            var nested, focused;
            this.blur( event, event && event.type === "focus" );

            this._scrollIntoView( item );

            this.active = item.first();
            focused = this.active.children( "a" ).addClass( "ui-state-focus" );
            // Only update aria-activedescendant if there's a role
            // otherwise we assume focus is managed elsewhere
            if ( this.options.role ) {
                this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
            }

            // Highlight active parent menu item, if any
            this.active
                .parent()
                .closest( ".ui-menu-item" )
                .children( "a:first" )
                .addClass( "ui-state-active" );

            if ( event && event.type === "keydown" ) {
                this._close();
            } else {
                this.timer = this._delay(function() {
                    this._close();
                }, this.delay );
            }

            nested = item.children( ".ui-menu" );
            if ( nested.length && ( /^mouse/.test( event.type ) ) ) {
                this._startOpening(nested);
            }
            this.activeMenu = item.parent();

            this._trigger( "focus", event, { item: item } );
        },

        _scrollIntoView: function( item ) {
            var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
            if ( this._hasScroll() ) {
                borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
                paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
                offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
                scroll = this.activeMenu.scrollTop();
                elementHeight = this.activeMenu.height();
                itemHeight = item.height();

                if ( offset < 0 ) {
                    this.activeMenu.scrollTop( scroll + offset );
                } else if ( offset + itemHeight > elementHeight ) {
                    this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
                }
            }
        },

        blur: function( event, fromFocus ) {
            if ( !fromFocus ) {
                clearTimeout( this.timer );
            }

            if ( !this.active ) {
                return;
            }

            this.active.children( "a" ).removeClass( "ui-state-focus" );
            this.active = null;

            this._trigger( "blur", event, { item: this.active } );
        },

        _startOpening: function( submenu ) {
            clearTimeout( this.timer );

            // Don't open if already open fixes a Firefox bug that caused a .5 pixel
            // shift in the submenu position when mousing over the carat icon
            if ( submenu.attr( "aria-hidden" ) !== "true" ) {
                return;
            }

            this.timer = this._delay(function() {
                this._close();
                this._open( submenu );
            }, this.delay );
        },

        _open: function( submenu ) {
            var position = $.extend({
                of: this.active
            }, this.options.position );

            clearTimeout( this.timer );
            this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
                .hide()
                .attr( "aria-hidden", "true" );

            submenu
                .show()
                .removeAttr( "aria-hidden" )
                .attr( "aria-expanded", "true" )
                .position( position );
        },

        collapseAll: function( event, all ) {
            clearTimeout( this.timer );
            this.timer = this._delay(function() {
                // If we were passed an event, look for the submenu that contains the event
                var currentMenu = all ? this.element :
                    $( event && event.target ).closest( this.element.find( ".ui-menu" ) );

                // If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
                if ( !currentMenu.length ) {
                    currentMenu = this.element;
                }

                this._close( currentMenu );

                this.blur( event );
                this.activeMenu = currentMenu;
            }, this.delay );
        },

        // With no arguments, closes the currently active menu - if nothing is active
        // it closes all menus.  If passed an argument, it will search for menus BELOW
        _close: function( startMenu ) {
            if ( !startMenu ) {
                startMenu = this.active ? this.active.parent() : this.element;
            }

            startMenu
                .find( ".ui-menu" )
                .hide()
                .attr( "aria-hidden", "true" )
                .attr( "aria-expanded", "false" )
                .end()
                .find( "a.ui-state-active" )
                .removeClass( "ui-state-active" );
        },

        collapse: function( event ) {
            var newItem = this.active &&
                this.active.parent().closest( ".ui-menu-item", this.element );
            if ( newItem && newItem.length ) {
                this._close();
                this.focus( event, newItem );
            }
        },

        expand: function( event ) {
            var newItem = this.active &&
                this.active
                    .children( ".ui-menu " )
                    .children( ".ui-menu-item" )
                    .first();

            if ( newItem && newItem.length ) {
                this._open( newItem.parent() );

                // Delay so Firefox will not hide activedescendant change in expanding submenu from AT
                this._delay(function() {
                    this.focus( event, newItem );
                });
            }
        },

        next: function( event ) {
            this._move( "next", "first", event );
        },

        previous: function( event ) {
            this._move( "prev", "last", event );
        },

        isFirstItem: function() {
            return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
        },

        isLastItem: function() {
            return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
        },

        _move: function( direction, filter, event ) {
            var next;
            if ( this.active ) {
                if ( direction === "first" || direction === "last" ) {
                    next = this.active
                        [ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
                        .eq( -1 );
                } else {
                    next = this.active
                        [ direction + "All" ]( ".ui-menu-item" )
                        .eq( 0 );
                }
            }
            if ( !next || !next.length || !this.active ) {
                next = this.activeMenu.children( ".ui-menu-item" )[ filter ]();
            }

            this.focus( event, next );
        },

        nextPage: function( event ) {
            var item, base, height;

            if ( !this.active ) {
                this.next( event );
                return;
            }
            if ( this.isLastItem() ) {
                return;
            }
            if ( this._hasScroll() ) {
                base = this.active.offset().top;
                height = this.element.height();
                this.active.nextAll( ".ui-menu-item" ).each(function() {
                    item = $( this );
                    return item.offset().top - base - height < 0;
                });

                this.focus( event, item );
            } else {
                this.focus( event, this.activeMenu.children( ".ui-menu-item" )
                    [ !this.active ? "first" : "last" ]() );
            }
        },

        previousPage: function( event ) {
            var item, base, height;
            if ( !this.active ) {
                this.next( event );
                return;
            }
            if ( this.isFirstItem() ) {
                return;
            }
            if ( this._hasScroll() ) {
                base = this.active.offset().top;
                height = this.element.height();
                this.active.prevAll( ".ui-menu-item" ).each(function() {
                    item = $( this );
                    return item.offset().top - base + height > 0;
                });

                this.focus( event, item );
            } else {
                this.focus( event, this.activeMenu.children( ".ui-menu-item" ).first() );
            }
        },

        _hasScroll: function() {
            return this.element.outerHeight() < this.element.prop( "scrollHeight" );
        },

        select: function( event ) {
            // TODO: It should never be possible to not have an active item at this
            // point, but the tests don't trigger mouseenter before click.
            this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
            var ui = { item: this.active };
            if ( !this.active.has( ".ui-menu" ).length ) {
                this.collapseAll( event, true );
            }
            this._trigger( "select", event, ui );
        }
    });

}( jQuery ));
(function( $, undefined ) {

    $.widget( "ui.progressbar", {
        version: "1.10.1",
        options: {
            max: 100,
            value: 0,

            change: null,
            complete: null
        },

        min: 0,

        _create: function() {
            // Constrain initial value
            this.oldValue = this.options.value = this._constrainedValue();

            this.element
                .addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
                .attr({
                    // Only set static values, aria-valuenow and aria-valuemax are
                    // set inside _refreshValue()
                    role: "progressbar",
                    "aria-valuemin": this.min
                });

            this.valueDiv = $( "<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>" )
                .appendTo( this.element );

            this._refreshValue();
        },

        _destroy: function() {
            this.element
                .removeClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
                .removeAttr( "role" )
                .removeAttr( "aria-valuemin" )
                .removeAttr( "aria-valuemax" )
                .removeAttr( "aria-valuenow" );

            this.valueDiv.remove();
        },

        value: function( newValue ) {
            if ( newValue === undefined ) {
                return this.options.value;
            }

            this.options.value = this._constrainedValue( newValue );
            this._refreshValue();
        },

        _constrainedValue: function( newValue ) {
            if ( newValue === undefined ) {
                newValue = this.options.value;
            }

            this.indeterminate = newValue === false;

            // sanitize value
            if ( typeof newValue !== "number" ) {
                newValue = 0;
            }

            return this.indeterminate ? false :
                Math.min( this.options.max, Math.max( this.min, newValue ) );
        },

        _setOptions: function( options ) {
            // Ensure "value" option is set after other values (like max)
            var value = options.value;
            delete options.value;

            this._super( options );

            this.options.value = this._constrainedValue( value );
            this._refreshValue();
        },

        _setOption: function( key, value ) {
            if ( key === "max" ) {
                // Don't allow a max less than min
                value = Math.max( this.min, value );
            }

            this._super( key, value );
        },

        _percentage: function() {
            return this.indeterminate ? 100 : 100 * ( this.options.value - this.min ) / ( this.options.max - this.min );
        },

        _refreshValue: function() {
            var value = this.options.value,
                percentage = this._percentage();

            this.valueDiv
                .toggle( this.indeterminate || value > this.min )
                .toggleClass( "ui-corner-right", value === this.options.max )
                .width( percentage.toFixed(0) + "%" );

            this.element.toggleClass( "ui-progressbar-indeterminate", this.indeterminate );

            if ( this.indeterminate ) {
                this.element.removeAttr( "aria-valuenow" );
                if ( !this.overlayDiv ) {
                    this.overlayDiv = $( "<div class='ui-progressbar-overlay'></div>" ).appendTo( this.valueDiv );
                }
            } else {
                this.element.attr({
                    "aria-valuemax": this.options.max,
                    "aria-valuenow": value
                });
                if ( this.overlayDiv ) {
                    this.overlayDiv.remove();
                    this.overlayDiv = null;
                }
            }

            if ( this.oldValue !== value ) {
                this.oldValue = value;
                this._trigger( "change" );
            }
            if ( value === this.options.max ) {
                this._trigger( "complete" );
            }
        }
    });

})( jQuery );
(function( $, undefined ) {

// number of pages in a slider
// (how many times can you page up/down to go through the whole range)
    var numPages = 5;

    $.widget( "ui.slider", $.ui.mouse, {
        version: "1.10.1",
        widgetEventPrefix: "slide",

        options: {
            animate: false,
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: false,
            step: 1,
            value: 0,
            values: null,

            // callbacks
            change: null,
            slide: null,
            start: null,
            stop: null
        },

        _create: function() {
            this._keySliding = false;
            this._mouseSliding = false;
            this._animateOff = true;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();

            this.element
                .addClass( "ui-slider" +
                " ui-slider-" + this.orientation +
                " ui-widget" +
                " ui-widget-content" +
                " ui-corner-all");

            this._refresh();
            this._setOption( "disabled", this.options.disabled );

            this._animateOff = false;
        },

        _refresh: function() {
            this._createRange();
            this._createHandles();
            this._setupEvents();
            this._refreshValue();
        },

        _createHandles: function() {
            var i, handleCount,
                options = this.options,
                existingHandles = this.element.find( ".ui-slider-handle" ).addClass( "ui-state-default ui-corner-all" ),
                handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
                handles = [];

            handleCount = ( options.values && options.values.length ) || 1;

            if ( existingHandles.length > handleCount ) {
                existingHandles.slice( handleCount ).remove();
                existingHandles = existingHandles.slice( 0, handleCount );
            }

            for ( i = existingHandles.length; i < handleCount; i++ ) {
                handles.push( handle );
            }

            this.handles = existingHandles.add( $( handles.join( "" ) ).appendTo( this.element ) );

            this.handle = this.handles.eq( 0 );

            this.handles.each(function( i ) {
                $( this ).data( "ui-slider-handle-index", i );
            });
        },

        _createRange: function() {
            var options = this.options,
                classes = "";

            if ( options.range ) {
                if ( options.range === true ) {
                    if ( !options.values ) {
                        options.values = [ this._valueMin(), this._valueMin() ];
                    } else if ( options.values.length && options.values.length !== 2 ) {
                        options.values = [ options.values[0], options.values[0] ];
                    } else if ( $.isArray( options.values ) ) {
                        options.values = options.values.slice(0);
                    }
                }

                if ( !this.range || !this.range.length ) {
                    this.range = $( "<div></div>" )
                        .appendTo( this.element );

                    classes = "ui-slider-range" +
                        // note: this isn't the most fittingly semantic framework class for this element,
                        // but worked best visually with a variety of themes
                    " ui-widget-header ui-corner-all";
                } else {
                    this.range.removeClass( "ui-slider-range-min ui-slider-range-max" )
                        // Handle range switching from true to min/max
                        .css({
                            "left": "",
                            "bottom": ""
                        });
                }

                this.range.addClass( classes +
                ( ( options.range === "min" || options.range === "max" ) ? " ui-slider-range-" + options.range : "" ) );
            } else {
                this.range = $([]);
            }
        },

        _setupEvents: function() {
            var elements = this.handles.add( this.range ).filter( "a" );
            this._off( elements );
            this._on( elements, this._handleEvents );
            this._hoverable( elements );
            this._focusable( elements );
        },

        _destroy: function() {
            this.handles.remove();
            this.range.remove();

            this.element
                .removeClass( "ui-slider" +
                " ui-slider-horizontal" +
                " ui-slider-vertical" +
                " ui-widget" +
                " ui-widget-content" +
                " ui-corner-all" );

            this._mouseDestroy();
        },

        _mouseCapture: function( event ) {
            var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
                that = this,
                o = this.options;

            if ( o.disabled ) {
                return false;
            }

            this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            };
            this.elementOffset = this.element.offset();

            position = { x: event.pageX, y: event.pageY };
            normValue = this._normValueFromMouse( position );
            distance = this._valueMax() - this._valueMin() + 1;
            this.handles.each(function( i ) {
                var thisDistance = Math.abs( normValue - that.values(i) );
                if (( distance > thisDistance ) ||
                    ( distance === thisDistance &&
                    (i === that._lastChangedValue || that.values(i) === o.min ))) {
                    distance = thisDistance;
                    closestHandle = $( this );
                    index = i;
                }
            });

            allowed = this._start( event, index );
            if ( allowed === false ) {
                return false;
            }
            this._mouseSliding = true;

            this._handleIndex = index;

            closestHandle
                .addClass( "ui-state-active" )
                .focus();

            offset = closestHandle.offset();
            mouseOverHandle = !$( event.target ).parents().addBack().is( ".ui-slider-handle" );
            this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
                left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
                top: event.pageY - offset.top -
                ( closestHandle.height() / 2 ) -
                ( parseInt( closestHandle.css("borderTopWidth"), 10 ) || 0 ) -
                ( parseInt( closestHandle.css("borderBottomWidth"), 10 ) || 0) +
                ( parseInt( closestHandle.css("marginTop"), 10 ) || 0)
            };

            if ( !this.handles.hasClass( "ui-state-hover" ) ) {
                this._slide( event, index, normValue );
            }
            this._animateOff = true;
            return true;
        },

        _mouseStart: function() {
            return true;
        },

        _mouseDrag: function( event ) {
            var position = { x: event.pageX, y: event.pageY },
                normValue = this._normValueFromMouse( position );

            this._slide( event, this._handleIndex, normValue );

            return false;
        },

        _mouseStop: function( event ) {
            this.handles.removeClass( "ui-state-active" );
            this._mouseSliding = false;

            this._stop( event, this._handleIndex );
            this._change( event, this._handleIndex );

            this._handleIndex = null;
            this._clickOffset = null;
            this._animateOff = false;

            return false;
        },

        _detectOrientation: function() {
            this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
        },

        _normValueFromMouse: function( position ) {
            var pixelTotal,
                pixelMouse,
                percentMouse,
                valueTotal,
                valueMouse;

            if ( this.orientation === "horizontal" ) {
                pixelTotal = this.elementSize.width;
                pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
            } else {
                pixelTotal = this.elementSize.height;
                pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
            }

            percentMouse = ( pixelMouse / pixelTotal );
            if ( percentMouse > 1 ) {
                percentMouse = 1;
            }
            if ( percentMouse < 0 ) {
                percentMouse = 0;
            }
            if ( this.orientation === "vertical" ) {
                percentMouse = 1 - percentMouse;
            }

            valueTotal = this._valueMax() - this._valueMin();
            valueMouse = this._valueMin() + percentMouse * valueTotal;

            return this._trimAlignValue( valueMouse );
        },

        _start: function( event, index ) {
            var uiHash = {
                handle: this.handles[ index ],
                value: this.value()
            };
            if ( this.options.values && this.options.values.length ) {
                uiHash.value = this.values( index );
                uiHash.values = this.values();
            }
            return this._trigger( "start", event, uiHash );
        },

        _slide: function( event, index, newVal ) {
            var otherVal,
                newValues,
                allowed;

            if ( this.options.values && this.options.values.length ) {
                otherVal = this.values( index ? 0 : 1 );

                if ( ( this.options.values.length === 2 && this.options.range === true ) &&
                    ( ( index === 0 && newVal > otherVal) || ( index === 1 && newVal < otherVal ) )
                ) {
                    newVal = otherVal;
                }

                if ( newVal !== this.values( index ) ) {
                    newValues = this.values();
                    newValues[ index ] = newVal;
                    // A slide can be canceled by returning false from the slide callback
                    allowed = this._trigger( "slide", event, {
                        handle: this.handles[ index ],
                        value: newVal,
                        values: newValues
                    } );
                    otherVal = this.values( index ? 0 : 1 );
                    if ( allowed !== false ) {
                        this.values( index, newVal, true );
                    }
                }
            } else {
                if ( newVal !== this.value() ) {
                    // A slide can be canceled by returning false from the slide callback
                    allowed = this._trigger( "slide", event, {
                        handle: this.handles[ index ],
                        value: newVal
                    } );
                    if ( allowed !== false ) {
                        this.value( newVal );
                    }
                }
            }
        },

        _stop: function( event, index ) {
            var uiHash = {
                handle: this.handles[ index ],
                value: this.value()
            };
            if ( this.options.values && this.options.values.length ) {
                uiHash.value = this.values( index );
                uiHash.values = this.values();
            }

            this._trigger( "stop", event, uiHash );
        },

        _change: function( event, index ) {
            if ( !this._keySliding && !this._mouseSliding ) {
                var uiHash = {
                    handle: this.handles[ index ],
                    value: this.value()
                };
                if ( this.options.values && this.options.values.length ) {
                    uiHash.value = this.values( index );
                    uiHash.values = this.values();
                }

                //store the last changed value index for reference when handles overlap
                this._lastChangedValue = index;

                this._trigger( "change", event, uiHash );
            }
        },

        value: function( newValue ) {
            if ( arguments.length ) {
                this.options.value = this._trimAlignValue( newValue );
                this._refreshValue();
                this._change( null, 0 );
                return;
            }

            return this._value();
        },

        values: function( index, newValue ) {
            var vals,
                newValues,
                i;

            if ( arguments.length > 1 ) {
                this.options.values[ index ] = this._trimAlignValue( newValue );
                this._refreshValue();
                this._change( null, index );
                return;
            }

            if ( arguments.length ) {
                if ( $.isArray( arguments[ 0 ] ) ) {
                    vals = this.options.values;
                    newValues = arguments[ 0 ];
                    for ( i = 0; i < vals.length; i += 1 ) {
                        vals[ i ] = this._trimAlignValue( newValues[ i ] );
                        this._change( null, i );
                    }
                    this._refreshValue();
                } else {
                    if ( this.options.values && this.options.values.length ) {
                        return this._values( index );
                    } else {
                        return this.value();
                    }
                }
            } else {
                return this._values();
            }
        },

        _setOption: function( key, value ) {
            var i,
                valsLength = 0;

            if ( key === "range" && this.options.range === true ) {
                if ( value === "min" ) {
                    this.options.value = this._values( 0 );
                    this.options.values = null;
                } else if ( value === "max" ) {
                    this.options.value = this._values( this.options.values.length-1 );
                    this.options.values = null;
                }
            }

            if ( $.isArray( this.options.values ) ) {
                valsLength = this.options.values.length;
            }

            $.Widget.prototype._setOption.apply( this, arguments );

            switch ( key ) {
                case "orientation":
                    this._detectOrientation();
                    this.element
                        .removeClass( "ui-slider-horizontal ui-slider-vertical" )
                        .addClass( "ui-slider-" + this.orientation );
                    this._refreshValue();
                    break;
                case "value":
                    this._animateOff = true;
                    this._refreshValue();
                    this._change( null, 0 );
                    this._animateOff = false;
                    break;
                case "values":
                    this._animateOff = true;
                    this._refreshValue();
                    for ( i = 0; i < valsLength; i += 1 ) {
                        this._change( null, i );
                    }
                    this._animateOff = false;
                    break;
                case "min":
                case "max":
                    this._animateOff = true;
                    this._refreshValue();
                    this._animateOff = false;
                    break;
                case "range":
                    this._animateOff = true;
                    this._refresh();
                    this._animateOff = false;
                    break;
            }
        },

        //internal value getter
        // _value() returns value trimmed by min and max, aligned by step
        _value: function() {
            var val = this.options.value;
            val = this._trimAlignValue( val );

            return val;
        },

        //internal values getter
        // _values() returns array of values trimmed by min and max, aligned by step
        // _values( index ) returns single value trimmed by min and max, aligned by step
        _values: function( index ) {
            var val,
                vals,
                i;

            if ( arguments.length ) {
                val = this.options.values[ index ];
                val = this._trimAlignValue( val );

                return val;
            } else if ( this.options.values && this.options.values.length ) {
                // .slice() creates a copy of the array
                // this copy gets trimmed by min and max and then returned
                vals = this.options.values.slice();
                for ( i = 0; i < vals.length; i+= 1) {
                    vals[ i ] = this._trimAlignValue( vals[ i ] );
                }

                return vals;
            } else {
                return [];
            }
        },

        // returns the step-aligned value that val is closest to, between (inclusive) min and max
        _trimAlignValue: function( val ) {
            if ( val <= this._valueMin() ) {
                return this._valueMin();
            }
            if ( val >= this._valueMax() ) {
                return this._valueMax();
            }
            var step = ( this.options.step > 0 ) ? this.options.step : 1,
                valModStep = (val - this._valueMin()) % step,
                alignValue = val - valModStep;

            if ( Math.abs(valModStep) * 2 >= step ) {
                alignValue += ( valModStep > 0 ) ? step : ( -step );
            }

            // Since JavaScript has problems with large floats, round
            // the final value to 5 digits after the decimal point (see #4124)
            return parseFloat( alignValue.toFixed(5) );
        },

        _valueMin: function() {
            return this.options.min;
        },

        _valueMax: function() {
            return this.options.max;
        },

        _refreshValue: function() {
            var lastValPercent, valPercent, value, valueMin, valueMax,
                oRange = this.options.range,
                o = this.options,
                that = this,
                animate = ( !this._animateOff ) ? o.animate : false,
                _set = {};

            if ( this.options.values && this.options.values.length ) {
                this.handles.each(function( i ) {
                    valPercent = ( that.values(i) - that._valueMin() ) / ( that._valueMax() - that._valueMin() ) * 100;
                    _set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
                    $( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
                    if ( that.options.range === true ) {
                        if ( that.orientation === "horizontal" ) {
                            if ( i === 0 ) {
                                that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { left: valPercent + "%" }, o.animate );
                            }
                            if ( i === 1 ) {
                                that.range[ animate ? "animate" : "css" ]( { width: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
                            }
                        } else {
                            if ( i === 0 ) {
                                that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { bottom: ( valPercent ) + "%" }, o.animate );
                            }
                            if ( i === 1 ) {
                                that.range[ animate ? "animate" : "css" ]( { height: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
                            }
                        }
                    }
                    lastValPercent = valPercent;
                });
            } else {
                value = this.value();
                valueMin = this._valueMin();
                valueMax = this._valueMax();
                valPercent = ( valueMax !== valueMin ) ?
                ( value - valueMin ) / ( valueMax - valueMin ) * 100 :
                    0;
                _set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
                this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );

                if ( oRange === "min" && this.orientation === "horizontal" ) {
                    this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { width: valPercent + "%" }, o.animate );
                }
                if ( oRange === "max" && this.orientation === "horizontal" ) {
                    this.range[ animate ? "animate" : "css" ]( { width: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
                }
                if ( oRange === "min" && this.orientation === "vertical" ) {
                    this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { height: valPercent + "%" }, o.animate );
                }
                if ( oRange === "max" && this.orientation === "vertical" ) {
                    this.range[ animate ? "animate" : "css" ]( { height: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
                }
            }
        },

        _handleEvents: {
            keydown: function( event ) {
                /*jshint maxcomplexity:25*/
                var allowed, curVal, newVal, step,
                    index = $( event.target ).data( "ui-slider-handle-index" );

                switch ( event.keyCode ) {
                    case $.ui.keyCode.HOME:
                    case $.ui.keyCode.END:
                    case $.ui.keyCode.PAGE_UP:
                    case $.ui.keyCode.PAGE_DOWN:
                    case $.ui.keyCode.UP:
                    case $.ui.keyCode.RIGHT:
                    case $.ui.keyCode.DOWN:
                    case $.ui.keyCode.LEFT:
                        event.preventDefault();
                        if ( !this._keySliding ) {
                            this._keySliding = true;
                            $( event.target ).addClass( "ui-state-active" );
                            allowed = this._start( event, index );
                            if ( allowed === false ) {
                                return;
                            }
                        }
                        break;
                }

                step = this.options.step;
                if ( this.options.values && this.options.values.length ) {
                    curVal = newVal = this.values( index );
                } else {
                    curVal = newVal = this.value();
                }

                switch ( event.keyCode ) {
                    case $.ui.keyCode.HOME:
                        newVal = this._valueMin();
                        break;
                    case $.ui.keyCode.END:
                        newVal = this._valueMax();
                        break;
                    case $.ui.keyCode.PAGE_UP:
                        newVal = this._trimAlignValue( curVal + ( (this._valueMax() - this._valueMin()) / numPages ) );
                        break;
                    case $.ui.keyCode.PAGE_DOWN:
                        newVal = this._trimAlignValue( curVal - ( (this._valueMax() - this._valueMin()) / numPages ) );
                        break;
                    case $.ui.keyCode.UP:
                    case $.ui.keyCode.RIGHT:
                        if ( curVal === this._valueMax() ) {
                            return;
                        }
                        newVal = this._trimAlignValue( curVal + step );
                        break;
                    case $.ui.keyCode.DOWN:
                    case $.ui.keyCode.LEFT:
                        if ( curVal === this._valueMin() ) {
                            return;
                        }
                        newVal = this._trimAlignValue( curVal - step );
                        break;
                }

                this._slide( event, index, newVal );
            },
            click: function( event ) {
                event.preventDefault();
            },
            keyup: function( event ) {
                var index = $( event.target ).data( "ui-slider-handle-index" );

                if ( this._keySliding ) {
                    this._keySliding = false;
                    this._stop( event, index );
                    this._change( event, index );
                    $( event.target ).removeClass( "ui-state-active" );
                }
            }
        }

    });

}(jQuery));
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery)
/* ===================================================
 * bootstrap-transition.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $(function () {

        $.support.transition = (function () {

            var transitionEnd = (function () {

                var el = document.createElement('bootstrap')
                    , transEndEventNames = {
                        'WebkitTransition' : 'webkitTransitionEnd'
                        ,  'MozTransition'    : 'transitionend'
                        ,  'OTransition'      : 'oTransitionEnd otransitionend'
                        ,  'transition'       : 'transitionend'
                    }
                    , name

                for (name in transEndEventNames){
                    if (el.style[name] !== undefined) {
                        return transEndEventNames[name]
                    }
                }

            }())

            return transitionEnd && {
                    end: transitionEnd
                }

        })()

    })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

    "use strict"; // jshint ;_;


    /* ALERT CLASS DEFINITION
     * ====================== */

    var dismiss = '[data-dismiss="alert"]'
        , Alert = function (el) {
            $(el).on('click', dismiss, this.close)
        }

    Alert.prototype.close = function (e) {
        var $this = $(this)
            , selector = $this.attr('data-target')
            , $parent

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        $parent = $(selector)

        e && e.preventDefault()

        $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

        $parent.trigger(e = $.Event('close'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
            $parent
                .trigger('closed')
                .remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
            $parent.on($.support.transition.end, removeElement) :
            removeElement()
    }


    /* ALERT PLUGIN DEFINITION
     * ======================= */

    var old = $.fn.alert

    $.fn.alert = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('alert')
            if (!data) $this.data('alert', (data = new Alert(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.alert.Constructor = Alert


    /* ALERT NO CONFLICT
     * ================= */

    $.fn.alert.noConflict = function () {
        $.fn.alert = old
        return this
    }


    /* ALERT DATA-API
     * ============== */

    $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

    "use strict"; // jshint ;_;


    /* BUTTON PUBLIC CLASS DEFINITION
     * ============================== */

    var Button = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.button.defaults, options)
    }

    Button.prototype.setState = function (state) {
        var d = 'disabled'
            , $el = this.$element
            , data = $el.data()
            , val = $el.is('input') ? 'val' : 'html'

        state = state + 'Text'
        data.resetText || $el.data('resetText', $el[val]())

        $el[val](data[state] || this.options[state])

        // push to event loop to allow forms to submit
        setTimeout(function () {
            state == 'loadingText' ?
                $el.addClass(d).attr(d, d) :
                $el.removeClass(d).removeAttr(d)
        }, 0)
    }

    Button.prototype.toggle = function () {
        var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

        $parent && $parent
            .find('.active')
            .removeClass('active')

        this.$element.toggleClass('active')
    }


    /* BUTTON PLUGIN DEFINITION
     * ======================== */

    var old = $.fn.button

    $.fn.button = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('button')
                , options = typeof option == 'object' && option
            if (!data) $this.data('button', (data = new Button(this, options)))
            if (option == 'toggle') data.toggle()
            else if (option) data.setState(option)
        })
    }

    $.fn.button.defaults = {
        loadingText: 'loading...'
    }

    $.fn.button.Constructor = Button


    /* BUTTON NO CONFLICT
     * ================== */

    $.fn.button.noConflict = function () {
        $.fn.button = old
        return this
    }


    /* BUTTON DATA-API
     * =============== */

    $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
        var $btn = $(e.target)
        if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
        $btn.button('toggle')
    })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

    "use strict"; // jshint ;_;


    /* CAROUSEL CLASS DEFINITION
     * ========================= */

    var Carousel = function (element, options) {
        this.$element = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options = options
        this.options.pause == 'hover' && this.$element
            .on('mouseenter', $.proxy(this.pause, this))
            .on('mouseleave', $.proxy(this.cycle, this))
    }

    Carousel.prototype = {

        cycle: function (e) {
            if (!e) this.paused = false
            if (this.interval) clearInterval(this.interval);
            this.options.interval
            && !this.paused
            && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
            return this
        }

        , getActiveIndex: function () {
            this.$active = this.$element.find('.item.active')
            this.$items = this.$active.parent().children()
            return this.$items.index(this.$active)
        }

        , to: function (pos) {
            var activeIndex = this.getActiveIndex()
                , that = this

            if (pos > (this.$items.length - 1) || pos < 0) return

            if (this.sliding) {
                return this.$element.one('slid', function () {
                    that.to(pos)
                })
            }

            if (activeIndex == pos) {
                return this.pause().cycle()
            }

            return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
        }

        , pause: function (e) {
            if (!e) this.paused = true
            if (this.$element.find('.next, .prev').length && $.support.transition.end) {
                this.$element.trigger($.support.transition.end)
                this.cycle(true)
            }
            clearInterval(this.interval)
            this.interval = null
            return this
        }

        , next: function () {
            if (this.sliding) return
            return this.slide('next')
        }

        , prev: function () {
            if (this.sliding) return
            return this.slide('prev')
        }

        , slide: function (type, next) {
            var $active = this.$element.find('.item.active')
                , $next = next || $active[type]()
                , isCycling = this.interval
                , direction = type == 'next' ? 'left' : 'right'
                , fallback  = type == 'next' ? 'first' : 'last'
                , that = this
                , e

            this.sliding = true

            isCycling && this.pause()

            $next = $next.length ? $next : this.$element.find('.item')[fallback]()

            e = $.Event('slide', {
                relatedTarget: $next[0]
                , direction: direction
            })

            if ($next.hasClass('active')) return

            if (this.$indicators.length) {
                this.$indicators.find('.active').removeClass('active')
                this.$element.one('slid', function () {
                    var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
                    $nextIndicator && $nextIndicator.addClass('active')
                })
            }

            if ($.support.transition && this.$element.hasClass('slide')) {
                this.$element.trigger(e)
                if (e.isDefaultPrevented()) return
                $next.addClass(type)
                $next[0].offsetWidth // force reflow
                $active.addClass(direction)
                $next.addClass(direction)
                this.$element.one($.support.transition.end, function () {
                    $next.removeClass([type, direction].join(' ')).addClass('active')
                    $active.removeClass(['active', direction].join(' '))
                    that.sliding = false
                    setTimeout(function () { that.$element.trigger('slid') }, 0)
                })
            } else {
                this.$element.trigger(e)
                if (e.isDefaultPrevented()) return
                $active.removeClass('active')
                $next.addClass('active')
                this.sliding = false
                this.$element.trigger('slid')
            }

            isCycling && this.cycle()

            return this
        }

    }


    /* CAROUSEL PLUGIN DEFINITION
     * ========================== */

    var old = $.fn.carousel

    $.fn.carousel = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('carousel')
                , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
                , action = typeof option == 'string' ? option : options.slide
            if (!data) $this.data('carousel', (data = new Carousel(this, options)))
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()
        })
    }

    $.fn.carousel.defaults = {
        interval: 5000
        , pause: 'hover'
    }

    $.fn.carousel.Constructor = Carousel


    /* CAROUSEL NO CONFLICT
     * ==================== */

    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old
        return this
    }

    /* CAROUSEL DATA-API
     * ================= */

    $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
        var $this = $(this), href
            , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
            , options = $.extend({}, $target.data(), $this.data())
            , slideIndex

        $target.carousel(options)

        if (slideIndex = $this.attr('data-slide-to')) {
            $target.data('carousel').pause().to(slideIndex).cycle()
        }

        e.preventDefault()
    })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

    "use strict"; // jshint ;_;


    /* COLLAPSE PUBLIC CLASS DEFINITION
     * ================================ */

    var Collapse = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.collapse.defaults, options)

        if (this.options.parent) {
            this.$parent = $(this.options.parent)
        }

        this.options.toggle && this.toggle()
    }

    Collapse.prototype = {

        constructor: Collapse

        , dimension: function () {
            var hasWidth = this.$element.hasClass('width')
            return hasWidth ? 'width' : 'height'
        }

        , show: function () {
            var dimension
                , scroll
                , actives
                , hasData

            if (this.transitioning || this.$element.hasClass('in')) return

            dimension = this.dimension()
            scroll = $.camelCase(['scroll', dimension].join('-'))
            actives = this.$parent && this.$parent.find('> .accordion-group > .in')

            if (actives && actives.length) {
                hasData = actives.data('collapse')
                if (hasData && hasData.transitioning) return
                actives.collapse('hide')
                hasData || actives.data('collapse', null)
            }

            this.$element[dimension](0)
            this.transition('addClass', $.Event('show'), 'shown')
            $.support.transition && this.$element[dimension](this.$element[0][scroll])
        }

        , hide: function () {
            var dimension
            if (this.transitioning || !this.$element.hasClass('in')) return
            dimension = this.dimension()
            this.reset(this.$element[dimension]())
            this.transition('removeClass', $.Event('hide'), 'hidden')
            this.$element[dimension](0)
        }

        , reset: function (size) {
            var dimension = this.dimension()

            this.$element
                .removeClass('collapse')
                [dimension](size || 'auto')
                [0].offsetWidth

            this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

            return this
        }

        , transition: function (method, startEvent, completeEvent) {
            var that = this
                , complete = function () {
                    if (startEvent.type == 'show') that.reset()
                    that.transitioning = 0
                    that.$element.trigger(completeEvent)
                }

            this.$element.trigger(startEvent)

            if (startEvent.isDefaultPrevented()) return

            this.transitioning = 1

            this.$element[method]('in')

            $.support.transition && this.$element.hasClass('collapse') ?
                this.$element.one($.support.transition.end, complete) :
                complete()
        }

        , toggle: function () {
            this[this.$element.hasClass('in') ? 'hide' : 'show']()
        }

    }


    /* COLLAPSE PLUGIN DEFINITION
     * ========================== */

    var old = $.fn.collapse

    $.fn.collapse = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('collapse')
                , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('collapse', (data = new Collapse(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.collapse.defaults = {
        toggle: true
    }

    $.fn.collapse.Constructor = Collapse


    /* COLLAPSE NO CONFLICT
     * ==================== */

    $.fn.collapse.noConflict = function () {
        $.fn.collapse = old
        return this
    }


    /* COLLAPSE DATA-API
     * ================= */

    $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
        var $this = $(this), href
            , target = $this.attr('data-target')
                || e.preventDefault()
                || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
            , option = $(target).data('collapse') ? 'toggle' : $this.data()
        $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
        $(target).collapse(option)
    })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

    "use strict"; // jshint ;_;


    /* DROPDOWN CLASS DEFINITION
     * ========================= */

    var toggle = '[data-toggle=dropdown]'
        , Dropdown = function (element) {
            var $el = $(element).on('click.dropdown.data-api', this.toggle)
            $('html').on('click.dropdown.data-api', function () {
                $el.parent().removeClass('open')
            })
        }

    Dropdown.prototype = {

        constructor: Dropdown

        , toggle: function (e) {
            var $this = $(this)
                , $parent
                , isActive

            if ($this.is('.disabled, :disabled')) return

            $parent = getParent($this)

            isActive = $parent.hasClass('open')

            clearMenus()

            selectedList()

            if (!isActive) {
                $parent.toggleClass('open')
            }

            $this.focus()

            return false
        }

        , keydown: function (e) {
            var $this
                , $items
                , $active
                , $parent
                , isActive
                , index

            if (!/(38|40|27)/.test(e.keyCode)) return

            $this = $(this)

            e.preventDefault()
            e.stopPropagation()

            if ($this.is('.disabled, :disabled')) return

            $parent = getParent($this)

            isActive = $parent.hasClass('open')

            if (!isActive || (isActive && e.keyCode == 27)) {
                if (e.which == 27) $parent.find(toggle).focus()
                return $this.click()
            }

            $items = $('[role=menu] li:not(.divider):visible a', $parent)

            if (!$items.length) return

            index = $items.index($items.filter(':focus'))

            if (e.keyCode == 38 && index > 0) index--                                        // up
            if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
            if (!~index) index = 0

            $items
                .eq(index)
                .focus()
        }

    }
    function selectedList(){
        $(".drop-down ul li").click(function(){
            var selectedList = $(this).text();
            var atr = $(this).attr("datainfo");
            $(this).parent().siblings().children().eq(0).text(selectedList);
            $(this).parent().parent().attr("datainfo",atr);
        })
    }

    function clearMenus() {
        $(toggle).each(function () {
            getParent($(this)).removeClass('open')
        })
    }

    function getParent($this) {
        var selector = $this.attr('data-target')
            , $parent

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        $parent = selector && $(selector)

        if (!$parent || !$parent.length) $parent = $this.parent()

        return $parent
    }


    /* DROPDOWN PLUGIN DEFINITION
     * ========================== */

    var old = $.fn.dropdown

    $.fn.dropdown = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('dropdown')
            if (!data) $this.data('dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.dropdown.Constructor = Dropdown


    /* DROPDOWN NO CONFLICT
     * ==================== */

    $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old
        return this
    }


    /* APPLY TO STANDARD DROPDOWN ELEMENTS
     * =================================== */

    $(document)
        .on('click.dropdown.data-api', clearMenus)
        .on('click.dropdown.data-api', selectedList)
        .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
        .on('click.dropdown-menu', function (e) { e.stopPropagation() })
        .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
        .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

    "use strict"; // jshint ;_;


    /* MODAL CLASS DEFINITION
     * ====================== */

    var Modal = function (element, options) {
        this.options = options
        this.$element = $(element)
            .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
        this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
    }

    Modal.prototype = {

        constructor: Modal

        , toggle: function () {
            return this[!this.isShown ? 'show' : 'hide']()
        }

        , show: function () {
            var that = this
                , e = $.Event('show')

            this.$element.trigger(e)

            if (this.isShown || e.isDefaultPrevented()) return

            this.isShown = true

            this.escape()

            this.backdrop(function () {
                var transition = $.support.transition && that.$element.hasClass('fade')

                if (!that.$element.parent().length) {
                    that.$element.appendTo(document.body) //don't move modals dom position
                }

                that.$element.show()

                if (transition) {
                    that.$element[0].offsetWidth // force reflow
                }

                that.$element
                    .addClass('in')
                    .attr('aria-hidden', false)

                that.enforceFocus()

                transition ?
                    that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
                    that.$element.focus().trigger('shown')

            })
        }

        , hide: function (e) {
            e && e.preventDefault()

            var that = this

            e = $.Event('hide')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.modal')

            this.$element
                .removeClass('in')
                .attr('aria-hidden', true)

            $.support.transition && this.$element.hasClass('fade') ?
                this.hideWithTransition() :
                this.hideModal()
        }

        , enforceFocus: function () {
            var that = this
            $(document).on('focusin.modal', function (e) {
                if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
                    that.$element.focus()
                }
            })
        }

        , escape: function () {
            var that = this
            if (this.isShown && this.options.keyboard) {
                this.$element.on('keyup.dismiss.modal', function ( e ) {
                    e.which == 27 && that.hide()
                })
            } else if (!this.isShown) {
                this.$element.off('keyup.dismiss.modal')
            }
        }

        , hideWithTransition: function () {
            var that = this
                , timeout = setTimeout(function () {
                    that.$element.off($.support.transition.end)
                    that.hideModal()
                }, 500)

            this.$element.one($.support.transition.end, function () {
                clearTimeout(timeout)
                that.hideModal()
            })
        }

        , hideModal: function () {
            var that = this
            this.$element.hide()
            this.backdrop(function () {
                that.removeBackdrop()
                that.$element.trigger('hidden')
            })
        }

        , removeBackdrop: function () {
            this.$backdrop && this.$backdrop.remove()
            this.$backdrop = null
        }

        , backdrop: function (callback) {
            var that = this
                , animate = this.$element.hasClass('fade') ? 'fade' : ''

            if (this.isShown && this.options.backdrop) {
                var doAnimate = $.support.transition && animate

                this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                    .appendTo(document.body)

                this.$backdrop.click(
                    this.options.backdrop == 'static' ?
                        $.proxy(this.$element[0].focus, this.$element[0])
                        : $.proxy(this.hide, this)
                )

                if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

                this.$backdrop.addClass('in')

                if (!callback) return

                doAnimate ?
                    this.$backdrop.one($.support.transition.end, callback) :
                    callback()

            } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass('in')

                $.support.transition && this.$element.hasClass('fade')?
                    this.$backdrop.one($.support.transition.end, callback) :
                    callback()

            } else if (callback) {
                callback()
            }
        }
    }


    /* MODAL PLUGIN DEFINITION
     * ======================= */

    var old = $.fn.modal

    $.fn.modal = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('modal')
                , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option]()
            else if (options.show) data.show()
        })
    }

    $.fn.modal.defaults = {
        backdrop: true
        , keyboard: true
        , show: true
    }

    $.fn.modal.Constructor = Modal


    /* MODAL NO CONFLICT
     * ================= */

    $.fn.modal.noConflict = function () {
        $.fn.modal = old
        return this
    }


    /* MODAL DATA-API
     * ============== */

    $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this = $(this)
            , href = $this.attr('href')
            , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
            , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
            .modal(option)
            .one('hide', function () {
                $this.focus()
            })
    })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

    "use strict"; // jshint ;_;


    /* TOOLTIP PUBLIC CLASS DEFINITION
     * =============================== */

    var Tooltip = function (element, options) {
        this.init('tooltip', element, options)
    }

    Tooltip.prototype = {

        constructor: Tooltip

        , init: function (type, element, options) {
            var eventIn
                , eventOut
                , triggers
                , trigger
                , i

            this.type = type
            this.$element = $(element)
            this.options = this.getOptions(options)
            this.enabled = true

            triggers = this.options.trigger.split(' ')

            for (i = triggers.length; i--;) {
                trigger = triggers[i]
                if (trigger == 'click') {
                    this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
                } else if (trigger != 'manual') {
                    eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
                    eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
                    this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                    this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
                }
            }

            this.options.selector ?
                (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
                this.fixTitle()
        }

        , getOptions: function (options) {
            options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

            if (options.delay && typeof options.delay == 'number') {
                options.delay = {
                    show: options.delay
                    , hide: options.delay
                }
            }

            return options
        }

        , enter: function (e) {
            var defaults = $.fn[this.type].defaults
                , options = {}
                , self

            this._options && $.each(this._options, function (key, value) {
                if (defaults[key] != value) options[key] = value
            }, this)

            self = $(e.currentTarget)[this.type](options).data(this.type)

            if (!self.options.delay || !self.options.delay.show) return self.show()

            clearTimeout(this.timeout)
            self.hoverState = 'in'
            this.timeout = setTimeout(function() {
                if (self.hoverState == 'in') self.show()
            }, self.options.delay.show)
        }

        , leave: function (e) {
            var self = $(e.currentTarget)[this.type](this._options).data(this.type)

            if (this.timeout) clearTimeout(this.timeout)
            if (!self.options.delay || !self.options.delay.hide) return self.hide()

            self.hoverState = 'out'
            this.timeout = setTimeout(function() {
                if (self.hoverState == 'out') self.hide()
            }, self.options.delay.hide)
        }

        , show: function () {
            var $tip
                , pos
                , actualWidth
                , actualHeight
                , placement
                , tp
                , e = $.Event('show')

            if (this.hasContent() && this.enabled) {
                this.$element.trigger(e)
                if (e.isDefaultPrevented()) return
                $tip = this.tip()
                this.setContent()

                if (this.options.animation) {
                    $tip.addClass('fade')
                }

                placement = typeof this.options.placement == 'function' ?
                    this.options.placement.call(this, $tip[0], this.$element[0]) :
                    this.options.placement

                $tip
                    .detach()
                    .css({ top: 0, left: 0, display: 'block' })

                this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

                pos = this.getPosition()

                actualWidth = $tip[0].offsetWidth
                actualHeight = $tip[0].offsetHeight

                switch (placement) {
                    case 'bottom':
                        tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
                        break
                    case 'top':
                        tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
                        break
                    case 'left':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
                        break
                    case 'right':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
                        break
                }

                this.applyPlacement(tp, placement)
                this.$element.trigger('shown')
            }
        }

        , applyPlacement: function(offset, placement){
            var $tip = this.tip()
                , width = $tip[0].offsetWidth
                , height = $tip[0].offsetHeight
                , actualWidth
                , actualHeight
                , delta
                , replace

            $tip
                .offset(offset)
                .addClass(placement)
                .addClass('in')

            actualWidth = $tip[0].offsetWidth
            actualHeight = $tip[0].offsetHeight

            if (placement == 'top' && actualHeight != height) {
                offset.top = offset.top + height - actualHeight
                replace = true
            }

            if (placement == 'bottom' || placement == 'top') {
                delta = 0

                if (offset.left < 0){
                    delta = offset.left * -2
                    offset.left = 0
                    $tip.offset(offset)
                    actualWidth = $tip[0].offsetWidth
                    actualHeight = $tip[0].offsetHeight
                }

                this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
            } else {
                this.replaceArrow(actualHeight - height, actualHeight, 'top')
            }

            if (replace) $tip.offset(offset)
        }

        , replaceArrow: function(delta, dimension, position){
            this
                .arrow()
                .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
        }

        , setContent: function () {
            var $tip = this.tip()
                , title = this.getTitle()

            $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
            $tip.removeClass('fade in top bottom left right')
        }

        , hide: function () {
            var that = this
                , $tip = this.tip()
                , e = $.Event('hide')

            this.$element.trigger(e)
            if (e.isDefaultPrevented()) return

            $tip.removeClass('in')

            function removeWithAnimation() {
                var timeout = setTimeout(function () {
                    $tip.off($.support.transition.end).detach()
                }, 500)

                $tip.one($.support.transition.end, function () {
                    clearTimeout(timeout)
                    $tip.detach()
                })
            }

            $.support.transition && this.$tip.hasClass('fade') ?
                removeWithAnimation() :
                $tip.detach()

            this.$element.trigger('hidden')

            return this
        }

        , fixTitle: function () {
            var $e = this.$element
            if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
                $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
            }
        }

        , hasContent: function () {
            return this.getTitle()
        }

        , getPosition: function () {
            var el = this.$element[0]
            return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
                width: el.offsetWidth
                , height: el.offsetHeight
            }, this.$element.offset())
        }

        , getTitle: function () {
            var title
                , $e = this.$element
                , o = this.options

            title = $e.attr('data-original-title')
            || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

            return title
        }

        , tip: function () {
            return this.$tip = this.$tip || $(this.options.template)
        }

        , arrow: function(){
            return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
        }

        , validate: function () {
            if (!this.$element[0].parentNode) {
                this.hide()
                this.$element = null
                this.options = null
            }
        }

        , enable: function () {
            this.enabled = true
        }

        , disable: function () {
            this.enabled = false
        }

        , toggleEnabled: function () {
            this.enabled = !this.enabled
        }

        , toggle: function (e) {
            var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
            self.tip().hasClass('in') ? self.hide() : self.show()
        }

        , destroy: function () {
            this.hide().$element.off('.' + this.type).removeData(this.type)
        }

    }


    /* TOOLTIP PLUGIN DEFINITION
     * ========================= */

    var old = $.fn.tooltip

    $.fn.tooltip = function ( option ) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('tooltip')
                , options = typeof option == 'object' && option
            if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.tooltip.Constructor = Tooltip

    $.fn.tooltip.defaults = {
        animation: true
        , placement: 'top'
        , selector: false
        , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        , trigger: 'hover focus'
        , title: ''
        , delay: 0
        , html: false
        , container: false
    }


    /* TOOLTIP NO CONFLICT
     * =================== */

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old
        return this
    }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

    "use strict"; // jshint ;_;


    /* POPOVER PUBLIC CLASS DEFINITION
     * =============================== */

    var Popover = function (element, options) {
        this.init('popover', element, options)
    }


    /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

        constructor: Popover

        , setContent: function () {
            var $tip = this.tip()
                , title = this.getTitle()
                , content = this.getContent()

            $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
            $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

            $tip.removeClass('fade top bottom left right in')
        }

        , hasContent: function () {
            return this.getTitle() || this.getContent()
        }

        , getContent: function () {
            var content
                , $e = this.$element
                , o = this.options

            content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
            || $e.attr('data-content')

            return content
        }

        , tip: function () {
            if (!this.$tip) {
                this.$tip = $(this.options.template)
            }
            return this.$tip
        }

        , destroy: function () {
            this.hide().$element.off('.' + this.type).removeData(this.type)
        }

    })


    /* POPOVER PLUGIN DEFINITION
     * ======================= */

    var old = $.fn.popover

    $.fn.popover = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('popover')
                , options = typeof option == 'object' && option
            if (!data) $this.data('popover', (data = new Popover(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.popover.Constructor = Popover

    $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
        placement: 'right'
        , trigger: 'click'
        , content: ''
        , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })


    /* POPOVER NO CONFLICT
     * =================== */

    $.fn.popover.noConflict = function () {
        $.fn.popover = old
        return this
    }

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

    "use strict"; // jshint ;_;


    /* SCROLLSPY CLASS DEFINITION
     * ========================== */

    function ScrollSpy(element, options) {
        var process = $.proxy(this.process, this)
            , $element = $(element).is('body') ? $(window) : $(element)
            , href
        this.options = $.extend({}, $.fn.scrollspy.defaults, options)
        this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
        this.selector = (this.options.target
        || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        || '') + ' .nav li > a'
        this.$body = $('body')
        this.refresh()
        this.process()
    }

    ScrollSpy.prototype = {

        constructor: ScrollSpy

        , refresh: function () {
            var self = this
                , $targets

            this.offsets = $([])
            this.targets = $([])

            $targets = this.$body
                .find(this.selector)
                .map(function () {
                    var $el = $(this)
                        , href = $el.data('target') || $el.attr('href')
                        , $href = /^#\w/.test(href) && $(href)
                    return ( $href
                        && $href.length
                        && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
                })
                .sort(function (a, b) { return a[0] - b[0] })
                .each(function () {
                    self.offsets.push(this[0])
                    self.targets.push(this[1])
                })
        }

        , process: function () {
            var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
                , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
                , maxScroll = scrollHeight - this.$scrollElement.height()
                , offsets = this.offsets
                , targets = this.targets
                , activeTarget = this.activeTarget
                , i

            if (scrollTop >= maxScroll) {
                return activeTarget != (i = targets.last()[0])
                    && this.activate ( i )
            }

            for (i = offsets.length; i--;) {
                activeTarget != targets[i]
                && scrollTop >= offsets[i]
                && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
                && this.activate( targets[i] )
            }
        }

        , activate: function (target) {
            var active
                , selector

            this.activeTarget = target

            $(this.selector)
                .parent('.active')
                .removeClass('active')

            selector = this.selector
            + '[data-target="' + target + '"],'
            + this.selector + '[href="' + target + '"]'

            active = $(selector)
                .parent('li')
                .addClass('active')

            if (active.parent('.dropdown-menu').length)  {
                active = active.closest('li.dropdown').addClass('active')
            }

            active.trigger('activate')
        }

    }


    /* SCROLLSPY PLUGIN DEFINITION
     * =========================== */

    var old = $.fn.scrollspy

    $.fn.scrollspy = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('scrollspy')
                , options = typeof option == 'object' && option
            if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.scrollspy.Constructor = ScrollSpy

    $.fn.scrollspy.defaults = {
        offset: 10
    }


    /* SCROLLSPY NO CONFLICT
     * ===================== */

    $.fn.scrollspy.noConflict = function () {
        $.fn.scrollspy = old
        return this
    }


    /* SCROLLSPY DATA-API
     * ================== */

    $(window).on('load', function () {
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this)
            $spy.scrollspy($spy.data())
        })
    })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

    "use strict"; // jshint ;_;


    /* TAB CLASS DEFINITION
     * ==================== */

    var Tab = function (element) {
        this.element = $(element)
    }

    Tab.prototype = {

        constructor: Tab

        , show: function () {
            var $this = this.element
                , $ul = $this.closest('ul:not(.dropdown-menu)')
                , selector = $this.attr('data-target')
                , previous
                , $target
                , e

            if (!selector) {
                selector = $this.attr('href')
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
            }

            if ( $this.parent('li').hasClass('active') ) return

            previous = $ul.find('.active:last a')[0]

            e = $.Event('show', {
                relatedTarget: previous
            })

            $this.trigger(e)

            if (e.isDefaultPrevented()) return

            $target = $(selector)

            this.activate($this.parent('li'), $ul)
            this.activate($target, $target.parent(), function () {
                $this.trigger({
                    type: 'shown'
                    , relatedTarget: previous
                })
            })
        }

        , activate: function ( element, container, callback) {
            var $active = container.find('> .active')
                , transition = callback
                    && $.support.transition
                    && $active.hasClass('fade')

            function next() {
                $active
                    .removeClass('active')
                    .find('> .dropdown-menu > .active')
                    .removeClass('active')

                element.addClass('active')

                if (transition) {
                    element[0].offsetWidth // reflow for transition
                    element.addClass('in')
                } else {
                    element.removeClass('fade')
                }

                if ( element.parent('.dropdown-menu') ) {
                    element.closest('li.dropdown').addClass('active')
                }

                callback && callback()
            }

            transition ?
                $active.one($.support.transition.end, next) :
                next()

            $active.removeClass('in')
        }
    }


    /* TAB PLUGIN DEFINITION
     * ===================== */

    var old = $.fn.tab

    $.fn.tab = function ( option ) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('tab')
            if (!data) $this.data('tab', (data = new Tab(this)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.tab.Constructor = Tab


    /* TAB NO CONFLICT
     * =============== */

    $.fn.tab.noConflict = function () {
        $.fn.tab = old
        return this
    }


    /* TAB DATA-API
     * ============ */

    $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

    "use strict"; // jshint ;_;


    /* TYPEAHEAD PUBLIC CLASS DEFINITION
     * ================================= */

    var Typeahead = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.typeahead.defaults, options)
        this.matcher = this.options.matcher || this.matcher
        this.sorter = this.options.sorter || this.sorter
        this.highlighter = this.options.highlighter || this.highlighter
        this.updater = this.options.updater || this.updater
        this.source = this.options.source
        this.$menu = $(this.options.menu)
        this.shown = false
        this.listen()
    }

    Typeahead.prototype = {

        constructor: Typeahead

        , select: function () {
            var val = this.$menu.find('.active').attr('data-value')
            this.$element
                .val(this.updater(val))
                .change()
            return this.hide()
        }

        , updater: function (item) {
            return item
        }

        , show: function () {
            var pos = $.extend({}, this.$element.position(), {
                height: this.$element[0].offsetHeight
            })

            this.$menu
                .insertAfter(this.$element)
                .css({
                    top: pos.top + pos.height
                    , left: pos.left
                })
                .show()

            this.shown = true
            return this
        }

        , hide: function () {
            this.$menu.hide()
            this.shown = false
            return this
        }

        , lookup: function (event) {
            var items

            this.query = this.$element.val()

            if (!this.query || this.query.length < this.options.minLength) {
                return this.shown ? this.hide() : this
            }

            items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

            return items ? this.process(items) : this
        }

        , process: function (items) {
            var that = this

            items = $.grep(items, function (item) {
                return that.matcher(item)
            })

            items = this.sorter(items)

            if (!items.length) {
                return this.shown ? this.hide() : this
            }

            return this.render(items.slice(0, this.options.items)).show()
        }

        , matcher: function (item) {
            return ~item.toLowerCase().indexOf(this.query.toLowerCase())
        }

        , sorter: function (items) {
            var beginswith = []
                , caseSensitive = []
                , caseInsensitive = []
                , item

            while (item = items.shift()) {
                if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
                else if (~item.indexOf(this.query)) caseSensitive.push(item)
                else caseInsensitive.push(item)
            }

            return beginswith.concat(caseSensitive, caseInsensitive)
        }

        , highlighter: function (item) {
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
            return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            })
        }

        , render: function (items) {
            var that = this

            items = $(items).map(function (i, item) {
                i = $(that.options.item).attr('data-value', item)
                i.find('a').html(that.highlighter(item))
                return i[0]
            })

            items.first().addClass('active')
            this.$menu.html(items)
            return this
        }

        , next: function (event) {
            var active = this.$menu.find('.active').removeClass('active')
                , next = active.next()

            if (!next.length) {
                next = $(this.$menu.find('li')[0])
            }

            next.addClass('active')
        }

        , prev: function (event) {
            var active = this.$menu.find('.active').removeClass('active')
                , prev = active.prev()

            if (!prev.length) {
                prev = this.$menu.find('li').last()
            }

            prev.addClass('active')
        }

        , listen: function () {
            this.$element
                .on('focus',    $.proxy(this.focus, this))
                .on('blur',     $.proxy(this.blur, this))
                .on('keypress', $.proxy(this.keypress, this))
                .on('keyup',    $.proxy(this.keyup, this))

            if (this.eventSupported('keydown')) {
                this.$element.on('keydown', $.proxy(this.keydown, this))
            }

            this.$menu
                .on('click', $.proxy(this.click, this))
                .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
                .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
        }

        , eventSupported: function(eventName) {
            var isSupported = eventName in this.$element
            if (!isSupported) {
                this.$element.setAttribute(eventName, 'return;')
                isSupported = typeof this.$element[eventName] === 'function'
            }
            return isSupported
        }

        , move: function (e) {
            if (!this.shown) return

            switch(e.keyCode) {
                case 9: // tab
                case 13: // enter
                case 27: // escape
                    e.preventDefault()
                    break

                case 38: // up arrow
                    e.preventDefault()
                    this.prev()
                    break

                case 40: // down arrow
                    e.preventDefault()
                    this.next()
                    break
            }

            e.stopPropagation()
        }

        , keydown: function (e) {
            this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
            this.move(e)
        }

        , keypress: function (e) {
            if (this.suppressKeyPressRepeat) return
            this.move(e)
        }

        , keyup: function (e) {
            switch(e.keyCode) {
                case 40: // down arrow
                case 38: // up arrow
                case 16: // shift
                case 17: // ctrl
                case 18: // alt
                    break

                case 9: // tab
                case 13: // enter
                    if (!this.shown) return
                    this.select()
                    break

                case 27: // escape
                    if (!this.shown) return
                    this.hide()
                    break

                default:
                    this.lookup()
            }

            e.stopPropagation()
            e.preventDefault()
        }

        , focus: function (e) {
            this.focused = true
        }

        , blur: function (e) {
            this.focused = false
            if (!this.mousedover && this.shown) this.hide()
        }

        , click: function (e) {
            e.stopPropagation()
            e.preventDefault()
            this.select()
            this.$element.focus()
        }

        , mouseenter: function (e) {
            this.mousedover = true
            this.$menu.find('.active').removeClass('active')
            $(e.currentTarget).addClass('active')
        }

        , mouseleave: function (e) {
            this.mousedover = false
            if (!this.focused && this.shown) this.hide()
        }

    }


    /* TYPEAHEAD PLUGIN DEFINITION
     * =========================== */

    var old = $.fn.typeahead

    $.fn.typeahead = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('typeahead')
                , options = typeof option == 'object' && option
            if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.typeahead.defaults = {
        source: []
        , items: 8
        , menu: '<ul class="typeahead dropdown-menu"></ul>'
        , item: '<li><a href="#"></a></li>'
        , minLength: 1
    }

    $.fn.typeahead.Constructor = Typeahead


    /* TYPEAHEAD NO CONFLICT
     * =================== */

    $.fn.typeahead.noConflict = function () {
        $.fn.typeahead = old
        return this
    }


    /* TYPEAHEAD DATA-API
     * ================== */

    $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
        var $this = $(this)
        if ($this.data('typeahead')) return
        $this.typeahead($this.data())
    })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

    "use strict"; // jshint ;_;


    /* AFFIX CLASS DEFINITION
     * ====================== */

    var Affix = function (element, options) {
        this.options = $.extend({}, $.fn.affix.defaults, options)
        this.$window = $(window)
            .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
            .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
        this.$element = $(element)
        this.checkPosition()
    }

    Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) return

        var scrollHeight = $(document).height()
            , scrollTop = this.$window.scrollTop()
            , position = this.$element.offset()
            , offset = this.options.offset
            , offsetBottom = offset.bottom
            , offsetTop = offset.top
            , reset = 'affix affix-top affix-bottom'
            , affix

        if (typeof offset != 'object') offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function') offsetTop = offset.top()
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

        affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
            false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
            'bottom' : offsetTop != null && scrollTop <= offsetTop ?
            'top'    : false

        if (this.affixed === affix) return

        this.affixed = affix
        this.unpin = affix == 'bottom' ? position.top - scrollTop : null

        this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
    }


    /* AFFIX PLUGIN DEFINITION
     * ======================= */

    var old = $.fn.affix

    $.fn.affix = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('affix')
                , options = typeof option == 'object' && option
            if (!data) $this.data('affix', (data = new Affix(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.affix.Constructor = Affix

    $.fn.affix.defaults = {
        offset: 0
    }


    /* AFFIX NO CONFLICT
     * ================= */

    $.fn.affix.noConflict = function () {
        $.fn.affix = old
        return this
    }


    /* AFFIX DATA-API
     * ============== */

    $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
            var $spy = $(this)
                , data = $spy.data()

            data.offset = data.offset || {}

            data.offsetBottom && (data.offset.bottom = data.offsetBottom)
            data.offsetTop && (data.offset.top = data.offsetTop)

            $spy.affix(data)
        })
    })


}(window.jQuery);var Lava = Lava || {};

Lava.RELEASE = false;

Lava.version = '0.0.1';

Lava.global = this;

Lava.locale = 'cn';

Lava.modual = {};

Lava.tswitch = false;//drag开关

Lava.tmnTimeout = 0;

Lava.targ = {};

Lava.shareCallback = 0;

Lava.namespace = function(namespaces, callback) { // 命名空间
    var nsArr = namespaces.split('.'), o;
    o = window[nsArr[0]] = window[nsArr[0]] || {};
    $.each(nsArr.slice(1), function(i, n) {
        o = o[n] = o[n] || {};
    });
    var mod = nsArr.slice(-1);
    if (!Lava.modual[mod]) {
        Lava.modual[mod] = {};
    }
    Lava.modual[mod].ns = namespaces;
    if (callback && typeof callback === 'function') callback.call(o);
};

Lava.importMD =  function(module, callback) { // 导入模块，根据模块名
    callback = callback || function() {};
    if (Lava.modual[module] && Lava.modual[module].ns) {
        callback.call(eval(Lava.modual[module].ns));
    } else {
        var url = 'http://'+stHost+'/js/module/lava.'+module+'.js';
        Lava.importScript(url, function() {
            if (!Lava.modual[module] || !Lava.modual[module].ns) {
                var timer = setInterval(function(){
                    //console.log('timer '+url);
                    if (Lava.modual[module] && Lava.modual[module].ns) {
                        clearInterval(timer);
                        callback.call(eval(Lava.modual[module].ns));
                    }
                },100);
            } else {
                callback.call(eval(Lava.modual[module].ns));
            }
        });
    }
};

Lava.importScript =function(scriptPath, callback){
    var headTag = document.getElementsByTagName("head")[0];
    var scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    if (callback) {
        // IE9/10同时支持onreadystatechange & onload
        scriptTag.onload = scriptTag.onreadystatechange = function() {
            if (this.over) {
                return;
            }
            this.over = true;
            if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                callback();
            }else if (this.readyState == 'loading') {
                setTimeout(callback,100);
            }
        };
    }
    scriptTag.src = scriptPath+ '?'+Math.random();
    headTag.appendChild(scriptTag);
};

Lava.create = function(childCtor, parentCtor) { // 创建类或子类
    var sb = function(){};
    if (!parentCtor || typeof parentCtor === 'object') {
        sb.prototype = childCtor;
    } else {
        var sp = function() {};
        sp.prototype = parentCtor.prototype;
        sb.prototype = new sp();
        sb.supr = sp.prototype;
        $.extend(sb.prototype, childCtor);
    }
    sb.prototype.constructor = function() {};
    return sb;
};

Lava.util = { // 工具集,
    email: function(obj){
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        if(reg.exec(obj))return true;
        else return false;
    },
    //判断空
    empty: function(obj) {
        for (var p in obj) { return false; }
        return true;
    },
    //转数组
    toArray: function(arrLike) {
        return Array.prototype.slice(arrLike);
    },
    //获最大宽度
    lw:function(el) {
        var w = $(el).width() + parseInt($(el).css('padding-left'))*2+parseInt($(el).css('margin-left'))*2;
        return w;
    },
    //判断两个对象是否相等
    eq:function(obj1, obj2) {
        if (obj1 == null && obj2 == null) return true;
        if (obj1 == null || obj2 == null) return false;
        //判断两个对象是否相等
        for(var p in obj1) {
            if (obj2[p] != obj1[p]) return false;
        }
        for(var p in obj2) {
            if (obj2[p] != obj1[p]) return false;
        }
        return true;
    },
    //解释?后面参数
    parseQuery:function(query) {
        if (query.substr(0,1) === '#') {
            query = query.substr(1);
        }
        var object = {};
        var pairs = query.split('&');
        for(var i = 0; i < pairs.length; i++){
            var pair = pairs[i];
            var pos = pair.indexOf('=');
            if(pos !== -1){
                object[pair.substr(0,pos)] = pair.substr(pos+1);
            }else if (pair !== ''){
                object[pair] = true;
            }
        }
        return object;
    },
    buildQuery: function(args) {
        var query = [];
        for(var p in args) {
            var type = typeof args[p];
            if (type === 'number' || type === 'string') {
                var v = args[p];
                if (type === 'string' && v.indexOf('%') === -1) {
                    v = encodeURIComponent(v);
                }
                query.push(p+'='+v);
            }
        }
        return query.join('&');
    },
    itemMenu:function(args,ev) {
        var query = Lava.util.buildQuery(args);
        if (args.type == 1) {
            Lava.util.loadMenu({url:'/util/songmenu?'+query},ev,args.dir);
        } else if (args.type == 2) {
            Lava.util.loadMenu({url:'/util/programmenu?'+query},ev,args.dir);
        } else if (args.type == 3) {
            Lava.util.loadMenu({url:'/util/salbummenu?'+query},ev,args.dir);
        } else if (args.type == 4) {
            Lava.util.loadMenu({url:'/util/channelmenu?'+query},ev,args.dir);
        }
    },
    menumiss:function(){
        if (!$('.pop-menu').data('menuing')) {
            $('.pop-menu').remove();
        }
    },
    loadMenu: function(args,ev,dir) {
        if ($('.pop-menu').length === 0) {
            $(document.body).append('<div class="pop-menu"></div>');
        }
        $('.pop-menu').data('menuing',1);

        Lava.util.loadPage('.pop-menu', args.url, function() {
            $('.pop-menu').find('li').each(function(idx,el){
                if (!$(el).hasClass('disabled')) {
                    $(el).click(function(){
                        if($(this).hasClass('lava-submenu'))return;
                        Lava.util.menumiss();
                    });
                    $(".cancel-style").click(function(){Lava.util.menumiss();});
                }
            });
            var p = parseInt(dir);

            $('.pop-menu').show();

            var pos = Lava.util.location('.pop-menu',ev,p);
            $('.pop-menu').css({left:pos.x+'px',top:pos.y+'px'});

            var menuw = $('.pop-menu .lava-menu').width();

            $('.pop-menu .lava-menu .lava-submenu').hover(function(sev){
                var lm = $(this).find('.lava-menu');
                if (lm.height() < parseInt(lm.css('max-height'))) {
                    lm.height(lm.find('.scroll-content').height()+lm.find('.menu-footer').height());
                }
                if (lm.find('.scroll-content').width() > lm.width()) {
                    lm.width(lm.find('.scroll-content').width()+8);
                }
                var subpos = $(this).position();
                if (pos.x + menuw + lm.width() > $(window).width()) {
                    lm.css({left:-lm.width()-2+'px'});
                }
                var bottom = pos.y + subpos.top + lm.height();
                if (bottom > $(window).height()) {
                    lm.css({top:-lm.height()+'px'});
                }
            });
            $('.pop-menu').data('menuing',0);
        });
    },
    initDocumentListener:function(){
        $(document).bind('click',function(ev){
            var toppop = Lava.util._pop.slice(-1);
            if (toppop) {
                var pos = $(toppop).position();
                var el = ev.target || ev.srcElement;
                if ($(el).parents('.popup').length == 0 && !$(el).hasClass('popup')) {
                    Lava.util.popmiss(1);
                }
            }
            var pos = $('.pop-menu').position();
            if (pos) {
                var wd = $('.pop-menu').width();
                var ht = $('.pop-menu').height();
                if (ev.clientX < pos.left || ev.clientX > (pos.left + wd) ||
                    ev.clientY < pos.top || ev.clientY > (pos.top + ht)) {
                    Lava.util.menumiss();
                }
            }
        });
        $(document).bind('keyup',function(ev){
            //pagedown 34 下箭头40, pageup 33  上箭头38
            var k = ev.keyCode;
            if (k !== 34 && k != 40 && k !== 33 && k != 38) {
                return;
            }

            var scroller = $(document).data('scroller');
            if (scroller && $(scroller).children('.scrollbar').length > 0) {
                //一次滚动一个page的高度
                var h = $(scroller).height();
                var baseh = Math.abs(parseInt($(scroller).children('.scroll-content').css('top')));
                var scrollh = Math.max(0,baseh + ((k===34||k==40)?h:-h));
                //console.log(h,baseh,scrollh);
                Lava.util.scrollPos($(scroller).children('.scroll-content'),
                    $(scroller).children('.scrollbar').children('.buck'),
                    { h:scrollh }
                );
            }
        });

        $(window).bind('popstate',function(state){
            //console.log('popstate',state);
        });
    },
    _pop:[],
    popmiss:function(number) {
        if (this._poping) {
            return;
        }
        if (!number) number = 1;
        else if(typeof number === 'object') number = 1;
        while(number > 0) {
            var p = Lava.util._pop.pop();
            if(navigator.userAgent.indexOf("MSIE 10.0") > 0 || navigator.userAgent.indexOf("MSIE 9.0") > 0){//remove function in ie9+ is not work
                if(p) document.body.removeChild(p);
            }else{
                if (p) $(p).remove();
            }
            number --;
        }
        if (Lava.util._pop.length === 0) {
            $(document.body).children('.foggy1.background').remove();
        }
    },
    //用于提示框功能
    popup:function(url,css) {
        var bg = $(document.body).children('.foggy1.background');
        if (bg.length === 0) {
            $(document.body).append('<div class="foggy1 background"></div>');
        }

        var div = document.createElement('div');
        div.className = 'popup modal fade';
        div.innerHTML = '<div class="loading"></div>';
        $(document.body).append(div);
        Lava.util._pop.push(div);
        if (css) {
            $(div).addClass(css);
        }

        //把弹出框显示出来，因为里面有加载菊花
        $(div).addClass('in');
        this._poping = 1;
        Lava.util.loadPage(div,url, function(){
            //重新计算下位置，因为加载出内容后区域size可能变化
            $(div).css({'margin-left':-$(div).width()/2+'px'});
            if(($(window).height()-$(div).height())/2 < $(window).height()/10){
                $(div).css({'top':($(window).height()-$(div).height())/2+'px'});
            }
            Lava.util._poping = 0;
        });
    },
    location:function(elem,ev,dir){
        var x = ev.clientX;
        var y = ev.clientY;
        var pos = {x:x,y:y};

        var ww = $(window).width(), wh = $(window).height();
        var ew = $(elem).outerWidth(),eh = $(elem).outerHeight();
        switch(dir){
            case 1: // right down
                if((ww - x)>ew) {  pos.x = x; }
                else { pos.x = ww - ew - 10;}

                if ((wh-y)>eh){   pos.y = y; }
                else { pos.y = wh - eh - 10; }

                return pos;
            case 2://right up
                if((ww-x)>ew) { pos.x = x; }
                else { pos.x = ww - ew - 10; }

                if (y>eh) { pos.y = y - eh; }
                else { pos.y = 10;}

                return pos;
            case 3://left up
                if(x>ew) { pos.x = x - ew; }
                else { pos.x = 10; }

                if (y>eh){ pos.y = y - eh; }
                else { pos.y = 10;}

                return pos;
            case 4: //left down
                if(x>ew) { pos.x = x - ew;}
                else { pos.x = 10; }

                if ((wh-y)>eh){   pos.y = y; }
                else { pos.y = wh - eh - 10; }

                return pos;
            case 5: //center
                pos.x = (ww-ew)/2;
                pos.y = (wh-eh)/2;
                return pos;
            case 6: //dropdown btn
                pos.x = $(ev.target||ev.srcElement).offset().left;
                pos.y = $(ev.target||ev.srcElement).offset().top + $(ev.target||ev.srcElement).outerHeight();
                return pos;
            default :
                if((ww-x)>x){
                    if((wh-y)<y){
                        return Lava.util.location(elem,ev,2);
                    }else{
                        return Lava.util.location(elem,ev,1);
                    }
                }else{
                    if((wh-y)<y){
                        return Lava.util.location(elem,ev,3);
                    }else{
                        return Lava.util.location(elem,ev,4);
                    }
                }
        }
    },
    //item draggable
    draggableItem: function(){
        $(".content-style .drag").draggable({ helper: function(event) {
            var $dragtemp = $('<div class="dragtemp"></div>');
            var src = $(this).children('.item-logo').children('a').children('img').attr('src');
            var $img = $('<img src="" class="dt-img temp-img"/>');
            $img.attr('src',src);
            $dragtemp.append($img);
            $('.temp-img').attr('src',src);
            var num = $(this).find('.song-num').text();
            var $dtnum = $('<div class="dt-num">'+num+'</div>');
            var it1 = $(this).find('.it1').text();
            var it2 = $(this).find('.it2').text();
            $dragtemp.append($dtnum);
            var $dragcon = $('<div class="dt-cont"></div>');
            $dragcon.append('<div>'+it1+'</div>');
            $dragcon.append('<div class="art">'+it2+'</div>');
            $dragtemp.append($dragcon);
            $dragtemp.append('<i class="addimg icond-addimg"></i>');
            return $dragtemp;
        },
            cursor: 'pointer',
            cursorAt: {top:-10,left:10},
            start:function(event,ui){
                $('.lava-edit-p').addClass('hover');
                Lava.ui.programDropable();
                //ui.helper.find('.item-logo').removeClass('y-hover');
                //ui.helper.find('.ssr').remove();
            },
            stop: function(event,ui){
                $('.lava-edit-p').removeClass('hover');
            },
            zIndex:200, opacity: 0.9, appendTo:$(".draggable-li-insert")});
    },
    //song draggable
    draggableSongList: function(){

        $(".i-play-item").draggable({ helper: function(){
                var $slHelper = $('<div class="slHelper"></div>');
                var sname = $(this).find('.ssl-song-name > a').text() || $(this).find('.truncated_line > a').text() || $(this).find('.artist-name > a').text();
                var saname = $(this).find('.ssl-artist-name > a').text() || $(this).find('.metadata > a').text() || $(this).find('.artist-detail a').text();
                var stime = $(this).find('.ssr-time').text() || $(this).find('.duration').text();
                var $sl1 = $('<span class="sl1">'+sname+'</span>');
                var $sl2 = $('<span class="sl2">'+saname+'</span>');
                var $sl3 = $('<span class="sl3">'+stime+'</span>');
                $slHelper.append($sl1).append($sl2).append($sl3).append('<i class="addimg icond-addimg"></i>');
                return $slHelper;
            },
                cursor: 'pointer',
                cursorAt: {top: -10,left: 10},
                start:function(event,ui){
                    $('.lava-edit-p').addClass('hover');
                    Lava.ui.programDropable();
                    //ui.helper.removeClass('hover');
                    //ui.helper.find('.ssr').remove();
                },

                stop: function(event,ui){
                    $('.lava-edit-p').removeClass('hover');
                },
                zIndex:200, opacity: 0.9,appendTo:$(".draggable-li-insert")}
        );
        $(".i-play-item.dragDisabled").draggable('disable');
        $(".i-play-item.search-program").draggable('disable');
    },
    //index-left-itemList draggable
    draggableItemList: function(){
        $('.app-main-nav ul.lava-edit-p > li').draggable({
            helper: 'clone',
            cursor: 'pointer',
            cursorAt: {top: -10,left: 10},
            start: function(event,ui){
                ui.helper.addClass('dragged');
                Lava.ui.programSortDropable();
            },
            stop: function(event,ui){
                ui.helper.removeClass('dragged');
            },
            zIndex: 200,opacity: 0.9,appendTo: $(".draggable-li-insert")
        });
    },
    moduleselected: function(){
        Lava.util.bindEvent('.sidebar-nav>ul>li>ul>li','click',function(){
            $('.sidebar-nav>ul>li>ul>li.moduleselected').removeClass('moduleselected');
            $(this).addClass('moduleselected');
        });
        Lava.util.bindEvent('.switch-nav>ul>li','click',function(){
            $(this).parent().find('.selected').removeClass('selected');
            $(this).addClass('selected');
        });
    },
    initLavaPage:function(resize){
        if(window._u && (_u.pri_create_program == 1 || _u.pri_audit_program == 1)){
            Lava.util.draggableSongList();
            Lava.util.draggableItem();
            Lava.util.draggableItemList();
        }
        if (resize !== true) {
            Lava.util.lavaHover();
            Lava.util.moduleselected();
        }
        Lava.util.initScrollable();
        Lava.util.initResizable();
        Lava.util.initScrollable();
    },
    nextPage:function(scroll) {
        var pager = Lava.util.pager();
        if (!pager) { return;  }
        //自动加载下一页
        var oldurl = $(scroll).attr('href');
        if (!oldurl) {
            Lava.util.pager(pager);
            return;
        }
        Lava.util.pager(0); //临时关闭翻页
        var url = oldurl;
        if ((pos = url.indexOf('?')) !== -1) {
            var args = Lava.util.parseQuery(url.substr(pos+1));
            args._sz = 40;
            if (!parseInt(args._pn)) args._pn = 1;
            else args._pn = parseInt(args._pn) + 1;
            url = url.substr(0,pos)+'?'+Lava.util.buildQuery(args);
        } else {
            url = url + '?_pn=1&_sz=40';
        }
        $.get(url).done(function(res){
            var newurl = $(scroll).attr('href');
            if (oldurl !== newurl) {
                //说明翻页还没加载出来，就点了另外一页了
                $(scroll).attr('pager',1);;//打开翻页
                return;
            }
            var html = res.replace(/<\/?[a-zA-Z][^/>]+\/?>/g,'').trim();
            if (html !== '') {
                //如果没有更多内容就不翻页了。
                Lava.util.pager(1);//打开翻页
                $(scroll).attr('href',url);
                $(scroll).find('.content-style').children('.clear').remove();
                $(scroll).find('.content-style').append(res);
                $(scroll).find('.search-page-content').children('.clear').remove();
                $(scroll).find('.search-page-content').append(res);
                var call = url.substr(1,url.indexOf('?')-1);
                var args = call.split('/');
                var mod = args[0].substr(0, 1).toUpperCase() + args[0].substr(1);
                if (Lava.modual['_cache_'+mod]) {
                    //调用目标模块的initUI框架，初始化一些ui效果
                    Lava.modual['_cache_'+mod].initializeUI(mod,args[1]);
                }
                Lava.util.initLavaPage();
            }
        });
    },
    pager:function(pager){
        var elem = '#app-main-wrapper>.module-content';
        if (pager === undefined) {
            pager = $(elem).attr('pager');
            return parseInt(pager)?1:0;
        }
        $(elem).attr('pager',parseInt(pager)?1:0);
    },
    //加载页面显示
    loadPage:function(css, url,callback) {
        $(css).attr('href',url);
        $(".app-main-wrapper:gt(0)").remove();

        htmlschema = 'html://';
        if(url.indexOf(htmlschema)==0){ //如果只需要展现html
            html = url.substr(htmlschema.length); //去掉 schame
            $(css).html(html);
            //手写的html代码需要初始化滚动条
            Lava.util.initScrollable(css);
            if (callback) callback.call(this);
        }else{
            if (!/_sz=/.test(url)) {
                if (url.indexOf('?') !== -1) {
                    url += '&_sz=40';
                } else {
                    url += '?_sz=40';
                }
            }
            if (url.indexOf('?') === -1) {
                url += '?_t='+new Date().getTime();
            } else {
                url += '&_t='+new Date().getTime();
            }
            $(css).load(url, function(){
                Lava.util.initLavaPage();
                if (callback) callback.call(this);
                $('.foggy-load').removeClass('on');

            });
        }
    },
    goPage:function(module,action,args){
        var query = Lava.util.buildQuery(args);
        location.hash = '#module='+module+'&action='+action + (query?('&'+query):'');
    },
    refreshPage:function() {
        $('.foggy-load').addClass('on');
        var callInfo = Lava.util.parseQuery(location.href.substr(location.href.indexOf('#')));
        var f = callInfo['f'];
        this.callPage(callInfo);
        if (f) {
            callInfo['f'] = f;
            setTimeout(function(){
                Lava.util.callFunc(callInfo);
            },2000);
        }
    },
    //调用#后面页面，没有默认为browse，weatherRadio
    callPage:function(callInfo) {
        var module = callInfo['module'] || 'browse';
        var action = callInfo['action'] || 'weatherRadio';
        var arg = callInfo;
        delete arg['module'];
        delete arg['action'];
        Lava.importMD(module, function() {
            var mod = module.substr(0, 1).toUpperCase() + module.substr(1);
            if (Lava.modual['_cache_'+mod]) {
                return Lava.modual['_cache_'+mod].initialize(module, action, arg);
            }
            var modobj = new this[mod]();
            Lava.modual['_cache_'+mod] = modobj;
            return modobj.initialize(module, action, arg);
        });
    },
    callModFunc:function(mod,act,args,ev){
        Lava.importMD(mod, function() {
            mod = mod.substr(0, 1).toUpperCase() + mod.substr(1);
            if (Lava.modual['_cache_'+mod]) {
                Lava.modual['_cache_'+mod][act](args,ev);
            } else {
                var modobj = new this[mod]();
                Lava.modual['_cache_'+mod] = modobj;
                modobj[act](args,ev);
            }
        });
    },
    callFunc:function(args,ev){
        if (args['f']) {
            var self = this;
            var fn = eval(args['f']);
            delete args['f'];
            if (fn) fn.call(self, args,ev);
        } else if (args['module'] && args['action']) {
            var mod = args['module'], act = args['action'];
            delete args['module'];
            delete args['action'];
            Lava.util.callModFunc(mod,act,args,ev);
        }
    },
    callback:function(res){
        //和hapn server的callback机制结合。支持callFunc和callPage
        var call = res.data;
        if (call.func) {
            delete call.func;
            this.callFunc(call);
        }
        if (call.page) {
            delete call.page;
            this.callPage(call);
        }
    },
    //对parent下面的所有有cssName的元素绑定事件，事件处理函数为元素action属性所指定
    lavaBind:function() {
        $(document).on('click','.lava-bind',function(ev){
        	pl._isProgramsList=-1;
            var action = $(this).attr('action');
            if (action) {
                //执行action指定函数
                var args = Lava.util.parseQuery(action);
                Lava.util.callFunc.call(this,args,ev);
                ev.stopPropagation();
                ev.preventDefault();
            }
        });
        $(document).on('click','.pagination>ul>li',function(ev){
        	pl._isProgramsList=-1;
            if ($(this).hasClass('disabled')) return;

            var idx = $(this).attr('idx');
            var action = $(this.parentNode).attr('action');
            var args = Lava.util.parseQuery(action);
            args.idx = idx;
            Lava.util.callFunc(args);
            var setting = {
                total:  $(this).parent().attr('total'),
                size:  $(this).parent().attr('size'),
                idx:idx
            };
            Lava.ui.pager($(this).parent().attr('elem'),action,setting);
        });

        //处理歌曲列表的播放
        $(document).on('click',".i-play-icon,.i-play",function(){
        	pl._isProgramsList=-1;
            var iPlayItem = $(this).parents('.i-play-item');
            var args = Lava.util.parseQuery(iPlayItem.attr('args')||$(this).attr('args'));
            var play = args.play;
            delete args.play;

            var order = parseInt(iPlayItem.find('.showOrder').text().trim());
            if (order) {
                args.idx = order-1;
            }
            var st = Lava.player.checkPlayStatus(args);
            if (st === 0) { //未播放状态
                Lava.player.switchIcon(iPlayItem.find('.i-play-icon'),true);
                if (play) {
                    var func = 'play'+play;
                    delete args.song_id;
                    Lava.player[func](args);
                } else {
                    //直接播放单曲
                    Lava.player.playSong(args.song_id);
                }
            } else {
                if (st === 1) {
                    Lava.player.pause();
                    Lava.player.switchIcon(iPlayItem.find('.i-play-icon'));
                } else {
                    Lava.player.resume();
                    Lava.player.switchIcon(iPlayItem.find('.i-play-icon'),true);
                }
            }
        });

        $(document).on('click',".i-play-iconee,.i-play",function(){
            var iPlayItem = $(this).parents('.i-play-item');
            var programinfos = $('.item');
            if(programinfos.size() > 1){
            	pl._isProgramsList=1;
            	_p.isprogramsList(pl._isProgramsList);
                var recommendPrograms='';
                var programs='';
            	if(!_u || _u.isVip==0){
            		//not vip
            		for (var int = 0; int < programinfos.length; int++) {
            			if(programinfos.eq(int).find('.item-logo').find('.grids1').find('.item-vip-bg').length==0){
            				if($('.item').eq(int).find('.item-info').find('.item-type').find('.it1').find('img').length>0){
            					//推荐节目
            					recommendPrograms+=programinfos.eq(int).attr("id").substring(7)+',';
            				}else{
            					programs+=programinfos.eq(int).attr("id").substring(7)+',';
            				}
            			}
            		}
            	}else{
            		for (var int = 0; int < programinfos.length; int++) {
            			if($('.item').eq(int).find('.item-info').find('.item-type').find('.it1').find('img').length>0){
        					//推荐节目
        					recommendPrograms+=programinfos.eq(int).attr("id").substring(7)+',';
        				}else{
        					programs+=programinfos.eq(int).attr("id").substring(7)+',';
        				}
        			}
            	}
	            var recommendProgramsArray = recommendPrograms.split(",");
	            recommendProgramsArray.pop();
	            recommendProgramsArray = Lava.util.arrayUnordered(recommendProgramsArray);
	            var programsArray = programs.split(",");
	            programsArray.pop();
	            programsArray = Lava.util.arrayUnordered(programsArray);;
	            pl._programsList = recommendProgramsArray.concat(programsArray);
	            var program_id = pl._programsList[0];
	            var args = Lava.util.parseQuery('sync=0&type=2&program_id='+program_id+'&collect=collect');
	            args.program_id =program_id;
	            Lava.player.playProgram(args);
            }else if(programinfos.size() == 1){
              var args = Lava.util.parseQuery('sync=0&type=2&program_id='+programinfos.eq(0).attr("id").substring(7)+'&collect=collect');
              args.program_id = programinfos.eq(0).attr("id").substring(7);
              Lava.player.playProgram(args);
            }
        });

        function gandom(contrast,ocbject){
            var Locations = parseInt(Math.random()*ocbject.size());
            if(ocbject.eq(Locations).attr("id") == 'program'+contrast){
            }else{
                return Locations
            }
        }

        $(document).on('click',".playable .add",function(ev){
        	pl._isProgramsList=-1;
            //处理菜单
            var args = Lava.util.parseQuery($(this).parents('.playable').attr('args'));
            if (args.type == '2') {
                Lava.ui.pmenu(args,ev);
            } else if (args.type == '1') {
                Lava.ui.smenu(args,ev);
            } else {
                Lava.util.itemMenu(args,ev);
            }
        });
        $(document).on('click','.collapse-header',function(ev){
        	pl._isProgramsList=-1;
            //折叠
            var next = $(this).next();
            if (next.css('display') == 'none') {
                next.slideDown();
            } else {
                next.slideUp();
            }
        });
        $(document).on('click',".playable .play",function(ev){
        	pl._isProgramsList=-1;
            var args = Lava.util.parseQuery($(this).parents('.playable').attr('args'));
            var st = Lava.player.checkPlayStatus(args);
            if (st === 1) { //已经在播放了，就暂停
                Lava.player.pause();
                $(this).removeClass('iconc-pause').addClass('iconc-play');
            } else if (st === 2) { //已经暂停了就继续播
                Lava.player.resume();
                $(this).removeClass('iconc-play').addClass('iconc-pause');

            } else {
                if (args.type === '2') {
                    Lava.player.playProgram(args);
                }
                if (args.type === '3') {
                    Lava.player.playSAlbum(args);
                }
                $(this).removeClass('iconc-play').addClass('iconc-pause');
            }
        });
        Lava.util.searchFunc();

    },
    //播放下一节目
    programsList:function() {
        pl._programscount++;
        if(pl._programscount>= pl._programsList.length){
        	pl._programscount=0;
        }
        var program_id = pl._programsList[pl._programscount];
        var args = Lava.util.parseQuery('sync=0&type=2&program_id='+program_id+'&collect=collect');
        args.program_id =program_id;
        Lava.player.playProgram(args);
    },
    //将数组顺序打乱
    arrayUnordered:function(arr) {
    	var nums = arr.length;
        var array= arr;
        for (var i = 0; i < nums; i++) {
            var rand = parseInt(nums * Math.random());
            var temp = array[i];
            array[i] = array[rand];
            array[rand] = temp;
        }
        return array;
    },
    searchFunc: function(){
        $("#search-box").keyup(function(event) {
            if (event.which === 13) {
                var keyword = $(this).val().trim();
                if (keyword === '')
                    return;
                var action = "all";
                if (/module=search/.test(location.hash)) {
                    if (/action=song/.test(location.hash)) {
                        action = "song";
                    }else if (/action=program/.test(location.hash)) {
                        action = "program";
                    }else if (/action=artist/.test(location.hash)) {
                        action = "artist";
                    }else if (/action=all/.test(location.hash)) {
                        action = "all";
                    }
                }
                var url = "#module=search&action="+action+"&keyword=" + keyword;
                if (url === location.hash) {
                    Lava.util.refreshPage();
                } else {
                    location.hash = url;
                }
            }
            event.stopPropagation();
            event.preventDefault();
        });
    },
    bindEvent:function(el,evname,func1,func2){
        $(el).each(function(idx,elem){
            if ($(elem).data(evname)) return;
            $(elem).data(evname,1);
            $(elem)[evname](func1,func2);
        });
    },
    slideE:function(){
        var showPic = document.createElement("div");
        showPic.className = "slide-enlarge";
        $(showPic).append('<div class="cancle">×</div>');
        var pic = document.createElement('img');
        var src = $('.source').attr('src');
        pic.src = src.substr(0,src.indexOf('!'))+'!large2';
        showPic.appendChild(pic);
        document.body.appendChild(showPic);
        $(".cancle").click(function(){
            $('.slide-enlarge').remove();
        });
        $('.slide-enlarge').click(function(e){
            return false;
        });
        $(document).on('click',function(){
            $('.slide-enlarge').remove();
        });
    },
    initCheckStatus: function(){
        var $t = $('.i-play-item');
        var len = $t.length;
        for(var i = 0;i < len;i++){
            var args = Lava.util.parseQuery($($t[i]).attr('args') || '');
            if (args) {
                var st = Lava.player.checkPlayStatus(args);
                if (st === 0 || st === 2) {
                    Lava.player.switchIcon($($t[i]).find('.i-play-icon'));
                } else {
                    Lava.player.switchIcon($($t[i]).find('.i-play-icon'),true);
                }
            }
        }
    },
    lavaHover:function(){
        Lava.util.bindEvent(".i-play-item", 'hover', function() {
            var args = Lava.util.parseQuery($(this).attr('args') || '');
            if (args) {
                var st = Lava.player.checkPlayStatus(args);
                if (st === 0 || st === 2) {
                    Lava.player.switchIcon($(this).find('.i-play-icon'));
                } else {
                    Lava.player.switchIcon($(this).find('.i-play-icon'),true);
                }
            }
            $(this).addClass("hover");
        }, function() {
            $(this).removeClass("hover");
        });
        Lava.util.bindEvent(".header ul li",'hover',function(){
            $(this).addClass("hover");
        },function(){
            $(this).removeClass("hover");
        });
        Lava.util.bindEvent(".footer .menu-option > i",'hover',function(){
            if ($(this).hasClass("c")) {
                this.fixC = 1;
            } else {
                $(this).addClass("c");
            }
        },function(){
            //如果固定住C状态
            if (this.fixC) return;
            $(this).removeClass("c");
        });
        Lava.util.bindEvent(".lava-edit-p",'hover',function(){
            $(".nav-header.lava-edit-p").addClass("hover");
        },function(){
            $(".nav-header.lava-edit-p").removeClass("hover");
        });
        this.initPlayable();
        Lava.util.bindEvent('.filter-input','blur',function(ev){
            $(this).val('');
            $(this).keyup();
        });
        Lava.util.bindEvent('.filter-input','keyup',function(ev){
            //绑定过滤搜索过滤功能
            var keyword = $(this).val().toLowerCase();
            var panel = $(this).attr('panel');
            if (keyword === '') {
                $(panel).children().each(function(idx, el) {
                    $(el).show();
                });
            }
            $(panel).children().each(function(idx, el) {
                var text = $(el).text().trim().toLowerCase();
                if (text.indexOf(keyword) !== -1) {
                    $(el).show();
                } else {
                    $(el).hide();
                }
            });
        });
    },
    initPlayable:function() {
        this.bindEvent('.playable','hover',function(){
            if ($(this).find('.play').length === 0) {
                $(this).append('<div class="play iconc-play"></div><div class="add icon3-actionMenu"></div>');
                $(this).find('.fake').remove();//解决订阅重影问题
                $(this).find('.add,.play').hover(
                    function(){ $(this).addClass('on'); },function(){$(this).removeClass('on');}
                );
            }
            var args = Lava.util.parseQuery($(this).attr('args'));
            var st = Lava.player.checkPlayStatus(args);
            if (st === 0 || st === 2) {
                $(this).find('.play').removeClass('iconc-pause').addClass('iconc-play');
            } else {
                $(this).find('.play').removeClass('iconc-play').addClass('iconc-pause');
            }
            $(this).addClass('y-hover');
        },function(){
            $(this).removeClass('y-hover');
        });
    },
    scrollBarMonitor:function(){
        setInterval(function(){
            $('.scrollable').each(function(idx,el){
                if ($(el).css('display')=='none' &&
                    $(el).parents('.lava-menu').length === 0) {
                    return;
                }

                var time = $(el).data('_lastScroll');
                var now = new Date().getTime();
                if (now - time > 1000) {
                    $(el).children('.scrollbar').children('.buck').fadeOut();
                } else {
                    $(el).children('.scrollbar').children('.buck').fadeIn();
                }
            }) ;
        },50);
    },
    scrollToSelected:function(fixbar) {
        var li = fixbar.find('li.moduleselected,li.selected');
        if (li.length === 0) return;
        var offli = li.offset();
        var offp = fixbar.offset();
        if (fixbar.height() + offp.top < (offli.top+li.outerHeight())) {
            //选中的元素看不到了，滚动条需要滚一下
            var scrollH = li.position().top + li.outerHeight() - fixbar.height();
            Lava.util.scrollPos(fixbar.find('.scroll-content')[0],fixbar.find('.scrollbar>.buck'),{h:scrollH});
        }
    },
    scrollToHeader:function(el,force) {
        //如果没有滚动条开启就忽略这个操作
        var fixbar = $(el).find('.scroll-fix');
        if (fixbar.length > 0) {
            //如果有fixbar,必然就有header
            var height = $(el).find('.scroll-header').height();
            if (parseInt($(el).css('top')) <= -height || force) {
                //滚到里面去了，则把它滚出来一点。如果强制滚动，则直接滚到header处
                Lava.util.scrollPos(el,$(el).next('.scrollbar').find('.buck'),{h:height});
            }
            Lava.util.scrollToSelected(fixbar);
        }
    },
    setCookie: function(c_name,value,exdays){
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie=c_name + "=" + c_value;
    },
    initScrollable: function(container) {
        if (!container) {
            //如果不是指定容器初始化，则计算页面高度
            var h = $(window).height() - $('.header').outerHeight() - $('.footer').outerHeight();
            if ($('#app-main-wrapper .scroll-fix.scrollable').css('position') === 'fixed') {
                $('#app-main-wrapper .scroll-fix.scrollable').css('height', h + 'px');
            } else {
                $('#app-main-wrapper .scroll-fix.scrollable').css('height',
                    h - $('#app-main-wrapper .module-content .scroll-header').height() + 'px');
            }
        }
        var scrollable = null;
        if (container) {
            if ($(container).hasClass('.scrollable')) {
                scrollable = $(container);
            } else {
                scrollable = $(container).find('.scrollable');
            }
        } else {
            scrollable = $('.scrollable');
        }
        scrollable.each(function(idx, el) {
            //被隐藏的就不处理了
            if ($(this).css('display') === 'none' &&
                $(this).parents('.lava-menu').length === 0) {
                return;
            }

            var sc = $(el).children('.scroll-content')[0];
            if (sc) {
                Lava.util.scrollable(sc, el);
            }
        });
    },
    scrollPos:function(scrollel, buck, scroll){
        //scroll={y:x,h:xx},y表示滚动条top位置,h表示scrollel的-h位置
        var panelh = buck.parent('.scrollbar').height(), contenth = $(scrollel).height() - panelh,bh=buck.height();
        var newy = 0,ely = 0;
        if (scroll.y != undefined) {
            newy = Math.max(0, Math.min(scroll.y, panelh - bh));
            ely = Math.floor(newy*contenth/(panelh-bh));
        } else {
            ely = Math.min(contenth,scroll.h);
            newy = Math.floor(ely*(panelh-bh)/contenth);
        }
        //console.log('newy:'+newy+' ely:'+ely+' ch:'+contenth+' ph:'+panelh);
        if (newy != 0 && newy + bh >= (panelh - Math.min(100,bh))) {
            Lava.util.nextPage(scrollel);
        }
        if (parseInt($(scrollel).css('top')) === -ely &&
            parseInt(buck.css('top')) === newy) {
            return;
        }
        buck.css({top: newy + 'px'});
        $(scrollel).css({top: -ely + 'px'});
        $(scrollel).parent().data('_lastScroll',new Date().getTime());
        //return;
        //支持一个fix模型，当把header滚动完之后，fixbar就固定住
        var fixbar = $(scrollel).find('.scroll-fix');
        if (fixbar.length > 0) {

            //如果有fixbar,必然就有header
            var header = $(scrollel).find('.scroll-header');
            var newH = 0;
            if (fixbar.hasClass('scrollable')) {
                var newHeight = $(window).height() - $('.header').outerHeight() - $('.footer').outerHeight();
                if (fixbar.css('position') === 'fixed') {
                    newHeight -= header.height();
                }
                var oldHeight = fixbar.height();
                //console.log('old:'+oldHeight+',new:'+newHeight+',inner:'+fixbar.find('.scroll-content').height());
                if (newHeight !== oldHeight) {
                    newH = newHeight;
                }
            }
            if (newH === 0) return;
            //console.log(newH,ely,header.height());
            if (ely >= header.height()) {
                if (fixbar.css('position') !== 'fixed') {
                    //如果滚动超过了header，这开启fixbar
                    fixbar.css({position: 'fixed', height: newH + 'px', left: fixbar.attr('left'), top: fixbar.attr('top')});
                    Lava.util.scrollable(fixbar.find('.scroll-content')[0], fixbar[0]);
                }
            } else {
                if (fixbar.css('position') !== 'static') {
                    fixbar.css({position: 'static', height: newH + 'px'});
                    Lava.util.scrollable(fixbar.find('.scroll-content')[0], fixbar[0]);
                }
            }
        }
    },
    scrollable: function(el, parent,disable) {
        //要求el 下面必须只有一个子节点：内容节点，次函数会加一个滚动条到内容区域的右侧
        //滚动区域在parent内
        var ph = $(parent).height();
        if ($(parent).parents('.lava-menu').length === 0 &&
            $(parent).parents('.modal').length === 0) {
            if (!$(parent).hasClass('scroll-fix')) {
                ph = ph-$('.footer').height();
            }
        } else if ($(parent).parents('.lava-menu').length !== 0) {
            ph = ph-$(parent).find('.menu-footer').height();
        }
        var ch = $(el).height();
        if (ch <= ph || disable===true) {
            //不需要滚动条
            $(el).css({'position':'static','padding-right':'0px','top':'0px'});
            $(el).data('scroll-bind', 0);
            $(parent).unmousewheel();
            $(parent).data('_lastScroll',0);
            $(parent).find('.scrollbar').remove();
            $(parent).unbind('mouseenter');
            $(parent).unbind('mouseleave');
            $(parent).unbind('touchstart');
            $(parent).unbind('touchmove');
            $(parent).unbind('touchend');
            //把fixbar样式去掉
            var fix = $(el).find('.scroll-fix');
            if (fix.length > 0 && fix.css('position') !== 'static') {
                var h = $(window).height() - $('.header').outerHeight() - $('.footer').outerHeight();
                fix.css({'position':'static','height':h+'px'});
                Lava.util.scrollable(fix.children('.scroll-content')[0],fix[0]);
            }
            return;
        }

        if ($(parent).children('.scrollbar').length === 0) {
            $(parent).append('<div class="scrollbar"><div class="buck"></div></div>');
            $(parent).css('overflow', 'hidden');
        }
        var bar = $(parent).children('.scrollbar');
        var buck = bar.children('.buck');
        $(el).css({position:'relative','padding-right':bar.width()+'px'});

        ph -= parseInt(bar.css('margin-top'));

        bar.css({
            top: -ch+"px",height:ph+'px',
            float:'right',
            left: '0px' //bar的left为parent的宽度减去bar自己的宽度
        });

        var sh = Math.max(Math.floor(ph * ph /ch), 10);
        buck.css({height:sh + 'px'});
        if ($(el).data('scroll-bind')) {
            if ($(parent)[0].timer) {
                clearInterval($(parent)[0].timer);
            }
            $(parent)[0].timer = 0;
            //说明之前已经有了滚动条，这时候需要重新计算滚动条位置
            var scrollH = Math.abs(parseInt($(el).css('top')));
            Lava.util.scrollPos(el,buck,{h:scrollH});
        } else {
            $(parent).data('_lastScroll',new Date().getTime());
            $(el).data('scroll-bind', 1);
            bar.click(function(ev) {
                var bpos = $(this).parent().position();
                var bucktop = parseInt($(this).find('.buck').css('top'));
                var clickpos = ev.pageY - bpos.top;
                if (clickpos > bucktop && clickpos < bucktop + $(this).find('.buck').height()) {
                    //如果点击区域在滚动条里面则不滚动
                    return;
                }
                var y = ev.pageY - bpos.top - $(this).find('.buck').height() / 2;
                Lava.util.scrollPos(this.parentNode.children[0], $(this).find('.buck'), {y:y});
            });
            //函数写在bar上是为了再不需要滚动条的时候能清理掉
            bar[0]._doc_mousemove = function(ev) {
                //拖动的move事件必须放在document上，才能保证不丢失
                var b = $(document).data('_scrollbar');
                if (b) {
                    var bpos = $(b).parent().position();
                    var y = ev.pageY - bpos.top - $(b).find('.buck').data('_offset');
                    Lava.util.scrollPos($(b).parent('.scrollable').find('.scroll-content')[0], $(b).find('.buck'), {y:y});
                }
            };
            bar[0]._doc_mouseup = function() {
                var b = $(document).data('_scrollbar');
                if (b) {
                    $(document).data('_scrollbar',null);
                    $(document).unbind('mousemove', b._doc_mousemove);
                    $(document).unbind('mouseup', b._doc_mouseup);
                    $(document).enableSelection();
                }
            };
            buck.mousedown(function(ev) {
                var buckp = $(this).parent()[0];
                var bpos = $(this).parents('.scrollable').position();
                var bucktop = parseInt($(this).css('top'));
                var clickpos = ev.pageY - bpos.top;
                $(this).data('_offset',clickpos - bucktop);
                $(document).bind('mousemove', buckp._doc_mousemove);
                $(document).bind('mouseup', buckp._doc_mouseup);
                $(document).disableSelection();

                $(document).data('_scrollbar',buckp);
            });
            bar.mouseenter(function(){
                $(this).parent().data('_lastScroll',new Date().getTime());
                $(document).data('scroller',$(this).parent()[0]);
            });
            $(parent).mouseenter(function(){
                $(this).data('_lastScroll',new Date().getTime());
                $(document).data('scroller',$(this)[0]);
            });
            $(parent).mouseleave(function(){
                $(this).data('_lastScroll',0);
                $(document).data('scroller',null);
            });

            $(parent).bind('touchstart',function(ev){
                $(this).data('touchY',ev.originalEvent.targetTouches[0].pageY);
                $(this).data('touchT',parseInt($(this).children('.scroll-content').css('top'))||0);
                ev.stopPropagation();
            });

            $(parent).bind('touchmove',function(ev){
                var start = $(this).data('touchY');
                if (start > 0) {
                    var span = ev.originalEvent.targetTouches[0].pageY - start;
                    if (Math.abs(span) > 20) {
                        var scrollel = $(this).children('.scroll-content');
                        var top = $(this).data('touchT');
                        var bar = $(this).children('.scrollbar');
                        var height = Math.floor(scrollel.height()*span/bar.height());
                        scrollH = Math.max(0,Math.abs(top) - height);
                        Lava.util.scrollPos(scrollel[0], bar.find('.buck'), {h:scrollH});
                    }
                }
                ev.preventDefault();
            });
            $(parent).bind('touchend',function(ev){
                $(this).data('touchY',-1);
                ev.stopPropagation();
            });
            $(parent).mousewheel(function(event, delta) {
                var el = event.target || event.srcElement;
                if (el.tagName === 'input' || el.tagName === 'textarea') {
                    return;
                }
                if ($(this).parents('.pop-menu,.popup').length == 0 &&
                    (Lava.util._pop.length > 0 || $('.pop-menu').length > 0)) {
                    return;
                }

                var self = this;
                //delta =1 向上, -1向下
                var sel = $(this).children('.scroll-content');
                var sbuck = sel.siblings('.scrollbar').find('.buck');

                var span = 12 * delta;
                if (!self.timer) {
                    self.span = span;
                    self.timer = setInterval(function() {
                        //制作平滑滚动效果
                        var spanabs = Math.abs(self.span);
                        //用一个指数函数来算，当需要滚动的距离很长时就快点滚，很慢时就慢点滚
                        var scroll = Math.min(Math.max(8, Math.floor(Math.sqrt(spanabs))), 20);
                        if (scroll >= spanabs) {
                            scroll = self.span;
                            clearInterval(self.timer);
                            self.timer = 0;
                        } else {
                            if (self.span < 0) {
                                scroll = -scroll;
                            }
                        }
                        self.span -= scroll;
                        //要先显示出来才能计算准确，否则就滚不对位置
                        sbuck.show();
                        var top = sbuck.position().top;
                        Lava.util.scrollPos(sel[0], sbuck, {y:top-scroll});
                    }, 20);
                } else {
                    self.span += span;
                }

                event.stopPropagation();
                event.preventDefault();
            });
        }
    },
    initResizable: function() {
        if ($('#app-main-wrapper .resizable-panel').length === 0) {
            return false;
        }
        var pw = $('#app-main-wrapper .resizable-panel').width();//留出右边的滚动条

        if (/AppleWebKit/.test(navigator.userAgent)) {
            pw -= 7;
        }

        //计算动态区域内容尺寸
        var lastn = $('#app-main-wrapper .resizable-panel').data('last') | 0;
        var children = $('#app-main-wrapper .resizable-panel .resizable');
        var mxw = (parseInt(children.attr('max')) | 250);
        var mnw = (parseInt(children.attr('min')) | 200);
        var num = Math.floor(pw / mxw);
        var numspan = Math.abs(lastn - num);
        var minrest = 1000;

        for (var i = Math.ceil(pw / mxw); i <= Math.floor(pw / mnw); i++) {
            var rest = pw % Math.floor(pw / i);
            if (numspan > (i - num)) {
                //优先保证平滑效果
                numspan = i - num;
                num = i;
            } else if (minrest > rest) {
                num = i;
                minrest = rest;
            }
        }
        var w = Math.floor(pw / num);
        var padding = (parseInt(children.css('paddingLeft')) || 0) * 2;
        children.each(function(idx, el) {
            $(el).outerWidth(w);
            var a1 = $(el).find('.item-logo a,.x-style a');
            a1.width(w-padding);
            a1.height(w - padding);
            a1.find('img').css({height:(w - padding)/Math.sqrt(a1.find('img').length)+'px'});
        });
        return true;
    },
    callbackShare: function(){
        Lava.util.callModFunc('account','share',{target_id:pl._song.song_id,target_type:1});
    },
    setHash:function(hash) {
        Lava.util._disableHashMonitor = true;
        location.hash = hash;
        //如果要手工改变hash，那么就重新设置下当前app-main的加载参数
        var args = Lava.util.parseQuery(hash);
        delete args.module,delete args.action;
        $('#app-main-wrapper').attr('load_args',Lava.util.buildQuery(args));
    },
    hashChangeMonitor:function(){
        var oldHash = location.hash;
        window.iehashchange = setInterval(function(){
            if (Lava.util._disableHashMonitor) {
                oldHash = location.hash;
                delete Lava.util._disableHashMonitor;
                return;
            }

            if (location.hash !== oldHash) {
                oldHash = location.hash;
                Lava.util.refreshPage();
            }
        },10);
    },
    detectFlash: function() {//检测是否有flash插件
        //navigator.mimeTypes是MIME类型，包含插件信息
        if(navigator.mimeTypes && navigator.mimeTypes.length>0){
            //application/x-shockwave-flash是flash插件的名字
            var flashAct = navigator.mimeTypes["application/x-shockwave-flash"];
            return flashAct != null ? flashAct.enabledPlugin!=null : false;
        } else if(self.ActiveXObject) {
            try {
                new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                return true;
            } catch (oError) {
                return false;
            }
        }
    }
};


var LavaModule = Lava.create({
    _name: 'BaseModule',
    _handlers: {},
    initialize: function(name){
        this.name = name;
    },
    loadPage: function(module, action,args){
        //每次页面切换的时候都要检查登录与否
        if (_u && !/luid=\w+/.test(document.cookie)) {
            //登录已经过期了.需要提示用户登录
            var self = this;
            return Lava.util.callModFunc('account','showLogin',{callback:function(){
                self.loadPage(module,action,args);
            }});
        }
        var self = this;
        if (1) {
            //用module和action做样式来标记打开过某页面，下面会根据这个来计算
            var css = 'f_'+module+'_'+action;
            if ($('.'+css).length > 0 &&
                /(_allProducts$|^f_search)/.test(css)) {
                if ($('.'+css).css('display') === 'none') {
                    //说明当前正显示的正是这个view，直接调出来即可，否则重新加载.
                    $('#app-main-wrapper').attr('id',null).css('display','none');
                    $('.'+css).attr('id','app-main-wrapper').css('display','block');

                    var oldargs = Lava.util.parseQuery($('.'+css).attr('load_args'));
                    if (Lava.util.eq(oldargs,args)) {
                        Lava.util.initLavaPage();
                        $('.foggy-load').hide();
                        return;
                    }
                }
            } else {
                var strclass = $('#app-main-wrapper').attr('class');
                if (/f\_\w+\_\w+/.test(strclass)) {
                    //当前view已经被别的占用了，需要创建一个新的
                    var clonewrapper = $('#app-main-wrapper').clone().attr('id',null).css('display','none');
                    clonewrapper.insertAfter($('#app-main-wrapper'));
                    $('#app-main-wrapper').attr('class',strclass.replace(/f\_\w+\_\w+/,'').trim());
                }
                //对当前view设置需要打开页面的样式标记
                $('#app-main-wrapper').addClass(css);
            }
        }
        var query = Lava.util.buildQuery(args);
        var url = "/" + module + "/" + action + (query?('?'+query):'');
        $('#app-main-wrapper').attr('load_args',Lava.util.buildQuery(args));

        Lava.util.pager(0);//默认都关闭拖动翻页
        Lava.util.loadPage("#app-main-wrapper>.module-content", url, function() {
            $('#app-main-wrapper > .scrollbar .buck').css({top:'0px'});
            $('#app-main-wrapper > .scroll-content').css({top:'0px'});

            self.initializeUI(action, args);
        });
        if (ga) {
            ga('send', 'pageview',{
                'page':'/'+location.hash,
                'dimension1':((typeof(_u)=='undefined')||(_u==null) ) ?'_':_u['uid']
            });
        }
    },
    initializeUI: function(action, args) {}
});

$(document).ready(function(){
    Lava.util.lavaBind();
});(function () {
    Lava.player = {
        _songs:{},//歌曲数据列表
        _song:{}, //当前播放歌曲
        _pics:[],  //聆听模式图片
        _args:{}, //当前列表播放传入的参数
        _startLoad:0, //开始加载时间
        _playIdx:-1, //当天播放歌曲的下标
        _img:'#player .music-logo img',
        _name:'#player .music-name',
        _artist:'#player .music-star',
        _songfunc:'#player .m-multifunc',
        _collect:'#player .m-star',
        _share:'#player .m-share',
        _prev:'#player .icona-fast-backward',
        _next:'#player .icona-fast-forward',
        _play:'#player #play-songs',
        _lplay:'#lplaysongs',
        _progress:'#player .play-slide-time',
        _duration:'#player .rest-time',
        _preDuration:'#player .play-time',
        _voice:'#player .voice-control',
        _volume:'#player #volume',
        _random:'#player #random',
        _cycle:'#player #cycle',
        _infobar:'#player .mudic-communicate',
        _adMode:0, //是否广告播放中
        _count:0, //播放个数统计
        _program:{},//当前播放节目
        _ad:[],
        _isProgramsList:-1,
        _programsList:[],
        _programscount:0,
        initPlayer:function() {
            if (window.lava_loaded) {
                //已经加载过了
                return;
            }
            window.lava_loaded = pl.callback_loaded;
            window.lava_played = pl.callback_played;
            window.lava_paused = function(){
                pl.pause();
            };
            window.lava_end = pl.callback_end;
            window.lava_error = pl.callback_error;
            window.lava_id3 = pl.callback_info;
            if (!window.localStorage) {
                window.localStorage = {
                    setItem:function(){},
                    getItem:function(){},
                    removeItem:function(){}
                };
            }
            $(pl._progress).slider({
                range: "min", value: 0, min: 0, max: 100,
                slide: function(event, ui) {
                    if (pl._adMode) return false;
                    _p.lava_position(ui.value);
                }
            });
            $(pl._volume).click(function(){
                if ($(this).hasClass('icona-volume-silent')) {
                    //如果静音
                    _p.lava_volume(this._vol);
                    $(this).removeClass('icona-volume-silent').addClass('icona-volume-up');
                } else {
                    this._vol = _p.lava_volume();
                    _p.lava_volume(0);
                    $(this).removeClass('icona-volume-up').addClass('icona-volume-silent');
                }
            });
            $(pl._voice).slider({
                range: "min", value: 80, min: 1, max: 100,
                slide: function(event, ui) {
                    _p.lava_volume(ui.value);
                    $(pl._volume).removeClass('icona-volume-silent').addClass('icona-volume-up');
                }
            });
            $(pl._songfunc).click(function(ev) {
                if (pl._song) {
                    $(this).parent().addClass('open');
                    var args = {song_id:pl._song.song_id};
                    if ($(pl._collect).hasClass('c')) {
                        args.fav = 1;
                    } else {
                        args.fav = 0;
                    }
                    args.share = $(pl._share).css('display') !== 'none';
                    Lava.ui.smenu(args,ev);
                }
            });
            $(pl._share).click(function(ev) {
                if (pl._song) {
                    if (!_u) {
                        return Lava.util.callModFunc('account','showLogin',{callback:function(){
                            $(pl._share).click();
                        }});
                    }
                    Lava.util.callModFunc('account','share',{target_id:pl._song.program_id,target_type:2},ev);
                    ev.stopPropagation();
                }
            });
            $(pl._next).click(function(){  pl.next();  });
            $(pl._prev).click(function(){  pl.prev();  });
            $(pl._collect).click(function(){
                if (pl._song) {
                    if (!_u) {
                        return Lava.util.callModFunc('account','showLogin',{callback:function(){
                            $(pl._collect).click();
                        }});
                    }
                    var args = {target_id:pl._song.program_id};
                    var pargs = {program_id:pl._song.program_id};
                    if (pl._program && pl._program.fav) {
                        if($(pl._collect).hasClass('sync')){
                            pargs.sync = 0;
                            Lava.util.callModFunc('account','subscribe',pargs);
                        }else{
                            Lava.util.callModFunc('account','unsubscribe',pargs);
                        }

                        //不固定为收藏状态了
                        pl.checkProgramFav(false);
                    } else {
                        if (pl._song.chennel_id && pl._song.chennel_id != '0') {
                            args.channel_id = pl._song.chennel_id;
                        }
                        if (pl._song.program_id && pl._song.program_id != '0') {
                            args.program_id = pl._song.program_id;
                        }
                        Lava.util.callModFunc('account','subscribe',args);
                        pl.checkProgramFav(true);
                    }
                }
            });
            $(pl._lplay).click(function(){
                pl.playAction();
            });
            $(pl._play).click(function(){
                pl.playAction();
                Lava.util.initCheckStatus();
            });
            $(pl._cycle).click(function(){
                $(pl._cycle).removeClass('icona-refresh-set icona-refresh-set1 icona-refresh');
                $(pl._random).removeClass('icona-random-set').addClass('icona-random');
                if (_p.lava_mode() === 2) { //已经是单曲循环播放状态
                    _p.lava_mode(0);
                    $(pl._cycle).addClass('icona-refresh');
                } else {
                    if (_p.lava_mode() === 0 || _p.lava_mode() === 3) {
                        _p.lava_mode(1);
                        $(pl._cycle).addClass('icona-refresh-set');
                    } else {
                        _p.lava_mode(2);
                        $(pl._cycle).addClass('icona-refresh-set1');
                    }
                }
            });
            $(pl._random).click(function(){
                $(pl._cycle).removeClass('icona-refresh-set icona-refresh-set1').addClass('icona-refresh');
                $(pl._random).removeClass('icona-random-set icona-random');
                if (_p.lava_mode() === 3) {
                    _p.lava_mode(0);
                    $(pl._random).addClass('icona-random');
                } else {
                    _p.lava_mode(3);
                    $(pl._random).addClass('icona-random-set');
                }
            });
            $(pl._share).fadeOut();
            $(pl._infobar).fadeOut();
            if (typeof _p == 'undefined' || !_p) {
                if (document['lavaplayer'] && document['lavaplayer'].lava_status) {
                    _p = document['lavaplayer'];
                }
                if (document.embeds['lavaplayer'] && document.embeds['lavaplayer'].lava_status) {
                    _p = document.embeds['lavaplayer'];
                }
            }

            var purl = localStorage.getItem('purl');
            if (purl && purl.length > 0) {
                var params = Lava.util.parseQuery(localStorage.getItem('pargs')) || {};
                params.auto = false;
                params.idx = localStorage.getItem('pidx') || 0;
                pl.playList(purl,params);

                pl._startLoad = 0; //第一次加载不计加载时间
            } else {
                var songId = localStorage.getItem('psong');
                if (songId) {
                    pl.playSong(songId,false);
                } else {
                    pl.loadNowChannel();
                }
            }
            _p.lava_mode(1);
            $.get('/api/play.getAdPlan.json').done(function(res){
                if (res.err === 'hapn.ok') {
                    pl._ad = res.data;
                }
            });
        },
        playSongs:function(songs,idx,auto){
            //Lava.player.loadingUI();
            pl._songs = songs;
            var lists = [];
            if(!idx || songs.length <= idx){
                idx = 0;
            }
            if(!songs[idx]){
                idx = (idx == -1)?0:idx;
            }
            var playSongId = songs[idx].song_id;
            for(var i=0;i<songs.length; i++) {
                var song = songs[i];
                if (/q=low/.test(location.hash)) {
                    song.audio_url = song.audio_url.replace('/song/','/song/low/');
                }
                lists.push(song.audio_url);
            }

            var newlists = _p.lava_list(lists);
            if (_p.lava_mode() == 3) {
                //随机模式下把首次播放的歌曲校准
                for(var i=0;i<newlists.length; i++) {
                    if (newlists[i] ==  songs[idx].audio_url) {
                        idx = i;
                        break;
                    }
                }
            }

            if (lists.length > 0) {
                if (idx == -1) {
                    //不播放，只是显示下一首需要播放的歌曲
                    pl.showSong(songs[0]);
                } else {
                    if (auto === false) {
                        pl.showSong(songs[idx]);
                        pl.play(idx);
                        pl.pause();
                    } else {
                        pl.play(idx);
                    }
                }
            }
        },
        playList:function(url,args) {
            if(pl._adMode) return;

            pl.stop(); //先停掉

            delete pl._program;
            pl._startLoad = new Date().getTime();
            if(parseFloat(Lava.ui.duration)-parseFloat(Lava.ui.dur) !== 0){
                $.post('/api/play._playLog',{program_id:pl._song.program_id,channel_id:pl._args.channel_id,artist_id:pl._song.artist_id,song_id:pl._song.song_id,song_duration:pl._song.duration,real_duration:parseFloat(Lava.ui.duration)-parseFloat(Lava.ui.dur),source:1,action: 2 ,time:Date.parse(new Date())/1000},function(){

                });
            }

            Lava.player.loadingUI();
            pl._args = args;
            localStorage.setItem('purl',url);
            localStorage.setItem('pargs',Lava.util.buildQuery(args));
            localStorage.removeItem('psong');

            function _playSongs(playInfo)
            {
                if(playInfo.program){
                    pl._program = playInfo.program;
                }
                pl.playSongs(playInfo.songs,pl._args.idx,pl._args.auto);
            }
            if (args.program_id && window.container) {
                var playInfo = lava_play_program(args.program_id);
                if (playInfo) {
                    return _playSongs(playInfo);
                }
            }
            $.get(url).done(function(res){
                if (res.err === 'hapn.ok') {
                    // if (res.data.program &&res.data.program.vip_level == '1' && (!_u || _u.isVip==0)) {
                    //     //不播放，弹屏幕
                    //     Lava.ui.showVip();
                    //     return;
                    // }
                    return _playSongs(res.data);
                }
            });
        },
        playChannel:function(args){
            var url = '/api/play.playChannel.json?channel_id='+args.channel_id;
            pl.playList(url,args);
        },
        playProgram:function(args){
		$.post('/api/play.playActoin',{},function(){});
            var url = '/api/play.playProgram.json?'+'program_id='+args.program_id+(args.order?'&order='+args.order:'');
            pl.playList(url,args);
            $('.playable[program_id='+args.program_id+']').find('.play').removeClass('iconc-play').addClass('iconc-pause');
        },
        playSAlbum:function(args){
            var url = '/api/play.playSAlbum.json?salbum_id='+args.salbum_id;
            pl.playList(url,args);
            $('.playable[salbum_id='+args.salbum_id+']').find('.play').removeClass('iconc-play').addClass('iconc-pause');
        },
        playArtist:function(args){ //艺术家站点播放
            var url = '/api/play.playArtist.json?artist_id='+args.artist_id;
            pl.playList(url,args);
        },
        playArtistSongs:function(args){ //艺术家的歌曲列表播放
            var url = '/api/play.playArtistSongs.json?artist_id='+args.artist_id;
            pl.playList(url,args);
        },
        playCollectGroup:function(args){
            var url = '/api/play.playCollectSongs.json?'+Lava.util.buildQuery(args);
            pl.playList(url,args);
        },
        loadNowChannel:function(){
            //加载现在频道播放列表，放在播放器
            var url = '/api/play.playNowChannels.json';
            pl.playList(url,{idx:-1,auto:false});
            //加载现在频道不计加载时间
            pl._startLoad = 0;
        },
        loadingUI: function(){
            $('.msr-control').show();
            $('#play-songs').attr('visibility','hidden');
            setTimeout(function(){pl.loadedUI();},2000);//显示最长加载时间两秒
            //$('.play-time').html('<img src="../img/loading.gif"/>');
        },
        loadedUI: function(){
            $('.msr-control').hide();
            $('#play-songs').attr('visibility','visible');
        },
        playSong:function(songId,auto) {
            if(pl._adMode) return;
            if (typeof songId === 'object') {
                songId = songId.song_id;
            }
            delete pl._program;
            pl.stop();
            $.get('/api/item.getSong.json?song_id='+songId).done(function(res){
                if (res.err === 'hapn.ok') {
                    _p.lava_list([res.data.audio_url]);
                    pl._songs = [res.data];
                    pl.showSong(res.data);
                    pl._args = {};
                    if (auto !== false) {
                        pl.play(0);
                    }
                    localStorage.removeItem('purl');
                    localStorage.removeItem('idx');
                    localStorage.removeItem('pargs');
                    localStorage.setItem('psong',songId);
                } else {
                    Lava.ui.dialog({content:'系统出错，播放失败'});
                }
            });
        },
        showSong: function(song) {
            if (!song) return;
            pl._song = song;
            if (_u && _u.pri_item_view == 1) {
                if(!song.program_id){
                    $(pl._name).html(
                        '<a class="song-title" href="#module=item&action=salbum&salbum_id='+song.salbum_id+'">'+song.song_name+'</a>'+
                        "<span style='padding:0 10px'>-</span>" +
                        '<a class="artist-title" href="#module=item&action=artist&artist_id='+song.artist_id+'">'+song.artists_name+'</a>'
                    );
                }else{
                    $(pl._name).html(
                        '<a class="song-title" href="#module=radio&action=program&program_id='+song.program_id+'">'+song.song_name+'</a>'+
                        "<span style='padding:0 10px'>-</span>" +
                        '<a class="artist-title" href="#module=item&action=artist&artist_id='+song.artist_id+'">'+song.artists_name+'</a>'
                    );
                }

            } else {
                if (song.program_id) {
                    $(pl._name).html(
                        '<a class="song-title">'+song.song_name+'</a>'+
                        "<span style='padding:0 10px'>-</span>" +
                        '<span class="artist-title">'+song.artists_name+'</span>'
                    );
                } else {
                    $(pl._name).html('<span class="song-title">'+song.song_name +"</span><span style='padding:0 10px'>-</span><span class='artist-title'>" + song.artists_name+'</span>');
                }
            }


            $(pl._duration).text('-'+pl.duration(song.duration));
            $(pl._preDuration).text('0:00');

            pl.checkProgramFav(pl._program?pl._program.fav:false);

            $(pl._infobar).fadeIn();
            if (Lava.util.empty(pl._args) || pl._args.salbum_id || pl._args.artist_id) {
                //如果是在专辑或者艺术家里面，这不显示分享按钮
                $(pl._share).fadeOut();
            } else {
                $(pl._share).fadeIn();
            }
            $(pl._progress).slider('value',0);
        },
        checkProgramFav: function(fav){
            if(pl._program) {
                pl._program.fav = fav?1:0;
                if (pl._program.fav == 1) {
                    $(pl._collect).addClass('c')[0].fixC = 1;
                    if (pl._program.sync == 1) {
                        $(pl._collect).addClass('sync');
                    } else {
                        $(pl._collect).removeClass('sync');
                    }
                } else {
                    $(pl._collect).removeClass('c')[0].fixC = 0;
                    $(pl._collect).removeClass('sync');
                }
                $(pl._collect).fadeIn();
                $(pl._img).attr('src',pl._program.pic_url+'!small1');
            } else {
                $(pl._collect).fadeOut();
                $(pl._img).attr('src',pl._song.pic_url+'!small1');
            }
        },
        //返回0表示未播放当前数据，返回1表示正在播放当前数据
        checkPlayStatus:function(args) {
            if (typeof _p == 'undefined' || !_p) return 0;

            var st = _p.lava_status();
            if (st === 0) return 0;
            if (args.song_id) {
                if (pl._song && args.song_id === pl._song.song_id) {
                    return st;
                }
                return 0;
            }
            for(var p in args) {
                if (p === 'idx' || p === 'play') continue;
                if (!pl._args[p] || pl._args[p] != args[p]) {
                    return 0;
                }
            }
            return st;
        },
        playAction: function() {
            if (pl._adMode) return;
            switch (_p.lava_status()) {
                case 0:  //停止状态，需要开始播
                    pl.play();
                    break;
                case 1:  //播放状态，需要暂停
                    pl.pause();
                    break;
                case 2: //暂停状态需要继续播
                    pl.resume();
                    break;
            }
        },
        duration:function(dur) {
            var dur = parseInt(dur) || 0;
            var m = Math.floor(dur / 60);
            var s = Math.ceil(dur % 60);
            return  m + ':' + (s<10?('0'+s):s);
        },
        playAd:function(){
            if (!pl._ad || pl._ad.ads.length === 0 || (_u && _u.isVip == '1')) {
                return false;
            }
            pl._adMode = 1;
            Lava.ui.showAdPage('appdownload');
            var ad = pl._ad.ads[Math.ceil(Math.random()*1000)%pl._ad.ads.length];
            _p.lava_single_play(ad.ad);
            return true;
        },
        prev:function() {
		$.post('/api/play.playActoin',{},function(){
            });
            if (pl._adMode) return;
            pl._count++;
            if ((pl._count % pl._ad.per_count) == 0){
                _p.lava_stop();
                return !pl.playAd();
            }
            pl._startLoad = new Date().getTime();

            Lava.player.loadingUI();
            _p.lava_play_prev();
            //重置当前播放歌曲，新歌曲加载下来后再设上
            pl._song = null;
        },
        next:function() {
		$.post('/api/play.playActoin',{},function(){
            });
            if (pl._adMode) return;
            pl._count++;
            if ((pl._count % pl._ad.per_count) == 0){
                _p.lava_stop();
                return !pl.playAd();
            }
            pl._startLoad = new Date().getTime();
            if(parseFloat(Lava.ui.duration)-parseFloat(Lava.ui.dur) !== 0){
                $.post('/api/play._playLog',{program_id:pl._song.program_id,channel_id:pl._args.channel_id,artist_id:pl._song.artist_id,song_id:pl._song.song_id,song_duration:pl._song.duration,real_duration:parseFloat(Lava.ui.duration)-parseFloat(Lava.ui.dur),source:1,action: 1 ,time:Date.parse(new Date())/1000},function(){

                });
            }
            if (pl._args.channel_id && (pl._playIdx + 1) >= pl._songs.length) {
                //如果是频道播放，播放到结尾时，下一首重新播放其他节目
                pl.playChannel(pl._args);
                return;
            }

            Lava.player.loadingUI();
            _p.lava_play_next();
            //重置当前播放歌曲，新歌曲加载下来后再设上
            pl._song = null;
        },
        play:function(idx) {
            if (pl._adMode) return;
            if (_p.lava_status() === 0 && pl._songs.length > 0) {
                //如果没播放则自动播放
                if (idx !== undefined) {
                    _p.lava_play(idx);
                } else {
                    _p.lava_play();
                }
                $(pl._play).removeClass('icona-play').addClass('icona-pause');
                //$(pl._lplay).removeClass('iconl-play').addClass('iconl-pause');
            }
        },
        pause:function() {
            if (pl._adMode) return;

            if (_p.lava_status() === 1) {
                //如果没播放则自动播放
                $(pl._play).removeClass('icona-pause').addClass('icona-play');
                //$(pl._lplay).removeClass('iconl-pause').addClass('iconl-play');
                _p.lava_pause();
                Lava.player.loadedUI();
            }
        },
        resume:function(){
        $.post('/api/play.playActoin',{},function(){
            });  
	  if (pl._adMode) return;

            if (_p.lava_status() === 2) {
                //如果没播放则自动播放
                $(pl._play).removeClass('icona-play').addClass('icona-pause');
                //$(pl._lplay).removeClass('iconl-play').addClass('iconl-pause');
                _p.lava_resume();
            }
        },
        stop:function() {
            if (pl._adMode) return;

            if (_p.lava_status() !== 0) {
                //如果没播放则自动播放
                _p.lava_stop();
                $(pl._play).removeClass('icona-play icona-pause').addClass('icona-play');
                //$(pl._lplay).removeClass('iconl-pause').addClass('iconl-play');
            }
        },
        switchIcon:function(el,setpause){
            if (!$(el).hasClass('i-play-icon')) {
                return;
            }
            if (setpause) {
                $(el).attr('class',$(el).attr('class').replace(/icon(.)-play/,'icon$1-pause'));
                $(el).parents("ul").children('.is_playing').removeClass('is_playing');
                $(el).parents(".i-play-item").addClass('is_playing');
            } else {
                $(el).attr('class',$(el).attr('class').replace(/icon(.)-pause/,'icon$1-play'));
                $(el).parents(".i-play-item").removeClass('is_playing');
            }
        },
        callback_loaded:function(idx,percent) {
            if (pl._adMode) return;
            if (!pl._song || pl._songs[idx].audio_url !== pl._song.audio_url) {
        $.post('/api/play.ArbitrarilyPlayActoin',{},function(){
                }); 
	       //需要重新获取音乐信息
                pl._song = pl._songs[idx];
                pl.showSong(pl._song);
                localStorage.setItem('pidx',idx);
                Lava.util.initCheckStatus();
                Lava.player.loadedUI();
            }
        },
        callback_played:function(idx,percent,total) {
            pl._playIdx = idx;
	    //_p.lava_resume_to1();
            if (pl._startLoad && !pl._adMode && _p.lava_status() == 1) {
                if(ga && pl._songs[idx]){
                    var timespan = new Date().getTime() - pl._startLoad;
                    ga('send', 'timing', 'loadtime', pl._songs[idx]['song_id'], timespan,((typeof(_u)=='undefined')||(_u==null))?'_':_u.uid,{'dimension1':((typeof(_u)=='undefined')||(_u==null))?'_':_u.uid});
                }
                pl._startLoad = 0;
            }
            if ($(pl._play).hasClass('icona-play') && _p.lava_status() == 1) {
                $(pl._play).removeClass('icona-play').addClass('icona-pause');
            }
            if ($(pl._progress).slider('value') > percent) {
                return;
            }
            if(pl._song){
                duration = pl._adMode?total:pl._song.duration;
            }
            $(pl._progress).slider("value",Math.floor(percent));
            var dur = (100-percent)*duration/100 || 0;
            Lava.ui.dur = dur;
            Lava.ui.duration = duration;
            $(pl._duration).text('-'+pl.duration(dur));
            $(pl._preDuration).text(pl.duration(parseFloat(duration)-parseFloat(dur)));

        },
        callback_end:function(idx) {
            $(pl._play).removeClass('icona-pause').addClass('icona-play');
            $(pl._progress).slider('value',0);
            if(ga && pl._songs[idx]){
                ga('send', 'timing', 'playtime', pl._songs[idx]['song_id'], parseInt(pl._songs[idx]['duration']+'000'),((typeof(_u)=='undefined')||(_u==null))?'_':_u['uid'],{'dimension1':((typeof(_u)=='undefined')||(_u==null))?'_':_u['uid']});
            }
            if (pl._adMode) {
                //广告模式结束后就继续播放下一首
                pl._adMode = 0;
                pl.next();
                return false;
            } else {
                pl._count++;
                if ((pl._count % pl._ad.per_count) == 0){
                    return !pl.playAd();
                }
                pl._startLoad = new Date().getTime();
            }
            if(parseFloat(Lava.ui.duration)-parseFloat(Lava.ui.dur) !== 0){
                $.post('/api/play._playLog',{program_id:pl._song.program_id,channel_id:pl._args.channel_id,artist_id:pl._song.artist_id,song_id:pl._song.song_id,song_duration:pl._song.duration,real_duration:parseFloat(Lava.ui.duration)-parseFloat(Lava.ui.dur),source:1,action: 0 ,time:Date.parse(new Date())/1000},function(){

                });
            }
            if (pl._args.channel_id && (pl._playIdx + 1) >= pl._songs.length) {
                //如果是频道播放，播放到结尾时，下一首重新播放其他节目
                pl.playChannel(pl._args);
                return;
            }

        },
        callback_error:function(err) {
            pl.next();
        },
        callback_info:function(id3info) {
            // console.log(id3info);
        }
    };
    window.pl = Lava.player;

    $(document).keyup(function(ev){
        var elem = ev.srcElement || ev.target;
        if(ev.keyCode === 32 && (elem.tagName !== 'INPUT' && elem.tagName !== 'TEXTAREA')) {
            //空格可以暂停可以开始播放
            pl.playAction();
        }
    });
})();
(function(){
    Lava.h5player = {
        _songs: [],//正常顺序播放列表
        songs : [],//等待播放的音乐列表
        playStatus : 0,//未开始
        callTimer : 0,
        playIdx : -1, //播放位置，初始化为-1
        playPosition : 0,//已经播放的位置
        playMode : 0,//0：顺序播放完即停止，1：循环播放，2：单曲循环播放，3:随机播放
        playVolume : 80,
        player : document.getElementById('myMusic'),

        //随机排序比较函数
        lava_random_compare : function ()
        {
            return Math.random()>0.5?1:-1;
        },

        lava_debug : function ()
        {
            return ['playIdx='+playIdx,'channel='+(channel!=null), songs,'callTimer='+callTimer,'playStatus='+playStatus,
                'playPosition='+playPosition,'playMode='+playMode,'playVolume='+playVolume];
        },

        lava_list : function(newsongs)
        {
            h5player.lava_stop();
            h5player.songs = [];
            h5player._songs = [];
            h5player.playIdx = -1;
            h5player.playSongNum = 0;
            return h5player.lava_list_add(newsongs);
        },

        lava_list_add : function(newsongs){
            if (newsongs == null) {
                return h5player.songs;
            }
            h5player._songs = h5player._songs.concat(newsongs);
            if (h5player.playMode == 3) {
                //随机播放，取出还未播放的那一段进行随机排序
                var idx = (h5player.playIdx<0)?0:h5player.playIdx;
                var rest = h5player.songs.slice(h5player.playIdx);
                var prev = h5player.songs.slice(0,h5player.playIdx);
                rest = rest.concat(newsongs);
                rest.sort(h5player.lava_random_compare);
                h5player.songs = prev.concat(rest);
            } else {
                h5player.songs = h5player.songs.concat(newsongs);
            }
            return h5player.songs;
        },

        lava_play_next : function ()
        {
            $(pl._progress).slider('value',0);
            h5player.lava_play(parseInt(h5player.playIdx)+1);
        },

        lava_play_prev : function ()
        {
            $(pl._progress).slider('value',0);
            h5player.lava_play(h5player.playIdx-1);
        },

        initPlayer : function (url,pos)
        {
            h5player.player = document.getElementById('myMusic');
            if(url){
                h5player.player.src = url;
            }else if(!url){
                //console.log('没指定播放地址');
            }
            h5player.player.preload = "auto";
            //h5player.channel = h5player.player.play();
        },

        lava_play : function(idx){
            h5player.playSongNum = 0;
            if (h5player.playStatus > 0) {
                //正在播放中，先停止上一首播放
                h5player.lava_stop();
            }
            if (!idx) {
                //如果外部没有制定播放哪个，播下一首
                h5player.playIdx += 1;

            } else {
                h5player.playIdx = idx;
            }
            if (h5player.playIdx >= h5player.songs.length) {
                h5player.playIdx = 0;
            } else if (h5player.playIdx < 0) {
                h5player.playIdx = h5player.songs.length - 1;
            }
            var url = h5player.songs[h5player.playIdx];
            //mylog("play"+playIdx+url);
            h5player.initPlayer(url,0);
            //开始播放
            h5player.playStatus = 1;
            h5player.player.play();
            if (h5player.callTimer == 0) {
                setInterval(h5player.lava_callback, 400);
            }
        },

        lava_single_play : function (url) {
            h5player.initPlayer(url,0);
            h5player.playStatus = 1;
        },

        lava_pause : function ()
        {
            if(h5player.playStatus != 1) {
                //不是播放状态，则忽略
                return;
            }

            h5player.player.pause();
            h5player.playPosition = h5player.player.currentTime;

            //h5player.channel = null;

            //设置为暂停状态
            h5player.playStatus = 2;
        },

        lava_resume : function ()
        {
            if(h5player.playStatus != 2) {
                //不是暂停状态，不理会
                return;
            }
            h5player.lava_replay();

            h5player.playPosition = 0;

            //设置为播放状态
            h5player.playStatus = 1;
        },

        //stop表示是否需要主动调用stop停止
        lava_stop : function ()
        {
            if (h5player.playStatus == 0) {
                //如果已经是停止状态了，则忽略
                return;
            }
            try {
                h5player.player.stop();
                //player.close();
            }catch(e) {
                //mylog(e); //flash有点问题，这里总会出错
                //ExternalInterface.call('lava_error', playIdx, e.toString());
                lava_error(h5player.playIdx,e.toString());
            }

            //h5player.channel = null;
            h5player.player = null;
            h5player.playStatus = 0;
            h5player.playPosition = 0;

            if (h5player.callTimer > 0) {
                //停止计时器
                clearInterval(h5player.callTimer);
                callTimer = 0;
            }
        },

        lava_position : function (percent)
        {
            if (h5player.playStatus == 0) {
                return 0;
            }
            percent = Math.max(Math.min(99, percent),0);
            h5player.playPosition = Math.floor(percent * h5player.lava_sound_length() / 100);
            h5player.lava_replay(h5player.playPosition);
            return h5player.playPosition;
        },

        lava_status : function(){
            return h5player.playStatus;
        },

        lava_mode : function (m)
        {
            //设置播放模式，从下一首播放开始生效
            if (m >= 0) {
                if (h5player.songs != null &&
                    h5player.playMode != m) {
                    if (m == 3) {
                        //打乱为随机顺序
                        h5player.songs.sort(h5player.lava_random_compare);
                        h5player.playIdx = -1;
                    } else {
                        //回复正常顺序
                        h5player.songs = h5player._songs.slice(0);
                        if (h5player.playMode == 3) {
                            //之前是随机，则从开始播放
                            h5player.playIdx = -1;
                        }
                    }
                }
                h5player.playMode = m;
            }
            return h5player.playMode;
        },

        lava_volume : function (vol)
        {
            if (vol >= 0) {
                if(vol <= 100 && vol > 1){
                    h5player.player.volume = vol/100;
                }else{
                    h5player.player.volume = vol;
                }
            }
            return h5player.player.volume;
        },

        getPlayIdx : function ()
        {
            if (h5player.playStatus == 0) return -1;

            var song = h5player.songs[h5player.playIdx];
            var idx = h5player._songs.indexOf(song);
            return idx;
        },

        lava_error : function (e)
        {
            //设置为停止播放状态
            try {
                lava_stop();
            }catch(ex) {

            }
            //mylog(e.toString());
        },

        lava_id3 : function (e)
        {
            //mylog(player.id3);
            //window.call('lava_id3',player.id3);
        },

        lava_replay : function (pos)
        {
            //从当前位置重新开始放，通常用在调音量，拖动播放位置
            if (h5player.playStatus == 0) {
                return;
            }
            if (pos) {
                h5player.playPosition = Math.min(Math.max(pos,0), h5player.lava_sound_length());
                h5player.player.currentTime = h5player.playPosition;
            }
            h5player.player.play();
            h5player.player.addEventListener('ended',h5player.lava_complete);
        },

        lava_callback : function ()
        {
            if (h5player.playStatus > 0) {
                var idx = h5player.getPlayIdx() == -1?0:h5player.getPlayIdx();
                var percent = 100 * h5player.player.currentTime/h5player.player.duration;
                if(isNaN(percent)){
                    percent = 0;
                }
                lava_played(idx, percent,Math.round(h5player.lava_sound_length()/1000));

                //处理加载进度回调
                percent =  100 * h5player.player.currentTime/ h5player.player.duration;
                lava_loaded(idx,percent,player.duration);
            }
        },

        lava_complete : function (ev)
        {
            h5player.playStatus = 0;
            //channel = null;
            h5player.player = null;

            var ret = lava_end(h5player.getPlayIdx());
            if (ret === false) {
                //如果外面需要结束，就不继续播放了
                return;
            }
            if(h5player.playMode == 2) {
                //单曲循环
                h5player.lava_play(h5player.playIdx);
                return;
            }
            if (h5player.playIdx >= h5player.songs.length - 1 && h5player.playMode == 0) {
                return; //播完了不循环
            }
            h5player.lava_play_next();
        },

        lava_sound_length : function ()
        {
            //获取音乐播放长度
            if (h5player.playStatus == 0) {
                return 0;
            }
            return h5player.player.duration;
        }


    }
    window.h5player = Lava.h5player;
    h5player.initPlayer();
    function startH5(){
        window.lava_player_init();
    }
    setTimeout(startH5,2000);
    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
})();Lava.img = {};

Lava.img.clip = function(setting){
    var args = [];
    for(var p in setting) {
        var type = typeof setting[p];
        if (type !== 'function' && type !== 'object') {
            args.push(p+'='+setting[p]);
        }
    }
    Lava.util.popup('/util/imageclip?'+args.join('&'),'ImageClip');
    Lava.img._clipSetting = setting || {};
};

Lava.img.uploader = function(elemId,setting) {
    var setting = setting || {};
    setting.flash_url = "/swfupload.swf";
    if (!setting.upload_url) {
        setting.upload_url = "http://v0.api.upyun.com/lavaimg/";
    }
    setting.file_post_name = 'file';
    setting.assume_success_timeout = 300; //默认上传5分钟还不结束就算成功.
    setting.button_placeholder_id = elemId;
    if (typeof setting.file_queue_limit === 'undefined') {
        //默认只能传一个文件
        setting.file_queue_limit = 1;
    }
    setting.button_width = setting.button_width || 60;
    setting.button_height = setting.button_height || 30;
    if (!setting.file_size_limit) {
        setting.file_size_limit = "10 MB";
    }
    if (!setting.file_types) {
        setting.file_types = "*.jpg;*.jpeg;*.gif;*.png";
    }
    if (!setting.file_types_description) {
        setting.file_types_description = "图片";
    }
    function uploadFile(swf,idx) {
        if (swf.fileNumber <= idx) return;
        var f = swf.getFile(idx);
        if (!f) return;
        var type = f.type.slice(1);
        if (!type) {
            var name = f.name.toLowerCase();
            if (name.substr(-4) === '.jpg' || name.substr(-5) === '.jpeg') {
                type = 'jpg';
            } else if (name.substr(-4) === '.png') {
                type = 'png';
            } else {
                alert("LavaRadio只支持上传jpg/png格式的图片");
                return;
            }
        }
        $.get('/api/other.getUploadArgs.json?type=' + type,function(res) {
            if (res.err === 'hapn.ok') {
                swf.addPostParam('policy', res.data.policy);
                swf.addPostParam('signature', res.data.signature);
                if (!swf.customSettings['files']) {
                    swf.customSettings['files'] = {};
                }
                swf.customSettings['files'][f.id] = {
                    imgid: res.data.imgid,
                    imgurl: res.data.imgurl
                };
            }
            swf.startUpload(f.id,idx);
        });
    }
    function goNextFile(swf) {
        do {
            swf.idx += 1;
            var file = swf.getFile(swf.idx);
            if (!file || !file.cancel) {
                //上传没有取消，就跳出循环继续上传
                break;
            }
        }while(true);
    }
    var funcDialogComplete = setting.file_dialog_complete_handler || function() {};
    setting.file_dialog_complete_handler = function(selected, queued) {
        if (this.getStats().files_queued === 0)  return;

        this.fileNumber = (this.fileNumber || 0) + selected;
        if (this.idx === undefined) {
            this.idx = 0;
        }
        if (false !== funcDialogComplete.call(this,selected,queued)) {
            uploadFile(this, this.idx);
        }
    };
    var funcUploadComplete = setting.upload_complete_handler || function() {};
    setting.upload_complete_handler = function(file) {
        if (false !== funcUploadComplete.call(this, file, this.idx)) {
            goNextFile(this);
            uploadFile(this, this.idx);
        }
    };
    var funcUploadError = setting.upload_error_handler || function() {};
    setting.upload_error_handler = function(file,code,msg){
        if (false !== funcUploadError.call(this, file)) {
            if (file && file.filestatus !== -5) {
                alert(file.name+'上传出错，可能是网络问题，可以刷新页面重新上传试试。');
            }
            goNextFile(this);
            uploadFile(this, this.idx);
        }
    };

    if (typeof SWFUpload === 'undefined') {
        var script = 'http://'+stHost+'/js/utils/swfupload.js';
        Lava.importScript(script,function(){
            new SWFUpload(setting);
        });
    } else {
        new SWFUpload(setting);
    }
};

Lava.img.uploadPics = function(elemId,maxNumber,saveCallback,userSetting) {
    if (Lava.img.lastUploader) {
        Lava.img.lastUploader = null;
    }
    var setting = {
        file_dialog_complete_handler : function(photoNum){
            if (photoNum > this.settings.max_number) {
                //超出限制了，需要提示.
                Lava.ui.dialog({
                    content:'您同时不能上传超过'+this.settings.max_number+'张照片'
                });
                return;
            }
            if (photoNum == 0) return 0;

            var photoname = (this.settings.photoname === false)?0:1;
            Lava.util.popup('/util/uploadphotos?number='+photoNum+'&photoname='+photoname,'upload-photos');
            Lava.img.lastUploader = this;
            Lava.img.lastUploader.saved = saveCallback;
        },
        upload_progress_handler :  function(file,obj2){
            var loadingNumWidth = Math.floor(obj2/file.size*100) + '%';
            $('#up-photo-'+file.id+' .ui-loadingNum').css({'width':loadingNumWidth});
        },
        upload_complete_handler : function(file,idx){
            if (idx === this.fileNumber-1) {
                //传完了
                $('.upload-photos .modal-header>h3').text('完成上传');
            }
            if (file && file.id && this.customSettings['files']) {
                var img = this.customSettings['files'][file.id];
                $('#up-photo-' + file.id + ' .upPhotoSuccSrc').attr('src', img['imgurl'] + '!small1');
                $('#up-photo-' + file.id + ' .upPhotoSuccSrc').attr('imgid', img['imgid']);
                $('#up-photo-'+file.id+' .photoUploadingSucc').css({'display':'block'});
            }
        },
        file_queue_limit : -1,
        max_number: maxNumber
    };
    for(var p in userSetting) {
        setting[p] = userSetting[p];
    }
    if (!elemId) {
        if ($('#uploaderFlash').length === 0) {
            $('#uploaderContainer').remove();
            $(document.body).append('<span id="uploaderContainer" style="z-index:100;left:-100px;top:-100px;position:absolute"><span id="uploaderFlash"></span>');
        }
        elemId = 'uploaderFlash';
    }
    Lava.img.uploader(elemId,setting);
};
Lava.img.cancelUpload = function() {
    if (Lava.img.lastUploader.idx !== Lava.img.lastUploader.fileNumber) {
        //如果还没有结束，这强制结束
        Lava.img.lastUploader.cancelUpload();
    }
    if (Lava.img.lastUploader.canceled) {
        Lava.img.lastUploader.canceled();
    }
    Lava.util.popmiss();
};
Lava.img.saveUpload = function() {
    if (Lava.img.lastUploader.idx < Lava.img.lastUploader.fileNumber) {
        //没传完
        return;
    }
    var photos = [];
    $('.addPhotoList li').each(function(idx, el) {
        var src = $(el).find('img').attr('src');
        var imgid = $(el).find('img').attr('imgid');
        if (imgid === '0') return;
        photos.push({
            imgid: imgid,
            imgurl: src.substr(0,src.indexOf('!')),
            imgname: $(el).find('input').val()
        });
    });
    if (Lava.img.lastUploader.saved) {
        Lava.img.lastUploader.saved(photos);
    }
    Lava.util.popmiss();
};

//相册照片选取器
Lava.img.palbumPicker = function(setting){
    Lava.img.psetting = setting || {};
    if (Lava.img.psetting.number === undefined) {
        Lava.img.psetting.number = 20;
    }
    Lava.util.popup("/util/pickpalbums",'palbums-picker');
};

Lava.img.photosPicker = function(setting){
    Lava.util.popmiss(1);
    Lava.util.popup("/util/pickphotos?_sz=300&palbum_id="+setting.palbum_id,'photos-picker');
    $('.photos-picker').on('click','.photo',function(){
        if ($(this).hasClass('select')) {
            $(this).removeClass('select');
        } else {
            if ($('.photos-picker .photo.select').length > Lava.img.psetting.number) {
                //选择不能超过最大值
                $('.photos-picker .error-info').show().text('您选择的照片不能超过'+Lava.img.psetting.number+'张');
                return;
            }
            $(this).addClass('select');
        }
        $('.photos-picker .error-info').hide();
    });
};

Lava.img.dissmissPicker = function() {
    Lava.util.popmiss();
    if (Lava.img.psetting.canceled) {
        Lava.img.psetting.canceled();
    }
    Lava.img.psetting = null;
};

Lava.img.pickPhotos = function() {
    var selected = $('.photos-picker li.select');
    if (selected.length === 0) {
        $('.photos-picker .error-info').show().text('请选择照片');
        return;
    }
    var selectimgs = [];
    selected.each(function(){
        var imgId = $(this).attr('id').substr(3);
        var imgUrl = $(this).find('img').attr('src');
        var imgname = $(this).find('p').text();
        var pos = imgUrl.indexOf('!');
        imgUrl = imgUrl.substr(0,pos);
        selectimgs.push({
            imgid:imgId,
            imgurl:imgUrl,
            imgname:imgname
        });
    });
    if (Lava.img.psetting.saved) {
        Lava.img.psetting.saved(selectimgs);
    }
    Lava.img.psetting = null;
    Lava.util.popmiss();
};

Lava.img.slideUploader = function(setting){
    var query = Lava.util.buildQuery(setting);
    Lava.util.popup("/util/slideupload?"+query,'slide-uploader');
};

Lava.img.palbumViewer = function(palbum,self){
    function loadPAlbum(palbum) {
        $('.palbum-viewer').data('palbum',palbum);
        $('.palbum-viewer .palbum-viewer-title').text(palbum.palbum_name.replace(/\(.*?\)/,''));
        $.get('/api/photo.listPAlbumPhotos.json?_sz=500&palbum_id='+palbum.palbum_id).done(function(res){
            if (res.err === 'hapn.ok') {
                var photos = $('.palbum-viewer .palbum-viewer-photos');
                var photohtml = [];
                for(var i=0; i<res.data.lists.length; i++) {
                    photohtml.push('<li photoId="'); //放一个Photoid便于编辑时获取id
                    photohtml.push(res.data.lists[i].photo_id);
                    photohtml.push('" idx="'+i+'">');
                    if ($('.palbum-viewer').data('self')) {
                        photohtml.push('<i class="icong-delete-red"></i><span class="set-pic">设为封面</span>');
                    }
                    photohtml.push('<img title="');
                    photohtml.push(res.data.lists[i].photo_name);
                    photohtml.push('" src="'+res.data.lists[i].photo_url+'!small1" />');
                    photohtml.push('</li>');
                }
                photos.html(photohtml.join(''));
                $('.palbum-viewer .palbum-viewer-photos').attr('total',res.data.lists.length);
                $('.palbum-viewer .palbum-viewer-photos').attr('palbumId',palbum.palbum_id);
                if (photohtml.length > 0) {
                    photos.children()[0].click();
                }
                photos.width(res.data.lists.length*Lava.util.lw(photos.children()[0]));
                var uwidth = photos.width();
                var wwidth = $('.palbum-viewer .palbum-viewer-photos-bar').width();
                var con = 0;//移动距离
                var gapl = 0;//相对左侧间距
                var gapr = uwidth-wwidth;
                if(wwidth >= uwidth){
                    $(".palbum-viewer-footer .carousel-pagecontrol").css("visibility","hidden");
                }else{
                    $(".palbum-viewer-nextPage").click(function(){
                        changeView(1);
                    });
                    $(".palbum-viewer-prevPage").click(function(){
                        changeView(-1);
                    });
                }
                function changeView(dir){
                    if(dir <= 0){
                        if(gapl >= 0 && gapl > wwidth){
                            con += wwidth;
                            gapr += wwidth;
                            gapl -= wwidth;
                            $(".palbum-viewer-photos").css({
                                "transition": "all 500ms ease-in-out 0s",
                                "transform":"translateX("+con+"px"+")"
                            });
                        }else if(gapl >= 0 && gapl <= wwidth){
                            con += gapl;
                            gapl = 0;
                            gapr = uwidth - wwidth;
                            $(".palbum-viewer-photos").css({
                                "transition": "all 500ms ease-in-out 0s",
                                "transform":"translateX("+con+"px"+")"
                            });
                        }
                    }else{
                        if(gapr >= 0 && gapr > wwidth){
                            con -= wwidth;
                            gapr -= wwidth;
                            gapl += wwidth;
                            $(".palbum-viewer-photos").css({
                                "transition": "all 500ms ease-in-out 0s",
                                "transform":"translateX("+con+"px"+")"
                            });
                        }else if(gapr >= 0 && gapr <= wwidth){
                            con -= gapr;
                            gapr = 0;
                            gapl = uwidth - wwidth;
                            $(".palbum-viewer-photos").css({
                                "transition": "all 500ms ease-in-out 0s",
                                "transform":"translateX("+con+"px"+")"
                            });
                        }
                    }
                }

                photos.find('li').hover(function(){
                    $(this).addClass('hover');
                },function(){
                    $(this).removeClass('hover');
                });
            }
        });
        var $palbum = $('.p-albums[palbumId='+palbum.palbum_id+']');
        $([$palbum.next('.p-albums'),$palbum.prev('.p-albums')]).each(function(idx,el){
            var ppalbum = idx===0?$('.palbum-viewer .palbum-viewer-npalbum'):$('.palbum-viewer .palbum-viewer-ppalbum');
            if (el.length) {
                var src = el.find('.palbums img').attr('src');
                ppalbum.find('img').attr('src',src);
                ppalbum.attr('palbum_id',el.attr('palbumId'));
                if (idx === 0) {
                    ppalbum.find('div').text('下一相册');
                } else {
                    ppalbum.find('div').text('上一相册');
                }
                ppalbum.removeClass('disabled');
                ppalbum.find('img').fadeIn();
            } else {
                ppalbum.find('img').fadeOut();
                ppalbum.find('div').text('没有相册');
                ppalbum.find('div').parent().addClass('disabled');
            }
        });
    }
    if ($('.palbum-viewer').length > 0) {
        return loadPAlbum(palbum);
    }

    function selectedPhoto(idx) {
        //直接点某个图片;
        var photos = $('.palbum-viewer .palbum-viewer-photos');
        if (idx < 0) {
            return;
        }
        if (idx >= photos.children().length) {
            return;
        }
        //把当前选择照片大图展示
        var pa = $('.palbum-viewer').data('palbum');
        var photo = photos.find('li[idx='+idx+']');
        var total = parseInt(photos.attr('total'));
        photos.find('.selected').removeClass('selected');
        var src = photo.find('img').attr('src');
        var idx = parseInt(photo.attr('idx'));
        $('.palbum-viewer .palbum-viewer-title').text(pa.palbum_name.replace(/\(.*?\)/,'')+'('+(idx+1)+'/'+total+')');
        $('.palbum-viewer .palbum-viewer-body').html('<img src="'+src.substr(0,src.indexOf('!'))+'!orgin" />');
        $('.palbum-viewer>p').html(photo.find('img').attr('title'));
        photo.addClass('selected');

        //处理缩略图展示位置
        var bar = photos.parent();
        var width = Lava.util.lw(photo[0]);
        var left = width*idx;
        var offsetX = parseInt(photos.css('left'));
        if (left + offsetX - width < 0) {
            var newleft = offsetX+bar.width()-photo.width();
            var maxleft = 0;
            photos.css({left:Math.max(-newleft,-maxleft)+'px'});
        }
        if (left + offsetX+width > bar.width()) {
            var newleft = offsetX-bar.width()+width;
            var maxleft = photos.children().length * width - bar.width();
            photos.css({left:Math.min(newleft,-maxleft)+'px'});
        }
    }

    var loadingpic = 'http://' + stHost + '/img/tu/loading.gif';//加载中图片
    var code = '<div class="palbum-viewer"> \
             <div class="palbum-viewer-title"></div> \
             <div class="palbum-viewer-close">×</div> \
        <div class="palbum-viewer-bprev carousel-control left">‹</div> \
        <div class="palbum-viewer-body"></div> \
        <p></p> \
        <div class="palbum-viewer-bnext carousel-control right">›</div> \
        <div class="palbum-viewer-footer"> \
                <div class="palbum-viewer-ppalbum"><div class="palbum-viewer-tip">上一相册</div><img /><i class="photo-foggy"></i></div> \
                <div class="palbum-viewer-prevPage carousel-pagecontrol">‹</div> \
                <div class="palbum-viewer-photos-bar"> \
                    <ul class="palbum-viewer-photos"></ul> \
                </div> \
                <div class="palbum-viewer-nextPage carousel-pagecontrol">›</div> \
                <div class="palbum-viewer-npalbum"><div class="palbum-viewer-tip">下一相册</div><img /><i class="photo-foggy"></i></div> \
        </div> \
        <div class="palbum-foggy"></div> \
    </div>';
    $(document.body).append(code);
    var tw = $('.palbum-viewer').width();
    var w = $('.palbum-viewer .palbum-viewer-footer').width()-parseInt($('.palbum-viewer .palbum-viewer-footer').css('padding-left'))*2;
    $('.palbum-viewer .palbum-viewer-photos-bar').width(tw-Lava.util.lw('.palbum-viewer .palbum-viewer-ppalbum')*2-Lava.util.lw('.palbum-viewer .palbum-viewer-prevPage')*2-140);

    $('.palbum-viewer').on('click','.palbum-viewer-photos li',function(){
        selectedPhoto(parseInt($(this).attr('idx')));
    });
    $('.palbum-viewer').on('click','.palbum-viewer-bprev',function(){
        var selected = $('.palbum-viewer .selected').prev('li');
        while(selected.length === 1 && selected.css('display') === 'none') {
            selected = selected.prev('li');
        }
        if (selected.length > 0) {
            var idx = parseInt(selected.attr('idx'));
            selectedPhoto(idx);
        }
    });
    $('.palbum-viewer').on('click','.palbum-viewer-bnext',function(){
        var selected = $('.palbum-viewer .selected').next('li');
        while(selected.length === 1 && selected.css('display') === 'none') {
            selected = selected.next('li');
        }
        if (selected.length > 0) {
            var idx = parseInt(selected.attr('idx'));
            selectedPhoto(idx);
        }
    });
    if(self) {
        $('.palbum-viewer').on('click','.icong-delete-red',function(ev){
            var li = $(this).parents('li');
            var photoId = li.attr('photoId');
            $.post('/api/photo._delPAlbumPhoto', {
                palbum_id: $('.palbum-viewer').data('palbum').palbum_id,
                photo_id: photoId
            }).done(function(res) {
                li.fadeOut();
                li.remove();
            });
            ev.stopPropagation();
            ev.preventDefault();
        });

        $('.palbum-viewer').on('click','.set-pic',function(ev){
            $('.palbum-viewer-photos').find('.stblind').removeClass('stblind');
            $(this).addClass('stblind');
            var photoId = $(this).parents('li').attr('photoId');
            $.post('/api/photo._editPAlbum',{
                palbum_id:$('.palbum-viewer').data('palbum').palbum_id,
                pic_id:photoId
            });
            ev.stopPropagation();
            ev.preventDefault();
        });

        $('.palbum-viewer').on('click','>p',function(){
            if ($(this).find('input').length > 0 ||
                $('.palbum-viewer .palbum-viewer-photos .selected').length === 0) {
                return;
            }
            var text = $(this).text();
            $(this).html('<input class="input-xlarge" type="text" value="'+text+'"/>');
            $(this).children('input').focus();
            function savePhotoName(el) {
                var text = $(el).val().trim();
                if (text === '') {
                    $(el).focus();
                    return;
                }
                var palbumId = $('.palbum-viewer').data('palbum').palbum_id;
                var photoId = $('.palbum-viewer .palbum-viewer-photos').find('.selected').attr('photoId');
                $.post('/api/photo._addPAlbumPhoto', {
                    palbum_id: palbumId,
                    photo_id: photoId,
                    photo_name: text
                });
                $(el).parent().html(text);
            }
            $(this).children('input').keyup(function(ev) {
                if (ev.which === 13) {
                    savePhotoName(this);
                }
            });
            $(this).children('input').blur(function() {
                savePhotoName(this);
            });
        });
    }
    $('.palbum-viewer').on('click','.palbum-viewer-ppalbum,.palbum-viewer-npalbum',function(){
        if(!$(this).hasClass('disabled')){
            var $palbum = $('.p-albums[palbumId='+$(this).attr('palbum_id')+']');
            Lava.img.palbumViewer({
                palbum_id:$palbum.attr('palbumId'),
                palbum_name:$palbum.find('p').text()
            });
        }

    });
    var func = function(ev){
        if (ev.which === 27) {
            $('.palbum-viewer').remove();
            $(document).unbind('keyup',func);
        }
    };
    $('.palbum-viewer').on('click','.palbum-viewer-close',function(){
        $('.palbum-viewer').remove();
    });
    $(document).bind('keyup',func);

    $('.palbum-viewer .palbum-viewer-body').html('<img style="width:40px;height:40px" src="'+loadingpic+'" />');
    $('.palbum-viewer').data('self',self);
    return loadPAlbum(palbum);
}; $().ready(function(){
    Lava.ui = {};
    Lava.ui.dur = 0;
    Lava.ui.duration = 0;
    Lava.ui._timer = 0;
    Lava.ui.dialog = function(setting){
        if (setting.dissmissTimer) {
            if (!this._timer) {
                clearInterval(this._timer);
            }
            this._timer = setInterval(function(){
                Lava.ui.setting.dissmissTimer--;
                $('.lavaBtn.fbtnStyle.btn-primary').text('确定('+Lava.ui.setting.dissmissTimer+')');
                if (Lava.ui.setting.dissmissTimer == 0) {
                    clearInterval(Lava.ui._timer);
                    Lava.ui._timer = 0;
                    Lava.ui._fire({name:'Confirm'});
                }
            },1000);
        }

        this.setting = setting || {};
        var html = [];
        html.push('<div class="modal-header">');
        html.push('<button class="close lava-bind" action="f=Lava.ui._fire&name=Cancel" type="button">×</button>');
        html.push('<h3>' + (this.setting.title||'提示') + '</h3>');
        html.push('</div><div class="modal-body">');
        html.push(this.setting.content);
        html.push('</div><div class="modal-footer">');
        if (this.setting.cancel) {
            html.push('<button class="lavaBtn lava-bind" action="f=Lava.ui._fire&name=Cancel">');
            html.push(this.setting.cancelText || '取消');
            html.push('</button>');
        }
        if (this.setting.save) {
            html.push('<button type="submit" class="lavaBtn fbtnStyle btn-primary lava-bind" action="f=Lava.ui._fire&name=Save">');
            html.push(this.setting.saveText || '保存');
            html.push('</button>');
        }
        if (!this.setting.save) {
            html.push('<button type="submit" class="lavaBtn fbtnStyle btn-primary lava-bind" action="f=Lava.ui._fire&name=Confirm">');
            html.push(this.setting.confirmText || '确定'+(setting.dissmissTimer?'('+setting.dissmissTimer+')':''));
            html.push('</button>');
        }
        html.push('</div>');
        Lava.util.popup('html://' + html.join(''));

    };
    Lava.ui._fire = function(args) {
        var evname = args.name.toLowerCase();
        Lava.util.popmiss(1);
        if (Lava.ui.setting[evname] && typeof Lava.ui.setting[evname] === 'function') {
            Lava.ui.setting[evname]();
        }
    };

    Lava.ui.refreshNav = function(program) {
        var func = function(){
            $(".my-program-list > li > a").click(function(){
                $(this).focus();
            });
            (_u&&_u.pri_create_program==1)?Lava.ui.programDropable():null;
        }
        Lava.util.loadPage("#app-main-nav","/util/indexleft",func);
        Lava.util.loadPage("#header","/util/header",func);
    };

    Lava.ui.programDropable = function(){
        $(".my-program-list li").droppable({
            hoverClass: 'hover',
            tolerance: 'pointer',
            over: function(e,ui){
                $('.dragtemp').addClass('show-add');
                $('.slHelper').addClass('show-add');
            },
            out: function(event,ui){
                $('.dragtemp').removeClass('show-add');
                $('.slHelper').removeClass('show-add');
            },
            drop: function(event, ui) {
                var programid = $(this).attr('programid');
                pre = ui.draggable.attr('id').substr(0, 4);
                if (pre === "song") {
                    Lava.util.callModFunc('radio','addSong',{
                        program_id: programid,
                        song_id: ui.draggable.attr('id').substr(4)
                    });
                } else if (pre === "salb") {
                    var salbumid = ui.draggable.attr('id').substr(4);
                    Lava.util.callModFunc('radio','appendSAlbum',{
                        program_id: programid,
                        salbum_id: ui.draggable.attr('id').substr(4)
                    });
                }
            }
        });
    };

    Lava.ui.programSortDropable = function(){
        $(".my-program-list li").droppable({
            tolerance: 'pointer',
            hoverClass: 'red',
            over: function(e,ui){

            },
            out: function(e,ui){

            },
            drop:function(e,ui){
                $(this).before(ui.draggable);
                var allprogramid = [];
                $('.my-program-list > li').each(function(){
                    allprogramid.push($(this).attr('programid'));
                });

                $.post('/api/radio._setProgramOrder',{
                    programs:allprogramid.join(',')
                }).done(function(res){
                    if(res.err == 'hapn.ok'){

                    }
                });
            }
        });
    };

    Lava.ui.showVip = function() {
        //return;
        $.get('/vip/needvip').done(function(res){
            var html = '<div id="needvip_container">'+res+"</div>";
            $(document.body).append(html);

            $('#needvip_container').slideDown('slow');
            $('#vipclose').click(function(){
                $('#needvip_container').slideUp('slow',function(){
                    $('#needvip_container').remove();
                });
            });
        });
    };

    Lava.ui.pager = function(elem,action,setting) {
        var total = setting.total || 0;
        var size = setting.size || 20;
        var idx = setting.idx || 0;
        var html = ['<ul action="'+action+'" total="'+total+'" size="'+size+'" elem="'+elem+'">'];
        var page = Math.ceil(total/size);
        var start = Math.max(0,idx-5);
        var end = Math.min(page-1, start+10);
        if(idx > 0 && page > 11){
            html.push('<li class="prevFirst" idx="0"><a>‹‹</a></li>');
        }
        if (start > 0) {
            html.push('<li class="prev" idx="'+(start-1)+'"><a>‹</a></li>');
        }
        for(var i=start; i<=end; i++) {
            if (i == idx) {
                html.push('<li class="disabled" idx="'+i+'"><a>'+(i+1)+'</a></li>');
            } else {
                html.push('<li idx="'+i+'"><a>'+(i+1)+'</a></li>');
            }
        }
        if (end < page - 1) {
            html.push('<li class="next" idx="'+(end+1)+'"><a>›</a></li>');
        }
        if(idx < page - 1 && page > 11){
            html.push('<li class="nextLast" idx="'+(page-1)+'"><a>››</a></li>');
        }
        html.push('</ul>');
        $(elem).each(function(idx,el){
            $(el).html(html.join(''));
        });
    };

    Lava.ui.smenu = function(args,ev) {
        var songId = args.song_id;
        var fav = (args.fav == undefined?($('#song'+songId).find('.iconj-menu').length === 0):args.fav);
        var html = ['<ul class="lava-menu">'];
        if (window._u && _u.pri_create_program == '1') {
            //能创建节目，就能王节目里追加歌曲
            //html.push('<li class="divider"></li>');
            html.push('<li class="lava-submenu"><a>添加到节目</a>');
            html.push('<div class="lava-menu scrollable">');
            var programs = $('#mpl>li');
            if (programs.length > 0) {
                html.push('<ul class="scroll-content" style="margin-left:0px;height:'+programs.length*26+'px">');
                programs.each(function(idx,el){
                    var programName = $(el).text().trim();
                    var programId = $(el).attr('programid');
                    html.push('<li class="lava-bind" action="module=radio&action=addSong&song_id='+songId+'&program_id='+programId+'"><a>'+programName+'</a></li>');
                });
                html.push('</ul>');
            }
            html.push('<div class="menu-footer lava-bind" action="module=radio&action=showProgramEditor&song_id='+songId+'"><div class="mf">新建节目</div></div>');
            html.push('</div>');
            html.push('</li>');
        }

        if (args.share) {
            var share = args.share==1?'1':'2';
            html.push('<li class="divider"></li>');
            html.push('<li class="lava-bind" action="module=account&action=share&target_type=2&target_id='+pl._song.program_id+'&share='+share+'"><a>分享这个节目</a></li>');
        }
        html.push('</ul>');
        var htmlcode = html.join("\n");
        Lava.util.loadMenu({url:'html://'+htmlcode},ev);
    };

    Lava.ui.pmenu = function(args,ev) {
        var programId = args.program_id;
        var fav = $('#program'+programId).find('.subscribed').length>0;
        var html = ['<ul class="lava-menu">'];
        html.push('<li class="lava-bind" action="module=account&action=share&target_type=2&target_id='+programId+'&share='+(args.status==0?'2':'1')+'"><a>分享</a></li>');
        if (args.audit != 1) {
            if (_u && _u.tags) {
                if(location.href.indexOf('action=getCollect')!=-1){
                    html.push('<li class="disabled"><a><i class="icong-delete cancel-style lava-bind" action="module=account&action=delProjectToSubDir&program_id='+programId+'"></i>从文件夹中删除</a></li>');
                }
                html.push('<li class="lava-submenu"><a>收藏</a>');
                html.push('<div class="lava-menu scrollable">');
                var height = fav?(_u.tags.length+2)*26:_u.tags.length*26;
                html.push('<ul class="scroll-content" style="margin-left:0px;height:'+height+'px">');
                var oldtags = $('#program'+programId).attr('tags').split(',');
                for(var i=0;i<_u.tags.length; i++) {
                    var tag = _u.tags[i];
                    html.push('<li class="lava-bind-subscribe"><a><input pid="'+programId+'" tid="'+tag.tag_id+'" type="checkbox"'+(oldtags.indexOf(tag.tag_id)!=-1?'checked':'')+'/>'+tag.tag_name+'</a></li>');
                }
                if (fav) {
                    //添加一个取消订阅的功能
                    html.push('<li class="divider"></li>');
                    html.push('<li class="lava-bind" action="module=account&action=unsubscribe&program_id='+programId+'"><a>取消收藏</a></li>');
                }

                html.push('</ul>');
                html.push('</div>');
                html.push('</li>');
            } else {
                if (fav) {
                    //if(location.href.indexOf('action=getCollect')!=-1){
                    //html.push('<li class="disabled"><a><i class="icong-delete cancel-style lava-bind" action="module=account&action=delProjectToSubDir&program_id='+programId+'"></i>从文件夹中删除</a></li>');
                    //}else{
                    if(!(_u/**&&_u.user_type=="3"**/&&_u.pri_sc))html.push('<li class="disabled"><a><i class="icong-delete cancel-style lava-bind" action="module=account&action=unsubscribe&program_id='+programId+'"></i>已收藏</a></li>');
                    //}
                } else {
                    if(!(_u/**&&_u.user_type=="3"**/&&_u.pri_sc))html.push('<li class="lava-bind" action="module=account&action=subscribe&program_id='+programId+'"><a>收藏</a></li>');
                }
            }

            if(_u/**&&_u.user_type=="3"**/&&_u.pri_sc){
                //if(location.href.indexOf('action=subscribe')!=-1||location.href.indexOf('action=getCollect')!=-1){
                html.push('<li class="lava-submenu"><a>收藏</a>');
                html.push('<div class="lava-menu scrollable">');
                var subdirs = $("#navDirs>li");
                if (subdirs.length > 0) {
                    html.push('<ul class="scroll-content" style="margin-left:0px;">');
                    subdirs.each(function(idx,el){
                        var dirName = $(el).text().trim();
                        var dirId = $(el).attr('programid');
                        if(idx==0){
                            html.push('<li class="lava-bind" action="module=account&action=subscribe&program_id='+programId+'"><a>默认文件夹</a></li>');
                        }else{html.push('<li class="lava-bind" action="module=account&action=addProjectToSubDir&dirName='+dirName+'&id='+dirId+'&target_id='+programId+'"><a>'+dirName+'</a></li>');
                        }
                    });
                    html.push('</ul>');
                }
                html.push('<div class="menu-footer lava-bind" action="module=account&action=showAddDir"><div class="mf">新建文件夹</div></div>');
                html.push('</div>');
                html.push('</li>');
                //}
            }

            if(_u/**&&_u.user_type=="3"**/&&_u.pri_sc){
                var delSubDir=false;
                if(location.href.indexOf('action=subscribe')!=-1||location.href.indexOf('action=getCollect')!=-1){
                    delSubDir=true;
                }
                $.ajaxSetup({async : false});
                $.post("/api/user.getDirByProgram.json",{'program_id':programId},function(res,textStatus){
                    $.ajaxSetup({async : true});
                    if(res.err === "hapn.ok"){
                        var subdirs =res.data;
                        if(subdirs.length > 0){
                            html.push('<li class="lava-submenu"><a>取消收藏</a>');
                            html.push('<div class="lava-menu scrollable">');
                            html.push('<ul class="scroll-content" style="margin-left:0px;">');
                            var i=0;
                            if(subdirs[0].id==-1){
                                i=1;
                                html.push('<li class="disabled"><a><i class="icong-delete cancel-style lava-bind" action="module=account&action=unsubscribe&delSubDir='+delSubDir+'&program_id='+programId+'"></i>默认文件夹</a></li>');
                            }
                            for(;i<subdirs.length;i++){
                                html.push('<li class="disabled"><a><i class="icong-delete cancel-style lava-bind" action="module=account&action=delProjectToSubDir&delSubDir='+delSubDir+'&dir_id='+subdirs[i].id+'&program_id='+programId+'"></i>'+subdirs[i].dir_name+'</a></li>');
                            }
                            html.push('</ul>');
                            html.push('</div>');
                            html.push('</li>');
                        }
                    }
                });
            }

            if (args.status != 0) {
                if (args.sync == 1) {
                    html.push('<li class="lava-bind" action="module=account&action=subscribe&program_id='+programId+'&sync=0"><a>从手机删除</a></li>');
                } else {
                    html.push('<li class="lava-bind" action="module=account&action=subscribe&program_id='+programId+'&sync=1"><a>离线到手机</a></li>');
                }
            }
        }
        if (_u && _u.pri_audit_program == '1') {
            if (args.status == 0) {
                if(args.audit_status == 1) {
                    if (args.audit != 1) {
                        html.push('<li class="divider"></li>');
                    }
                    html.push('<li class="lava-bind" action="module=radio&action=auditProgram&pass=1&program_id='+programId+'"><a>审核通过</a></li>');
                    html.push('<li class="lava-bind" action="module=radio&action=auditProgram&pass=0&program_id='+programId+'"><a>审核拒绝</a></li>');
                }
            } else {
                if (args.audit != 1) {
                    html.push('<li class="divider"></li>');
                }
                html.push('<li class="lava-bind" action="module=radio&action=auditProgram&pass=0&program_id='+programId+'"><a>审核拒绝</a></li>');
            }
        }
        html.push('</ul>');
        var htmlcode = html.join("\n");
        Lava.util.loadMenu({url:'html://'+htmlcode},ev);

        $('.lava-bind-subscribe input').click(function(ev){
            var args = {
                'program_id':$(this).attr('pid'),
                'tag_id':$(this).attr('tid')
            };
            if (this.checked) {
                //订阅
                Lava.util.callModFunc('account','subscribe',args,ev);
            } else {
                //取消订阅
                Lava.util.callModFunc('account','unsubscribe',args,ev);
            }
            ev.stopPropagation();
        });
    };

    Lava.ui.synchWeather = function(){
        $('.now-channel .item .play-listen').on('click',function(){
            $('.now-channel .item .play-listen').removeClass('on');
            $(this).addClass('on');
        });
        var channelNum = pl._args.channel_id?pl._args.channel_id:'-1';
        $('.now-channel .item').each(function(){
            if($(this).attr('data-channel') == channelNum){
                $(this).find('.play-listen').addClass('on');
            }
        });
    };

    Lava.ui.showSideAd = function(name){
        if (_u && _u.isVip) return; //VIP就不显示广告了
        ///*
        //右边留出128px作为广告位
        if ($('.app-main>.ad-sidebar').length == 0) {
            var adHtml = "<div class='ad-sidebar'></div>";
            $('#app-main-wrapper').parent().append(adHtml);
            $('#app-main-wrapper').css('right','140px');
        }
        $('.app-main>.ad-sidebar').load('/activity/'+name,function(){
            $('.app-main>.ad-sidebar a').click(function(){
                if (ga) {
                    ga('send', 'pageview',{
                        'page':'/'+name+'/'+this.href,
                        'dimension1':((typeof(_u)=='undefined')||(_u==null) ) ?'_':_u['uid']
                    });
                }
            });
        });

        //*/
    };

    Lava.ui.showAdPage = function(name){
        //return;
        if (_u && _u.isVip) return; //VIP就不显示广告了

        $.get('/activity/'+name).done(function(res){
            var html = '<div class="spread-activity">'+res+"</div>";
            $(document.body).append(html);

            $('.spread-activity a').click(function(){
                if (ga) {
                    ga('send', 'pageview',{
                        'page':'/'+name+'/'+this.href,
                        'dimension1':((typeof(_u)=='undefined')||(_u==null) ) ?'_':_u['uid']
                    });
                }
            });

            setTimeout(function(){
                $('.spread-activity').slideDown('slow');
            },200);
            $('.activity-close').click(function(){
                $('.spread-activity').slideUp('slow',function(){
                    $('.spread-activity').remove();
                });
            });
        });
    };

});/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(window, document, $) {

    var isInputSupported = 'placeholder' in document.createElement('input');
    var isTextareaSupported = 'placeholder' in document.createElement('textarea');
    var prototype = $.fn;
    var valHooks = $.valHooks;
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;

    if (isInputSupported && isTextareaSupported) {

        placeholder = prototype.placeholder = function() {
            return this;
        };

        placeholder.input = placeholder.textarea = true;

    } else {

        placeholder = prototype.placeholder = function() {
            var $this = this;
            $this
                .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                .not('.placeholder')
                .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder
                })
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');
            return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function(element) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value;
                }

                return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
            },
            'set': function(element, value) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value = value;
                }

                if (!$element.data('placeholder-enabled')) {
                    return element.value = value;
                }
                if (value == '') {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != document.activeElement) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }
                } else if ($element.hasClass('placeholder')) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                } else {
                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }
        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }

        $(function() {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function() {
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.placeholder', this).each(clearPlaceholder);
                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {
            $('.placeholder').each(function() {
                this.value = '';
            });
        });

    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        var input = this;
        var $input = $(input);
        if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
            if ($input.data('placeholder-password')) {
                $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    return $input[0].value = value;
                }
                $input.focus();
            } else {
                input.value = '';
                $input.removeClass('placeholder');
                input == document.activeElement && input.select();
            }
        }
    }

    function setPlaceholder() {
        var $replacement;
        var input = this;
        var $input = $(input);
        var id = this.id;
        if (input.value == '') {
            if (input.type == 'password') {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().attr({ 'type': 'text' });
                    } catch(e) {
                        $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
                    }
                    $replacement
                        .removeAttr('name')
                        .data({
                            'placeholder-password': $input,
                            'placeholder-id': id
                        })
                        .bind('focus.placeholder', clearPlaceholder);
                    $input
                        .data({
                            'placeholder-textinput': $replacement,
                            'placeholder-id': id
                        })
                        .before($replacement);
                }
                $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
                // Note: `$input[0] != input` now!
            }
            $input.addClass('placeholder');
            $input[0].value = $input.attr('placeholder');
        } else {
            $input.removeClass('placeholder');
        }
    }

}(this, document, jQuery));
/**
 * jquery.gallery.js
 * http://www.codrops.com
 *
 * Copyright 2011, Pedro Botelho / Codrops
 * Free to use under the MIT license.
 *
 * Date: Mon Jan 30 2012
 */

(function( $, undefined ) {

    /*
     * Gallery object.
     */
    $.Gallery 				= function( options, element ) {

        this.$el	= $( element );
        this._init( options );

    };

    $.Gallery.defaults 		= {
        current		: 0,	// index of current item
        autoplay	: false,// slideshow on / off
        interval	: 3000  // time between transitions
    };

    $.Gallery.prototype 	= {
        _init 				: function( options ) {

            this.options 		= $.extend( true, {}, $.Gallery.defaults, options );

            // support for 3d / 2d transforms and transitions
            this.support3d		= Modernizr.csstransforms3d;
            this.support2d		= Modernizr.csstransforms;
            this.supportTrans	= Modernizr.csstransitions;

            this.$wrapper		= this.$el.find('.dg-wrapper');

            this.$items			= this.$wrapper.children();
            this.itemsCount		= this.$items.length;

            this.$nav			= this.$el.find('nav');
            this.$navPrev		= this.$nav.find('.dg-prev');
            this.$navNext		= this.$nav.find('.dg-next');

            // minimum of 3 items
            if( this.itemsCount < 3 ) {
                this.$el.find('.bgCover').remove();
                this.$nav.remove();
                return false;

            }

            this.current		= this.options.current;

            this.isAnim			= false;

            this.$items.css({
                'opacity'	: 0,
                'visibility': 'hidden'
            });

            this._validate();

            this._layout();

            // load the events
            this._loadEvents();

            // slideshow
            if( this.options.autoplay ) {

                this._startSlideshow();

            }

        },
        _validate			: function() {

            if( this.options.current < 0 || this.options.current > this.itemsCount - 1 ) {

                this.current = 0;

            }

        },
        _layout				: function() {

            // current, left and right items
            this._setItems();

            // current item is not changed
            // left and right one are rotated and translated
            var leftCSS, rightCSS, currentCSS;

            if( this.support3d && this.supportTrans ) {

                leftCSS 	= {
                    '-webkit-transform'	: 'translateX(-450px) translateZ(-200px) rotateY(45deg)',//原始translateX(-300px)
                    '-moz-transform'	: 'translateX(-450px) translateZ(-200px) rotateY(45deg)',
                    '-o-transform'		: 'translateX(-450px) translateZ(-200px) rotateY(45deg)',
                    '-ms-transform'		: 'translateX(-450px) translateZ(-200px) rotateY(45deg)',
                    'transform'			: 'translateX(-450px) translateZ(-200px) rotateY(45deg)'
                };

                rightCSS	= {
                    '-webkit-transform'	: 'translateX(450px) translateZ(-200px) rotateY(-45deg)',//原始translateX(-300px)
                    '-moz-transform'	: 'translateX(450px) translateZ(-200px) rotateY(-45deg)',
                    '-o-transform'		: 'translateX(450px) translateZ(-200px) rotateY(-45deg)',
                    '-ms-transform'		: 'translateX(450px) translateZ(-200px) rotateY(-45deg)',
                    'transform'			: 'translateX(450px) translateZ(-200px) rotateY(-45deg)'
                };

                leftCSS.opacity		= 1;
                leftCSS.visibility	= 'visible';
                rightCSS.opacity	= 1;
                rightCSS.visibility	= 'visible';

            }
            else if( this.support2d && this.supportTrans ) {

                leftCSS 	= {
                    '-webkit-transform'	: 'translate(-450px) scale(0.8)',//原始translateX(-300px)
                    '-moz-transform'	: 'translate(-450px) scale(0.8)',
                    '-o-transform'		: 'translate(-450px) scale(0.8)',
                    '-ms-transform'		: 'translate(-450px) scale(0.8)',
                    'transform'			: 'translate(-450px) scale(0.8)'
                };

                rightCSS	= {
                    '-webkit-transform'	: 'translate(450px) scale(0.8)',//原始translateX(-300px)
                    '-moz-transform'	: 'translate(450px) scale(0.8)',
                    '-o-transform'		: 'translate(450px) scale(0.8)',
                    '-ms-transform'		: 'translate(450px) scale(0.8)',
                    'transform'			: 'translate(450px) scale(0.8)'
                };

                currentCSS	= {
                    'z-index'			: 999
                };

                leftCSS.opacity		= 1;
                leftCSS.visibility	= 'visible';
                rightCSS.opacity	= 1;
                rightCSS.visibility	= 'visible';

            }

            this.$leftItm.css( leftCSS || {} );
            this.$rightItm.css( rightCSS || {} );

            this.$currentItm.css( currentCSS || {} ).css({
                'opacity'	: 1,
                'visibility': 'visible'
            }).addClass('dg-center');

        },
        _setItems			: function() {

            this.$items.removeClass('dg-center');

            this.$currentItm	= this.$items.eq( this.current );
            this.$leftItm		= ( this.current === 0 ) ? this.$items.eq( this.itemsCount - 1 ) : this.$items.eq( this.current - 1 );
            this.$rightItm		= ( this.current === this.itemsCount - 1 ) ? this.$items.eq( 0 ) : this.$items.eq( this.current + 1 );

            if( !this.support3d && this.support2d && this.supportTrans ) {

                this.$items.css( 'z-index', 1 );
                this.$currentItm.css( 'z-index', 999 );

            }

            // next & previous items
            if( this.itemsCount > 3 ) {

                // next item
                this.$nextItm		= ( this.$rightItm.index() === this.itemsCount - 1 ) ? this.$items.eq( 0 ) : this.$rightItm.next();
                this.$nextItm.css( this._getCoordinates('outright') );
                // previous item
                this.$prevItm		= ( this.$leftItm.index() === 0 ) ? this.$items.eq( this.itemsCount - 1 ) : this.$leftItm.prev();
                this.$prevItm.css( this._getCoordinates('outleft') );

            }

        },
        _loadEvents			: function() {

            var _self	= this;

            this.$navPrev.on( 'click.gallery', function( event ) {

                if( _self.options.autoplay ) {

                    clearTimeout( _self.slideshow );
                    _self.options.autoplay	= false;

                }

                _self._navigate('prev');
                return false;

            });

            this.$navNext.on( 'click.gallery', function( event ) {

                if( _self.options.autoplay ) {

                    clearTimeout( _self.slideshow );
                    _self.options.autoplay	= false;

                }

                _self._navigate('next');
                return false;

            });

            this.$wrapper.on( 'webkitTransitionEnd.gallery transitionend.gallery OTransitionEnd.gallery', function( event ) {

                _self.$currentItm.addClass('dg-center');
                _self.$items.removeClass('dg-transition');
                _self.isAnim	= false;

            });

        },
        _getCoordinates		: function( position ) {

            if( this.support3d && this.supportTrans ) {

                switch( position ) {
                    case 'outleft':
                        return {
                            '-webkit-transform'	: 'translateX(-450px) translateZ(-300px) rotateY(45deg)',
                            '-moz-transform'	: 'translateX(-450px) translateZ(-300px) rotateY(45deg)',
                            '-o-transform'		: 'translateX(-450px) translateZ(-300px) rotateY(45deg)',
                            '-ms-transform'		: 'translateX(-450px) translateZ(-300px) rotateY(45deg)',
                            'transform'			: 'translateX(-450px) translateZ(-300px) rotateY(45deg)',
                            'opacity'			: 0,
                            'visibility'		: 'hidden'
                        };
                        break;
                    case 'outright':
                        return {
                            '-webkit-transform'	: 'translateX(450px) translateZ(-300px) rotateY(-45deg)',
                            '-moz-transform'	: 'translateX(450px) translateZ(-300px) rotateY(-45deg)',
                            '-o-transform'		: 'translateX(450px) translateZ(-300px) rotateY(-45deg)',
                            '-ms-transform'		: 'translateX(450px) translateZ(-300px) rotateY(-45deg)',
                            'transform'			: 'translateX(450px) translateZ(-300px) rotateY(-45deg)',
                            'opacity'			: 0,
                            'visibility'		: 'hidden'
                        };
                        break;
                    case 'left':
                        return {
                            '-webkit-transform'	: 'translateX(-450px) translateZ(-200px) rotateY(45deg)',//原始translateX(-300px)
                            '-moz-transform'	: 'translateX(-450px) translateZ(-200px) rotateY(45deg)',
                            '-o-transform'		: 'translateX(-450px) translateZ(-200px) rotateY(45deg)',
                            '-ms-transform'		: 'translateX(-450px) translateZ(-200px) rotateY(45deg)',
                            'transform'			: 'translateX(-450px) translateZ(-200px) rotateY(45deg)',
                            'opacity'			: 1,
                            'visibility'		: 'visible'
                        };
                        break;
                    case 'right':
                        return {
                            '-webkit-transform'	: 'translateX(450px) translateZ(-200px) rotateY(-45deg)',//原始translateX(-300px)
                            '-moz-transform'	: 'translateX(450px) translateZ(-200px) rotateY(-45deg)',
                            '-o-transform'		: 'translateX(450px) translateZ(-200px) rotateY(-45deg)',
                            '-ms-transform'		: 'translateX(450px) translateZ(-200px) rotateY(-45deg)',
                            'transform'			: 'translateX(450px) translateZ(-200px) rotateY(-45deg)',
                            'opacity'			: 1,
                            'visibility'		: 'visible'
                        };
                        break;
                    case 'center':
                        return {
                            '-webkit-transform'	: 'translateX(0px) translateZ(0px) rotateY(0deg)',
                            '-moz-transform'	: 'translateX(0px) translateZ(0px) rotateY(0deg)',
                            '-o-transform'		: 'translateX(0px) translateZ(0px) rotateY(0deg)',
                            '-ms-transform'		: 'translateX(0px) translateZ(0px) rotateY(0deg)',
                            'transform'			: 'translateX(0px) translateZ(0px) rotateY(0deg)',
                            'opacity'			: 1,
                            'visibility'		: 'visible'
                        };
                        break;
                };

            }
            else if( this.support2d && this.supportTrans ) {

                switch( position ) {
                    case 'outleft':
                        return {
                            '-webkit-transform'	: 'translate(-450px) scale(0.7)',
                            '-moz-transform'	: 'translate(-450px) scale(0.7)',
                            '-o-transform'		: 'translate(-450px) scale(0.7)',
                            '-ms-transform'		: 'translate(-450px) scale(0.7)',
                            'transform'			: 'translate(-450px) scale(0.7)',
                            'opacity'			: 0,
                            'visibility'		: 'hidden'
                        };
                        break;
                    case 'outright':
                        return {
                            '-webkit-transform'	: 'translate(450px) scale(0.7)',
                            '-moz-transform'	: 'translate(450px) scale(0.7)',
                            '-o-transform'		: 'translate(450px) scale(0.7)',
                            '-ms-transform'		: 'translate(450px) scale(0.7)',
                            'transform'			: 'translate(450px) scale(0.7)',
                            'opacity'			: 0,
                            'visibility'		: 'hidden'
                        };
                        break;
                    case 'left':
                        return {
                            '-webkit-transform'	: 'translate(-350px) scale(0.8)',
                            '-moz-transform'	: 'translate(-350px) scale(0.8)',
                            '-o-transform'		: 'translate(-350px) scale(0.8)',
                            '-ms-transform'		: 'translate(-350px) scale(0.8)',
                            'transform'			: 'translate(-350px) scale(0.8)',
                            'opacity'			: 1,
                            'visibility'		: 'visible'
                        };
                        break;
                    case 'right':
                        return {
                            '-webkit-transform'	: 'translate(350px) scale(0.8)',
                            '-moz-transform'	: 'translate(350px) scale(0.8)',
                            '-o-transform'		: 'translate(350px) scale(0.8)',
                            '-ms-transform'		: 'translate(350px) scale(0.8)',
                            'transform'			: 'translate(350px) scale(0.8)',
                            'opacity'			: 1,
                            'visibility'		: 'visible'
                        };
                        break;
                    case 'center':
                        return {
                            '-webkit-transform'	: 'translate(0px) scale(1)',
                            '-moz-transform'	: 'translate(0px) scale(1)',
                            '-o-transform'		: 'translate(0px) scale(1)',
                            '-ms-transform'		: 'translate(0px) scale(1)',
                            'transform'			: 'translate(0px) scale(1)',
                            'opacity'			: 1,
                            'visibility'		: 'visible'
                        };
                        break;
                };

            }
            else {

                switch( position ) {
                    case 'outleft'	:
                    case 'outright'	:
                    case 'left'		:
                    case 'right'	:
                        return {
                            'opacity'			: 0,
                            'visibility'		: 'hidden'
                        };
                        break;
                    case 'center'	:
                        return {
                            'opacity'			: 1,
                            'visibility'		: 'visible'
                        };
                        break;
                };

            }

        },
        _navigate			: function( dir ) {

            if( this.supportTrans && this.isAnim )
                return false;

            this.isAnim	= true;

            switch( dir ) {

                case 'next' :

                    this.current	= this.$rightItm.index();

                    // current item moves left
                    this.$currentItm.addClass('dg-transition').css( this._getCoordinates('left') );

                    // right item moves to the center
                    this.$rightItm.addClass('dg-transition').css( this._getCoordinates('center') );

                    // next item moves to the right
                    if( this.$nextItm ) {

                        // left item moves out
                        this.$leftItm.addClass('dg-transition').css( this._getCoordinates('outleft') );

                        this.$nextItm.addClass('dg-transition').css( this._getCoordinates('right') );

                    }
                    else {

                        // left item moves right
                        this.$leftItm.addClass('dg-transition').css( this._getCoordinates('right') );

                    }
                    break;

                case 'prev' :

                    this.current	= this.$leftItm.index();

                    // current item moves right
                    this.$currentItm.addClass('dg-transition').css( this._getCoordinates('right') );

                    // left item moves to the center
                    this.$leftItm.addClass('dg-transition').css( this._getCoordinates('center') );

                    // prev item moves to the left
                    if( this.$prevItm ) {

                        // right item moves out
                        this.$rightItm.addClass('dg-transition').css( this._getCoordinates('outright') );

                        this.$prevItm.addClass('dg-transition').css( this._getCoordinates('left') );

                    }
                    else {

                        // right item moves left
                        this.$rightItm.addClass('dg-transition').css( this._getCoordinates('left') );

                    }
                    break;

            };

            this._setItems();

            if( !this.supportTrans )
                this.$currentItm.addClass('dg-center');

        },
        _startSlideshow		: function() {

            var _self	= this;

            this.slideshow	= setTimeout( function() {

                _self._navigate( 'next' );

                if( _self.options.autoplay ) {

                    _self._startSlideshow();

                }

            }, this.options.interval );

        },
        destroy				: function() {

            this.$navPrev.off('.gallery');
            this.$navNext.off('.gallery');
            this.$wrapper.off('.gallery');

        }
    };

    var logError 			= function( message ) {
        if ( this.console ) {
            console.error( message );
        }
    };

    $.fn.gallery			= function( options ) {

        if ( typeof options === 'string' ) {

            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function() {

                var instance = $.data( this, 'gallery' );

                if ( !instance ) {
                    logError( "cannot call methods on gallery prior to initialization; " +
                    "attempted to call method '" + options + "'" );
                    return;
                }

                if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
                    logError( "no such method '" + options + "' for gallery instance" );
                    return;
                }

                instance[ options ].apply( instance, args );

            });

        }
        else {

            this.each(function() {
                var instance = $.data( this, 'gallery' );
                if ( !instance ) {
                    $.data( this, 'gallery', new $.Gallery( options, this ) );
                }
            });

        }

        return this;

    };

})( jQuery );/* Modernizr 2.0.6 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-csstransforms-csstransforms3d-csstransitions-iepp-cssclasses-teststyles-testprop-testallprops-prefixes-domprefixes-load
 */
;
window.Modernizr = function(a, b, c) {
    function C(a, b) {
        var c = a.charAt(0).toUpperCase() + a.substr(1),
            d = (a + " " + o.join(c + " ") + c).split(" ");
        return B(d, b)
    }
    function B(a, b) {
        for (var d in a) if (k[a[d]] !== c) return b == "pfx" ? a[d] : !0;
        return !1
    }
    function A(a, b) {
        return !!~ ("" + a).indexOf(b)
    }
    function z(a, b) {
        return typeof a === b
    }
    function y(a, b) {
        return x(n.join(a + ";") + (b || ""))
    }
    function x(a) {
        k.cssText = a
    }
    var d = "2.0.6",
        e = {}, f = !0,
        g = b.documentElement,
        h = b.head || b.getElementsByTagName("head")[0],
        i = "modernizr",
        j = b.createElement(i),
        k = j.style,
        l, m = Object.prototype.toString,
        n = " -webkit- -moz- -o- -ms- -khtml- ".split(" "),
        o = "Webkit Moz O ms Khtml".split(" "),
        p = {}, q = {}, r = {}, s = [],
        t = function(a, c, d, e) {
            var f, h, j, k = b.createElement("div");
            if (parseInt(d, 10)) while (d--) j = b.createElement("div"), j.id = e ? e[d] : i + (d + 1), k.appendChild(j);
            f = ["&shy;", "<style>", a, "</style>"].join(""), k.id = i, k.innerHTML += f, g.appendChild(k), h = c(k, a), k.parentNode.removeChild(k);
            return !!h
        }, u, v = {}.hasOwnProperty,
        w;
    !z(v, c) && !z(v.call, c) ? w = function(a, b) {
        return v.call(a, b)
    } : w = function(a, b) {
        return b in a && z(a.constructor.prototype[b], c)
    };
    var D = function(a, c) {
        var d = a.join(""),
            f = c.length;
        t(d, function(a, c) {
            var d = b.styleSheets[b.styleSheets.length - 1],
                g = d.cssRules && d.cssRules[0] ? d.cssRules[0].cssText : d.cssText || "",
                h = a.childNodes,
                i = {};
            while (f--) i[h[f].id] = h[f];
            e.csstransforms3d = i.csstransforms3d.offsetLeft === 9
        }, f, c)
    }([, ["@media (", n.join("transform-3d),("), i, ")", "{#csstransforms3d{left:9px;position:absolute}}"].join("")], [, "csstransforms3d"]);
    p.csstransforms = function() {
        return !!B(["transformProperty", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])
    }, p.csstransforms3d = function() {
        var a = !! B(["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"]);
        a && "webkitPerspective" in g.style && (a = e.csstransforms3d);
        return a
    }, p.csstransitions = function() {
        return C("transitionProperty")
    };
    for (var E in p) w(p, E) && (u = E.toLowerCase(), e[u] = p[E](), s.push((e[u] ? "" : "no-") + u));
    x(""), j = l = null, a.attachEvent && function() {
        var a = b.createElement("div");
        a.innerHTML = "<elem></elem>";
        return a.childNodes.length !== 1
    }() && function(a, b) {
        function s(a) {
            var b = -1;
            while (++b < g) a.createElement(f[b])
        }
        a.iepp = a.iepp || {};
        var d = a.iepp,
            e = d.html5elements || "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
            f = e.split("|"),
            g = f.length,
            h = new RegExp("(^|\\s)(" + e + ")", "gi"),
            i = new RegExp("<(/*)(" + e + ")", "gi"),
            j = /^\s*[\{\}]\s*$/,
            k = new RegExp("(^|[^\\n]*?\\s)(" + e + ")([^\\n]*)({[\\n\\w\\W]*?})", "gi"),
            l = b.createDocumentFragment(),
            m = b.documentElement,
            n = m.firstChild,
            o = b.createElement("body"),
            p = b.createElement("style"),
            q = /print|all/,
            r;
        d.getCSS = function(a, b) {
            if (a + "" === c) return "";
            var e = -1,
                f = a.length,
                g, h = [];
            while (++e < f) {
                g = a[e];
                if (g.disabled) continue;
                b = g.media || b, q.test(b) && h.push(d.getCSS(g.imports, b), g.cssText), b = "all"
            }
            return h.join("")
        }, d.parseCSS = function(a) {
            var b = [],
                c;
            while ((c = k.exec(a)) != null) b.push(((j.exec(c[1]) ? "\n" : c[1]) + c[2] + c[3]).replace(h, "$1.iepp_$2") + c[4]);
            return b.join("\n")
        }, d.writeHTML = function() {
            var a = -1;
            r = r || b.body;
            while (++a < g) {
                var c = b.getElementsByTagName(f[a]),
                    d = c.length,
                    e = -1;
                while (++e < d) c[e].className.indexOf("iepp_") < 0 && (c[e].className += " iepp_" + f[a])
            }
            l.appendChild(r), m.appendChild(o), o.className = r.className, o.id = r.id, o.innerHTML = r.innerHTML.replace(i, "<$1font")
        }, d._beforePrint = function() {
            p.styleSheet.cssText = d.parseCSS(d.getCSS(b.styleSheets, "all")), d.writeHTML()
        }, d.restoreHTML = function() {
            o.innerHTML = "", m.removeChild(o), m.appendChild(r)
        }, d._afterPrint = function() {
            d.restoreHTML(), p.styleSheet.cssText = ""
        }, s(b), s(l);
        d.disablePP || (n.insertBefore(p, n.firstChild), p.media = "print", p.className = "iepp-printshim", a.attachEvent("onbeforeprint", d._beforePrint), a.attachEvent("onafterprint", d._afterPrint))
    }(a, b), e._version = d, e._prefixes = n, e._domPrefixes = o, e.testProp = function(a) {
        return B([a])
    }, e.testAllProps = C, e.testStyles = t, g.className = g.className.replace(/\bno-js\b/, "") + (f ? " js " + s.join(" ") : "");
    return e
}(this, this.document),
    function(a, b, c) {
        function k(a) {
            return !a || a == "loaded" || a == "complete"
        }
        function j() {
            var a = 1,
                b = -1;
            while (p.length - ++b) if (p[b].s && !(a = p[b].r)) break;
            a && g()
        }
        function i(a) {
            var c = b.createElement("script"),
                d;
            c.src = a.s, c.onreadystatechange = c.onload = function() {
                !d && k(c.readyState) && (d = 1, j(), c.onload = c.onreadystatechange = null)
            }, m(function() {
                d || (d = 1, j())
            }, H.errorTimeout), a.e ? c.onload() : n.parentNode.insertBefore(c, n)
        }
        function h(a) {
            var c = b.createElement("link"),
                d;
            c.href = a.s, c.rel = "stylesheet", c.type = "text/css";
            if (!a.e && (w || r)) {
                var e = function(a) {
                    m(function() {
                        if (!d) try {
                            a.sheet.cssRules.length ? (d = 1, j()) : e(a)
                        } catch (b) {
                            b.code == 1e3 || b.message == "security" || b.message == "denied" ? (d = 1, m(function() {
                                j()
                            }, 0)) : e(a)
                        }
                    }, 0)
                };
                e(c)
            } else c.onload = function() {
                d || (d = 1, m(function() {
                    j()
                }, 0))
            }, a.e && c.onload();
            m(function() {
                d || (d = 1, j())
            }, H.errorTimeout), !a.e && n.parentNode.insertBefore(c, n)
        }
        function g() {
            var a = p.shift();
            q = 1, a ? a.t ? m(function() {
                a.t == "c" ? h(a) : i(a)
            }, 0) : (a(), j()) : q = 0
        }
        function f(a, c, d, e, f, h) {
            function i() {
                !o && k(l.readyState) && (r.r = o = 1, !q && j(), l.onload = l.onreadystatechange = null, m(function() {
                    u.removeChild(l)
                }, 0))
            }
            var l = b.createElement(a),
                o = 0,
                r = {
                    t: d,
                    s: c,
                    e: h
                };
            l.src = l.data = c, !s && (l.style.display = "none"), l.width = l.height = "0", a != "object" && (l.type = d), l.onload = l.onreadystatechange = i, a == "img" ? l.onerror = i : a == "script" && (l.onerror = function() {
                r.e = r.r = 1, g()
            }), p.splice(e, 0, r), u.insertBefore(l, s ? null : n), m(function() {
                o || (u.removeChild(l), r.r = r.e = o = 1, j())
            }, H.errorTimeout)
        }
        function e(a, b, c) {
            var d = b == "c" ? z : y;
            q = 0, b = b || "j", C(a) ? f(d, a, b, this.i++, l, c) : (p.splice(this.i++, 0, a), p.length == 1 && g());
            return this
        }
        function d() {
            var a = H;
            a.loader = {
                load: e,
                i: 0
            };
            return a
        }
        var l = b.documentElement,
            m = a.setTimeout,
            n = b.getElementsByTagName("script")[0],
            o = {}.toString,
            p = [],
            q = 0,
            r = "MozAppearance" in l.style,
            s = r && !! b.createRange().compareNode,
            t = r && !s,
            u = s ? l : n.parentNode,
            v = a.opera && o.call(a.opera) == "[object Opera]",
            w = "webkitAppearance" in l.style,
            x = w && "async" in b.createElement("script"),
            y = r ? "object" : v || x ? "img" : "script",
            z = w ? "img" : y,
            A = Array.isArray || function(a) {
                    return o.call(a) == "[object Array]"
                }, B = function(a) {
                return Object(a) === a
            }, C = function(a) {
                return typeof a == "string"
            }, D = function(a) {
                return o.call(a) == "[object Function]"
            }, E = [],
            F = {}, G, H;
        H = function(a) {
            function f(a) {
                var b = a.split("!"),
                    c = E.length,
                    d = b.pop(),
                    e = b.length,
                    f = {
                        url: d,
                        origUrl: d,
                        prefixes: b
                    }, g, h;
                for (h = 0; h < e; h++) g = F[b[h]], g && (f = g(f));
                for (h = 0; h < c; h++) f = E[h](f);
                return f
            }
            function e(a, b, e, g, h) {
                var i = f(a),
                    j = i.autoCallback;
                if (!i.bypass) {
                    b && (b = D(b) ? b : b[a] || b[g] || b[a.split("/").pop().split("?")[0]]);
                    if (i.instead) return i.instead(a, b, e, g, h);
                    e.load(i.url, i.forceCSS || !i.forceJS && /css$/.test(i.url) ? "c" : c, i.noexec), (D(b) || D(j)) && e.load(function() {
                        d(), b && b(i.origUrl, h, g), j && j(i.origUrl, h, g)
                    })
                }
            }
            function b(a, b) {
                function c(a) {
                    if (C(a)) e(a, h, b, 0, d);
                    else if (B(a)) for (i in a) a.hasOwnProperty(i) && e(a[i], h, b, i, d)
                }
                var d = !! a.test,
                    f = d ? a.yep : a.nope,
                    g = a.load || a.both,
                    h = a.callback,
                    i;
                c(f), c(g), a.complete && b.load(a.complete)
            }
            var g, h, i = this.yepnope.loader;
            if (C(a)) e(a, 0, i, 0);
            else if (A(a)) for (g = 0; g < a.length; g++) h = a[g], C(h) ? e(h, 0, i, 0) : A(h) ? H(h) : B(h) && b(h, i);
            else B(a) && b(a, i)
        }, H.addPrefix = function(a, b) {
            F[a] = b
        }, H.addFilter = function(a) {
            E.push(a)
        }, H.errorTimeout = 1e4, b.readyState == null && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", G = function() {
            b.removeEventListener("DOMContentLoaded", G, 0), b.readyState = "complete"
        }, 0)), a.yepnope = d()
    }(this, this.document), Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0))
};(function($){

    $.fn.snow = function(options){

        var $flake          = $('<div id="snowbox" />').css({'position': 'absolute', 'top': '-50px'}).html('&#10052;'),
            documentHeight  = $(document).height(),
            documentWidth   = $(document).width(),
            defaults        = {
                minSize     : 10,       //
                maxSize     : 20,       //
                newOn       : 1000,     //
                flakeColor  : "#D6FEFC" //
            },
            options         = $.extend({}, defaults, options);

        var interval        = setInterval( function(){
            var startPositionLeft   = Math.random() * documentWidth - 100,
                startOpacity        = 0.5 + Math.random(),
                sizeFlake           = options.minSize + Math.random() * options.maxSize,
                endPositionTop      = documentHeight - 40,
                endPositionLeft     = startPositionLeft - 100 + Math.random() * 500,
                durationFall        = documentHeight * 10 + Math.random() * 5000;
            $flake.clone().appendTo('body').css({
                left: startPositionLeft,
                opacity: startOpacity,
                'font-size': sizeFlake,
                color: options.flakeColor
            }).animate({
                    top: endPositionTop,
                    left: endPositionLeft,
                    opacity: 0.2
                },durationFall,'linear',function(){
                    $(this).remove()
                }
            );

        }, options.newOn);

    };

})(jQuery);
