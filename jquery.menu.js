/**
* @file jQuery plugin that creates the basic interactivity for an ARIA menu widget
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @version 0.7.2
* @requires jquery
* @requires jquery-next-id
* @requires jquery-click-flyout
* @requires jquery-common-keydown
* @requires jquery-roving-tabindex
*/
(function($, window, document, undefined) {
    function createKeyCodeMap() {
        var map = {};

        for (var charCode = 65; charCode <= 90; charCode++) {
            map[charCode] = String.fromCharCode(charCode);
        }

        return map;
    }

    /**
    * jQuery plugin that creates the basic interactivity for an ARIA menu widget
    *
    * @method "jQuery.fn.menu"
    * @param {Object} [options]
    * @param {boolean} [options.autoWrap] - boolean indicating whether keyboard focus should wrap (default: false)
    * @param {boolean} [options.buttonSelector] - css selector for button element (default: 'button')
    * @param {boolean} [options.overlaySelector] - css selector for overlay element (default: '[role=menu]')
    * @param {boolean} [options.debug] - print debug statements to console (default: false)
    * @return {jQuery} chainable jQuery class
    */
    $.fn.menu = function menu(options) {
        options = $.extend({
            autoWrap: false,
            buttonSelector: 'button',
            debug: false,
            disableShortcutKey: false,
            overlaySelector: '[role=menu]'
        }, options);

        return this.each(function onEach() {
            var buttonSelector = options.buttonSelector;
            var overlaySelector = options.overlaySelector;
            var $widget = $(this);
            var $button = $widget.find(buttonSelector);
            var $rootMenu = $widget.find(overlaySelector);
            var $allMenuItems = $rootMenu.find('[role^=menuitem]');
            var $buttons = $rootMenu.find('[role=menuitem]');
            var $checkboxes = $rootMenu.find('[role=menuitemcheckbox]');
            var $radios = $rootMenu.find('[role=menuitemradio]');
            var $firstMenuItem = $allMenuItems.first();
            var keyCodeMap = createKeyCodeMap();
            var isSupportShortcutKey = !options.disableShortcutKey;
            var shortcutKeyMap = {};

            var collapseMenu = function() {
                setTimeout(function(e) {
                    $button.attr('aria-expanded', 'false');
                    $button.focus();
                }, 50);
            };

            var onEscapeKeyDown = collapseMenu;

            // store first char of all menu items
            if (isSupportShortcutKey) {
                $allMenuItems.each(function(idx) {
                    var firstChar = $(this).text()[0];
                    if (!shortcutKeyMap[firstChar]) {
                        shortcutKeyMap[firstChar] = idx;
                    }
                });
            }

            // assign id to widget
            $widget.nextId('menu');

            // menu is built on top of button-flyout plugin
            $widget.clickFlyout({
                autoCollapse: true,
                debug: options.debug,
                triggerSelector: buttonSelector,
                focusManagement: 'first',
                overlaySelector: overlaySelector
            });

            // listen for roving tabindex update on all menu items
            $rootMenu.rovingTabindex('[role^=menuitem]', {axis: 'y', autoReset: true, autoWrap: options.autoWrap, debug: options.debug});

            // assign id to menu
            $rootMenu.prop('id', $widget.prop('id') + '-menu');

            // create popup menu semantics
            $button
                .attr('aria-haspopup', 'true')
                .prop('id', $widget.prop('id') + '-button');

            // listen for clicks, scoped to menuitem, bound to menu
            $widget.on('click enterKeyDown spaceKeyDown', '[role^=menuitem]', function(e) {
                var $menuitem = $(this);
                var role = $menuitem.attr('role');

                e.stopPropagation();

                switch (role) {
                    case 'menuitemradio':
                        $radios.attr('aria-checked', 'false');
                        $menuitem.attr('aria-checked', 'true');
                        break;
                    case 'menuitemcheckbox':
                        $menuitem.attr('aria-checked', $menuitem.attr('aria-checked') === 'true' ? 'false' : 'true');
                        break;
                    default:
                        break;
                }

                setTimeout(function(e) {
                    $menuitem.trigger('menuSelect');
                    collapseMenu();
                }, 100);
            });

            $widget.on('escapeKeyDown', '[role^=menuitem]', onEscapeKeyDown);

            // if char key is pressed, set focus on 1st matching menu item
            if (isSupportShortcutKey) {
                $allMenuItems.attr('tabindex', '-1');
                $widget.on('keydown', '[role^=menuitem]', function(e) {
                    var char = keyCodeMap[e.keyCode];
                    var itemIndex = shortcutKeyMap[char];

                    if (itemIndex !== undefined) {
                        $allMenuItems.get(itemIndex).focus();
                    }
                });
            }

            // mark widget as js initialised
            $widget.addClass('menu--js');
        });
    };
}(jQuery));

/**
* The jQuery plugin namespace.
* @external "jQuery.fn"
* @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
*/

/**
* menuSelect event
*
* @event menuSelect
* @type {object}
* @property {object} event - event object
*/
