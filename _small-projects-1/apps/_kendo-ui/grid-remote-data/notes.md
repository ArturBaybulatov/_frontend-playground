```javascript
var lastSelectedRow;

$grid.kendoGrid({
    //...

    edit: function(args) {this.select('tr[data-uid="' + args.model.uid + '"]')},

    save: function(args) {
        var item = args.model;
        this.one('dataBound', function() {this.select('tr[data-uid="' + item.uid + '"]')});
    },

    change: function() {lastSelectedRow = kendoGrid.select()},

    dataBound: function() {
        if (lastSelectedRowUid != null) {
            window.setTimeout(function() {
                kendoGrid.select('tr[data-uid="' + lastSelectedRowUid + '"]');
            }, 100);
        }
    },
});
```

---------------------------
