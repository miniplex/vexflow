Raphael.fn.group = function() {
	
	var r = this,
		cfg = (arguments[0] instanceof Array) ? {} : arguments[0],
		items = (arguments[0] instanceof Array) ? arguments[0] : arguments[1];
	
	var	group = r.raphael.vml ? 
				document.createElement("group") : 
				document.createElementNS("http://www.w3.org/2000/svg", "g");
	
	function Group(cfg, items) {
		var set = r.set(items);		
		r.canvas.appendChild(group);
		this.type = "group";
		this.node = group;
		this.set = set;
		
		this.paper = r;
		this.attrs = this.attrs || {};
		this._ = {
            transform: [],
            sx: 1,
            sy: 1,
            deg: 0,
            dx: 0,
            dy: 0,
            dirty: 1
        };
		
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
			var transform = group.getAttribute('transform');
			group.setAttribute('transform', updateScale(transform, newScale));
			return this;
	};
		
	Group.prototype.rotate = function(deg) {
			var transform = group.getAttribute('transform');
			group.setAttribute('transform', updateRotation(transform, deg));
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
					group.appendChild(it.node);
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