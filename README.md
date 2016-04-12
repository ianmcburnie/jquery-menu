# jquery-menu

jQuery plugin that creates keyboard and screen reader accessibility for an ARIA menu widget.

The following structure is expected:

```html
<!-- simple flat menu -->
<div class="menu">
    <button>Open Menu</button>
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

The input structure is modified:

```html
<!-- simple flat menu -->
<div class="menu" id="menu_0">
    <button aria-controls="menu_0_flyout" aria-expanded="false" aria-haspopup="true">Open Menu</button>
    <div role="menu" id="menu_0_flyout">
        <div role="menuitem">Grid</div>
        <div role="menuitem">List</div>
    </div>
</div>
```

Menu can be navigated with cursor keys or mouse.
