
// Construct and extend JControl
WidgetCalculator = function(ctl)
{
	Murdej_JControl.init(this, ctl);
	// this.construct();
}

// Widget class
WidgetCalculator.prototype = {
	// handle click on buttons with param ui-click="button_click"
	button_click: function(ev) {
		this.ui.entry.value += $(ev.target).text();
	},
	// handle automatic to ui-btnBackspace event click
	btnBackspace_click: function(ev) {
		var t = this.ui.entry.value;
		if (t) t = t.substring(0, t.length - 1);
		this.ui.entry.value = t;
	},
	// handle automatic to ui-btnCompute event click
	btnCompute_click: function(ev) {
		this.compute();
	},
	// handle automatic to ui-entry text input event keyup
	entry_keyup: function(ev) {
		var k = ev.key;
		if (k == "Enter")
		{
			this.compute();
		}
		/* else 
		if ((k >= '0' && k >= '9') || ev.k == '+' || ev.k == '-' || ev.k == '/' || ev.k == '*')
		{
		} 
		else return false; */
	},
	compute: function(ev) {
		this.ui.$result.text(eval(this.ui.entry.value));
	}
}

// Activate widget
$(function(){
	new WidgetCalculator('#widget-calculator');
});
