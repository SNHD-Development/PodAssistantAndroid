// TOAST
var Toast = {
	// stack of messages.
	messages: [],
	// public styles.
	themes: {
		'success'	: { backgroundColor: '#2e7710', borderColor: '#1f6303' },
		'error'		: { backgroundColor: '#b51b1b', borderColor: '#691b1b' },
		'info'		: { backgroundColor: '#000', borderColor: '#000' },
		'warning'	: { backgroundColor: '#a68c01', borderColor: '#cfae00' }
	},
	// default settings.
	defaults: {
		// the interval(milliseconds) Toast displaying.
        delay		: 3000,
        // the interval(milliseconds) Toast fade in or fade out.
        duration	: 500,
        // event will be fired after Toast was on display.
        shown		: function(){},
        // event will be fired after Toast was hidden.
        hidden		: function(){}
    },
    /**
     * Toast information message.
	 * @param {Object} message message to be toasted.
	 * @param {Object} options optional parameters, Object same as Toast.defaults.
     */
    info: function(message, options) {
        Toast._toast('info', message, options);
    },
    /**
     * Toast warning message.
	 * @param {Object} message message to be toasted.
	 * @param {Object} options optional parameters, Object same as Toast.defaults.
     */
    warning: function(message, options) {
        Toast._toast('warning', message, options);
    },
    /**
     * Toast error message.
	 * @param {Object} message message to be toasted.
	 * @param {Object} options optional parameters, Object same as Toast.defaults.
     */
	error: function(message, options) {
        Toast._toast('error', message, options);
    },
    /**
     * Toast success message.
	 * @param {Object} message message to be toasted.
	 * @param {Object} options optional parameters, Object same as Toast.defaults.
     */
    success: function(message, options) {
        Toast._toast('success', message, options);
    },
    /**
     * Toast message by type(Private).
	 * @param {Object} type types including: success, error, warning, info
	 * @param {Object} message message to be toasted.
	 * @param {Object} options optional parameters, Object same as Toast.defaults.
     */
   	_toast: function(type, message, options) {
   		// validate type.
   		if(!Toast.themes[type]){
   			throw new Error('Can not located the specific theme: ' + type);
   		}
   		// extend options.
        options = _.extend({}, Toast.defaults, options || {});
        // push message to stack.
        Toast.messages.push({
        	type: type,
        	message: message,
        	options: options
        });
        // start toasting.
        if(Toast.messages.length == 1){
        	Toast._nextToast();
        }
    },
    /**
     * Display next toast message.
     */
    _nextToast: function(){
    	// indicating could be continued.
    	if(Toast.messages.length > 0){
    		// fetch first message.
	    	var msg = Toast.messages[0];
	    	// theme up.
	        _(Toast.themes[msg.type]).keys().forEach(function(s){
	        	$.container[s] = Toast.themes[msg.type][s];
	        });
	        // set text.
	        $.titleLabel.text = msg.message;
			// fade in and trigger 'shown' event.
        	$.toast.animate({ opacity: 1, duration: msg.options.duration}, function(){
        		msg.options.shown && msg.options.shown();
        	});
			// fade out after [DELAY] millisecond(s).
    		_.delay(function(){
    			// fade out and trigger 'hidden' event.
    			$.toast.animate({ opacity: 0, duration: msg.options.duration}, function(){
    				msg.options.hidden && msg.options.hidden();
    				// remove the first message and save rest.
    				Toast.messages = _.rest(Toast.messages);
    				// continue or not.
    				if(Toast.messages.length > 0){
    					Toast._nextToast();
    				}
    			})
    		}, msg.options.delay);
       }
    }
};

// exports public methods.
['info', 'warning', 'error', 'success'].forEach(function(n){
	exports[n] = Toast[n];
})
