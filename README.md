# jquery-menu

jQuery plugin that creates keyboard and screen reader accessibility for an ARIA menu widget.

The following structure is expected:

```html
<!-- simple flat menu -->
<div class="menu">
    <button type="button">Open Menu</button>
    <div role="menu">
        <div role="menuitem">Grid</div>
        <div role="menuitem">List</div>
    </div>
</div>
```

You can use `menuitem`, `menuitemradio` or `menuitemcheckbox`.

Then execute the plugin:

```js
$('.menu').menu();
```

The input structure is then modified like so:

```html
<!-- simple flat menu -->
<div class="menu" id="menu_0">
    <button  type="button" aria-controls="menu_0_flyout" aria-expanded="false" aria-haspopup="true">Open Menu</button>
    <div role="menu" id="menu_0_flyout">
        <div role="menuitem">Grid</div>
        <div role="menuitem">List</div>
    </div>
</div>
```

The menu can now be navigated with cursor keys or mouse.

Grouped menu structures are also supported:

```html
<!-- grouped menu -->
<div class="menu">
    <button>Grouped Menu</button>
    <div role="menu">
        <div role="presentation">
            <div role="menuitem">Grid</div>
            <div role="menuitem">List </div>
        </div>
        <hr />
        <div role="presentation">
            <div role="menuitemradio" aria-checked="true">Name</div>
            <div role="menuitemradio" aria-checked="false">Date</div>
            <div role="menuitemradio" aria-checked="false">Price</div>
        </div>
        <hr />
        <div role="presentation">
            <div role="menuitemcheckbox" aria-checked="true">Buy it Now</div>
            <div role="menuitemcheckbox" aria-checked="true">Auction</div>
        </div>
    </div>
</div>
```

A `menuSelect` event is triggered when activating any menuitem with click, space or enter. The event can be delegated to the menu, and bound to the menuitem, like so:

```js
$menu.on('menuSelect', '[role^=menuitem]', function(e) {
    // this = menuitem element
});
```

Which achieves the same as:

```js
$menu.on('click spaceKeyDown enterKeyDown', '[role^=menuitem]', function(e) {
    // this = menuitem element
});
```

Radio buttons and checkboxes will be automatically toggled.
