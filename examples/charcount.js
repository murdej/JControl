CharCounter = function(ctl)
{
	Murdej_JControl.init(this, ctl);
	// show on start
	this.input_keyup();
}

CharCounter.prototype.input_keyup = function()
{
	this.ui.$info.text(
		this.ui.$input.val().length
		+ (this.ui.input.maxLength > 0 ? "/" + this.ui.input.maxLength : "")
	);
}

// Activate widget on all .widget-char-counter elements
$(function(){
	Murdej_JControl.setupAll(CharCounter, '#charcount .widget-char-counter');
});
