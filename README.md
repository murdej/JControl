# JControl

Simple javascript utility for making widgets.

Simple example:

**HTML**

	<span class="widget-char-counter">
		<input type="text" maxlength="10" class="ui-input" />
		<span class="ui-info"></span>
	</span>	

**Javascript**

	CharCounter = function(ctl)
	{
		// Extend class, link controls and handle events
		Murdej_JControl.init(this, ctl);
		// show on start
		this.input_keyup();
	}

	// Called automaticaly on text input on key up
	CharCounter.prototype.input_keyup = function()
	{
		// access to element marked by class ui-...
		//   this.ui.$name is same as $(this.ui.name)
		this.ui.$info.text(
			this.ui.$input.val().length
			+ (this.ui.input.maxLength > 0 ? "/" + this.ui.input.maxLength : "")
		);
	}

	// Activate widget on all .widget-char-counter elements
	$(function(){
		Murdej_JControl.setupAll(CharCounter, '#charcount .widget-char-counter');
	});
	
More examples in folder examples

