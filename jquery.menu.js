/**
* @file jQuery plugin that creates the basic interactivity for an ARIA menu widget
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @version 0.2.4
* @requires jquery
* @requires jquery-next-id
* @requires jquery-button-flyout
* @requires jquery-common-keydown
* @requires jquery-roving-tabindex
* @requires jquery-prevent-scroll-keys
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
    * @return {jQuery} chainable jQuery class
    */
    $.fn.menu = function menu(options) {
        options = options || {};

        return this.each(function onEach() {
            var $this = $(this);
            var $button = $this.find('button');
            var $rootMenu = $this.find('> [role=menu], > *:last-child > [role=menu]').first();
            var $groups = $rootMenu.find('> div[role=presentation]');
            var $allmenuitems = $rootMenu.find('> [role^=menuitem], > div > [role^=menuitem], > a');
            var $links = $rootMenu.find('a');
            var $buttons = $rootMenu.find('[role=menuitem]');
            var $checkboxes = $rootMenu.find('[role=menuitemcheckbox]');
            var $radios = $rootMenu.find('[role=menuitemradio]');
            var $firstMenuItem = $allmenuitems.first();
            var $subMenus = $rootMenu.find('[role=menuitem][aria-haspopup=true]');
            var keyCodeMap = createKeyCodeMap();
            var isSupportShortcutKey = !options.disableShortcutKey;
            var shortcutKeyMap = {};

            // store first char of all menu items
            if (isSupportShortcutKey) {
                $allmenuitems.each(function(idx) {
                    var firstChar = $(this).text()[0];
                    if (!shortcutKeyMap[firstChar]) {
                        shortcutKeyMap[firstChar] = idx;
                    }
                });
            }

            // assign id to widget
            $this.nextId('popupmenu');

            // menu is built on top of button-flyout plugin
            $this.buttonFlyout({focusManagement: true});

            // listen for specific key presses on all menu items
            $rootMenu.commonKeyDown();

            // listen for roving tabindex update on all menu items
            $rootMenu.rovingTabindex('[role^=menuitem]', {axis: 'y'});

            // assign id to menu
            $rootMenu.prop('id', $this.prop('id') + '-menu');

            // create popup menu semantics
            $button
                .attr('aria-haspopup', 'true')
                .prop('id', $this.prop('id') + '-button');

            // all submenus start in collapsed state
            $subMenus.attr('aria-expanded', 'false');

            $rootMenu.on('click spaceKeyDown enterKeyDown', function(e) {
                var $target = $(e.originalEvent.target);
                var role = $target.attr('role');

                switch (role) {
                    case "menuitemradio":
                        $radios.attr('aria-checked', 'false');
                        $target.attr('aria-checked', 'true');
                        break;
                    case "menuitemcheckbox":
                        $target.attr('aria-checked', $target.attr('aria-checked') === 'true' ? 'false' : 'true');
                        break;
                    default:
                        break;
                }

                $this.trigger('menuSelect');
            });

            // reset all tabindexes when flyout opens and closes
            $this.on('buttonFlyoutOpen buttonFlyoutClose', function onShowOrHide() {
                $allmenuitems.attr('tabindex', '-1');
            });

            // if char key is pressed, set focus on 1st matching menu item
            if (isSupportShortcutKey) {
                $allmenuitems.on('keydown', function(e) {
                    var char = keyCodeMap[e.keyCode];
                    var itemIndex = shortcutKeyMap[char];

                    if (itemIndex) {
                        $allmenuitems.get(itemIndex).focus();
                    }
                });
            }

            // when a menu item selection has been made, set focus back to button
            $this.on('menuSelect', function onMenuSelect(e) {
                $button.focus();
            });

            // use a plugin to prevent page scroll when arrow keys are pressed
            $this.preventScrollKeys('[role^=menuitem]');

            // mark widget as js initialised
            $this.addClass('menu--js');
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
