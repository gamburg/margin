jQuery( document ).ready(function() {
    var input_area = jQuery('.input');
    var output_area = jQuery('.output');
    var ouput_select = jQuery('input[type=radio]');
    var update_triggers = jQuery('.input, .output, input[type=radio]');
    var output_radio_selector = 'input[name="output"]:checked';

    make_textarea_margin_friendly( input_area );
    update_output_on_change( update_triggers, input_area, output_area, output_radio_selector );
});

function update_output_on_change( update_triggers, input_area, output_area, output_radio_selector ) {
	update_triggers.on('change keyup paste', function() {
		var converted_text = get_converted_text( input_area.val(), get_output_format( output_radio_selector ) );
		switch( get_display_format(output_radio_selector) ) {
			case 'html':
				output_area.html( converted_text );
			break;
			case 'text':
				output_area.text( converted_text );
			break;
		}
	}).triggerHandler('change');
}

function get_output_format( selector ) {
	return document.querySelector(selector).value;
}

function get_display_format( selector ) {
	return document.querySelector(selector).dataset.display;
}

function get_converted_text( input_text, output_format ) {
	var sampleTree = new MarginTree();
	var root = sampleTree.parse( get_margin_item(input_text) );
	return convert_margin( root, output_format );
}

function make_textarea_margin_friendly( textarea ) {
    enable_tab_in_textarea( textarea );
    preserve_newline_indentation_in_textarea( textarea );
}

function enable_tab_in_textarea( textarea ) {
	textarea.keydown(function(e) {
	    if(e.keyCode === 9) { // tab was pressed
	        // get caret position/selection
	        var start = this.selectionStart;
	            end = this.selectionEnd;

	        var $this = $(this);

	        // set textarea value to: text before caret + tab + text after caret
	        $this.val($this.val().substring(0, start)
	                    + "\t"
	                    + $this.val().substring(end));

	        // put caret at right position again
	        this.selectionStart = this.selectionEnd = start + 1;

	        // prevent the focus lose
	        return false;
	    }
	});
}

function preserve_newline_indentation_in_textarea( textarea ) {
	textarea.keydown(function(e){
	    if(e.keyCode == 13){
	        var cursorPos = this.selectionStart;
	        var curentLine = this.value.substr(0, this.selectionStart).split("\n").pop();
	        var indent = curentLine.match(/^\s*/)[0];
	        var value = this.value;
	        var textBefore = value.substring(0,  cursorPos );
	        var textAfter  = value.substring( cursorPos, value.length );

	        e.preventDefault(); // avoid creating a new line since we do it ourself
	        this.value = textBefore + "\n" + indent + textAfter;
	        setCaretPosition(this, cursorPos + indent.length + 1); // +1 is for the \n
	    }
	});
}

function setCaretPosition(ctrl, pos) {
    if(ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos,pos);
    }
    else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}
