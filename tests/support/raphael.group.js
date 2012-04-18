Raphael.fn.group = function() {

	var r = this,
		cfg = (arguments[0] instanceof Array) ? {} : arguments[0],
		items = (arguments[0] instanceof Array) ? arguments[0] : arguments[1];
	
	function Group(cfg, items) {
		var set = r.set(items);
		var	group = r.raphael.vml ? 
				document.createElement("group") : 
				document.createElementNS("http://www.w3.org/2000/svg", "g");
		
		r.canvas.appendChild(group);
		this.type = "group";
		this.node = group;
		this.group = group;
		this.set = set;
		
	}
    
    _.extend(Group.prototype, Raphael.el);

	function updateScale(transform, scale) {
		var scaleString = 'scale(' + scale + ')';
		if (!transform) {
			return scaleString;
		}
		if (transform.indexOf('scale(') < 0) {
			return transform + ' ' + scaleString;
		}
		return transform.replace(/scale\(-?[0-9]+(\.[0-9][0-9]*)?\)/, scaleString);
	}
		
	function updateRotation(transform, rotation) {
		var rotateString = 'rotate(' + rotation + ')';
		if (!transform) {
			return rotateString;
		}
		if (transform.indexOf('rotate(') < 0) {
			return transform + ' ' + rotateString;
		}
		return transform.replace(/rotate\(-?[0-9]+(\.[0-9][0-9]*)?\)/, rotateString);
	}

	Group.prototype.scale =  function (newScale) {
			var transform = this.group.getAttribute('transform');
			this.group.setAttribute('transform', updateScale(transform, newScale));
			return this;
	};
		
	Group.prototype.rotate = function(deg) {
			var transform = this.group.getAttribute('transform');
			this.group.setAttribute('transform', updateRotation(transform, deg));
	};

	Group.prototype.push = function(item) {
		    var that = this;
			function pushOneRaphaelVector(it){
			var i;
				if (it.type === 'set') {
					for (i=0; i< it.length; i++) {
						pushOneRaphaelVector(it[i]);
					}
				} else {
					that.group.appendChild(it.node);
					that.set.push(it);
				}
			}
			pushOneRaphaelVector(item)
			return that;
	};
		
	Group.prototype.getBBox = function() {
			return this.set.getBBox();
	};
	
	return new Group(cfg, items);

};