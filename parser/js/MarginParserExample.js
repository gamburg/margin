jQuery( document ).ready(function() {
    var input_area = jQuery("textarea.input");
    var output_area = jQuery("textarea.output");
    
    input_area.on('change keyup paste', function() {
    	output_area.val( get_converted_text( input_area.val(), "json" ) );
	}).triggerHandler('change');

});

function get_converted_text( input_text, output_format ) {
	var sampleTree = new MarginTree();
	var root = sampleTree.parse( get_margin_item(input_text) );

	return JSON.stringify(root.model, null, 5);
}
