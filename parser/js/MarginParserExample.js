jQuery( document ).ready(function() {
    var input_area = jQuery('.input');
    var output_area = jQuery('.output');
    var ouput_select = jQuery('.output_wrapper input[type=radio]');
    var input_radios = jQuery('.input_wrapper input[type=radio]');
    var update_triggers = jQuery('.input, .output, input[type=radio]');
    var output_radio_selector = 'input[name="output"]:checked';

    make_textarea_margin_friendly( input_area );
    update_input_area_on_select( input_area, input_radios );
    update_output_area_on_change( update_triggers, input_area, output_area, output_radio_selector );
});

function update_input_area_on_select( input_area, trigger_elements ) {
	trigger_elements.on('change', function() {
		var sample_name_to_find = get_radio_input_selected( trigger_elements ).val();
		input_samples.forEach(function( sample ) {
			if( sample.name === sample_name_to_find ) {
				input_area.text( sample.data );
			}
		});
	}).triggerHandler('change');
}

function move_focus_to_end_of_input( e ) {
	val = e.val();
	e.focus().val("").val(val);
}

function update_output_area_on_change( update_triggers, input_area, output_area, output_radio_selector ) {
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

function get_radio_input_selected( input_elements ) {
	return input_elements.parent().find( 'input[type=radio]:checked' );
}

function get_converted_text( input_text, output_format ) {
	var sampleTree = new MarginTree();
	var root = sampleTree.parse( get_margin_item(input_text) );
	return convert_margin( root, output_format );
}

/*********************

	Global Variables

**********************/

var input_samples = [
	{
		name: 'shopping',
		data: '  ** Shopping **\n    [x] Groceries\n    [x] Milk\n    [x] Kale\n    [ ] Frozen Fish [Note: Any sort of white fish, not cod]\n\n  ** Projects **\n    Portfolio Website\n      Front-end\n        [ ] Disallow zoom on mobile\n        [ ] Fix homepage grid on mobile\n      Back-end\n        Wordpress\n          [ ] Update plugins   [date: 2019/07/07]\n        Server\n          [ ] Renew hosting    [date: 2020/01/07]\n          [ ] Upgrade to PHP 7 [date: 2020/02/14]'
	},
	{
		name: 'notes',
		data: '\'Typograpy That Works\'\n\n\tCourse Notes\n\t\tGraphic design is all about lining things up (often in a grid)\n\t\tStandard Alignments\n\t\t\t> Centered: Formal, symmetrical\n\t\t\t> Justified: Economical, saves space\n\t\t\t> Flush Left: Organic\n\t\t\t> Flush Right: Unusual, lends a dynamism\n\t\tThere should be a self-contained logic to the chosen grid\n\t\tMultiple layout ideas should be tested rapidly\n\n\tClass Assignments\n\t\t- Project 1 [due: 2019/01/12]\n\t\t- Midterm [due: 2019/02/18]\n\t\t- Final Project [due: 2019/03/14]'
	},
	{
		name: 'reading',
		data: 'The Crying of Lot 49\n\t[author: Thomas Pynchon]\n\t[publication year: 1966]\n\t[publisher: J. B. Lippincott & Co.]\n\t[status: read]\n\nMy Struggle: Book 1\n\t[author: Karl Ove Knausgaard]\n\t[publication year: 2013]\n\t[publisher: Farrar, Straus and Giroux]\n\t[status: unread]\n\nTrick Mirror: Reflections on Self-Delusion\n\t[author: Jia Tolentino]\n\t[publication year: 2019]\n\t[publisher: Random House]\n\t[status: unread]'
	}
]


/* ------------------------------------------------------------------------- */

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
