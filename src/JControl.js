/******************************************************************
 * Author: Murděj Ukrutný <vit.peprnicek@gmail.com>
 * Licence: GNU General Public License v3.0
 *          https://github.com/murdej/JControl/blob/master/LICENSE
 *****************************************************************/
Murdej_JControl = function() {
	this.element = null;
	this.ui = {};
	this.addJqUi = true;
	this.setupFormControl = function(element) 
	{
		this.setupUi('$name', element);
	}
	this.setupUi = function(prefix, element) {
		if (typeof element == "string")
		{
			this.element = $(element)[0]
		} 
		else if ('jquery' in element) 
		{
			this.element = element[0];
		}
		else
		{
			this.element = element;
		}
		if (!prefix) prefix = "ui-";
		prefixL = prefix.length;
		var ui = this.ui;
		var self = this;
		if (prefix == '$name') {
			$(this.element).find('[name]').each(function (i) {
				if (this.type == "radio")
					self.addUiElement(new Murdej_RBLHelper(this.form, this.name), this.name);
				else
					self.addUiElement(this, this.name);
			});
		} else {
			$(this.element).find('[class*="' + prefix + '"]').each(function (i) {
				var classNames = this.className.split(' ');
				for(var i in classNames) {
					if (classNames[i].substr(0, prefixL) == prefix) {
						// ui[classNames[i].substr(3)] = this;
						self.addUiElement(this, classNames[i].substr(prefixL));
					};
				};
			});
		}
		this.element.control = this;
	}
	this.autoBindEvents = ['click', 'dblclick', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'blur', 'change', 'focus', 'select', 'submit', 'keyup', 'keydown', 'scroll'];
	this.pathItemSeparator = '-';
	this.uiEventPrefix = 'ui-';
	this.eventMethodPrefix = '';
	this.eventMethodSeparator = '_';
	this.addUiElement = function(element, path) {
		//console.log(path);
		var container = this.ui;
		var pathItems = path.split(this.pathItemSeparator);
		var lastItemNum = pathItems.length - 1;
		// přidat property
		for(var i in pathItems) {
			var pathItem = pathItems[i];
		
			if (i == lastItemNum) {
				container[pathItem] = element;
				if (this.addJqUi) container['$' + pathItem] = $(element);
			} else {
				if (container[pathItem] == undefined) container[pathItem] = {};
			};
			container = container[pathItem];
		}
		// přidat události

		for(var i = 0; i < this.autoBindEvents.length; i++)
		{
			var ename = this.autoBindEvents[i];
			var hmethod = null;
			// existuje parametr ui-(event)
			var pname = this.uiEventPrefix + ename; 
			if (element.attributes && pname in element.attributes)
			{
				// $(element)[ename](this[element.attributes[pname]]);
				// continue;
				hmethod = this[element.attributes[pname].value];
			}
			else
			{
				// existuje metoda (nazev)_(event)
				var mname = this.eventMethodPrefix + path.replace('-', '_') + this.eventMethodSeparator + ename;
				if (mname in this && typeof this[mname] == 'function')
				{
					// $(element)[ename](this[mname]);
					hmethod = this[mname];
				}
			}
			if (hmethod)
			{
				if (element instanceof Murdej_RBLHelper)
					$(element.controls)[ename]($.proxy(hmethod, this));
				else
					$(element)[ename]($.proxy(hmethod, this));
			}
		}
	}
	this.uiFind = function(path) {
		var element = this.ui;
		var pathItems = path.split(this.pathItemSeparator);
		for (var i in pathItems) {
			element = element[pathItems[i]];
		}
		
		return element;
	}
	this.uiVisible = function(name, visible) {
		// $(this.ui[name]).togle(visibile);
		if (visible) {
			$(this.uiFind(name)).show();
		} else {
			$(this.uiFind(name)).hide();
		}
	}
}

Murdej_JControl.prototype.getControl = function(el) {
	while(!el.control && el) {
		el = el.parentNode;
	};
	return el.control;
};

Murdej_JControl.setupAll = function(cl, selector) {
	$(selector).each(function() {
		new cl(this);
	});
};

Murdej_RBLHelper = function(form, name) {
	this.controls = [];
	this.construct(form, name);
}
Murdej_RBLHelper.prototype = 
{
	construct: function(form, name)
	{
		this.controls = $(form).find("input[type='radio'][name='" + name + "']");
	},
	val: function(value)
	{
		if (value === undefined)
		{
			var val = null;
			this.controls.each(function(){
				if (this.checked) val = this.value;
			});
			return val;
		} 
		else
		{
			this.controls.each(function(){
				this.checked = value == this.value;
			});
		}
	}
}

Murdej_JControl.newControl = function(proto, init)
{
	var clss = function(ctl)
	{
		this._construct(ctl);
	}
	for (var k in proto)
		clss.prototype[k] = proto[k];
	if (init == 'form')
	{
		clss.prototype._construct = function(ctl)
		{
			this.inherid = Murdej_JControl;
			this.inherid();
			this.setupFormControl(ctl);
			if (this.construct) this.construct();
		}
	}
	else
	{
		clss.prototype._construct = function(ctl)
		{
			this.inherid = Murdej_JControl;
			this.inherid();
			this.setupUi(null, ctl);
			if (this.construct) this.construct();
		}
	}
	
	return clss;
}

Murdej_JControl.init = function(cls, container, prefix)
{
	cls.inherid = Murdej_JControl;
	cls.inherid();
	cls.setupUi(prefix, container);
}
