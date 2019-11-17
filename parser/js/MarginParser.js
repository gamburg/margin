class MarginTree extends TreeModel {
}
/*
function MarginItem( raw_data ) {
	this.raw_data = raw_data;
	this.value = "val";
	this.children = [];
}
*/
class MarginItem {
	
	constructor( raw_data ) {
		this.raw_data = raw_data;
		this.value = this.get_value();
		this.children = [];
	}

	get_value() {
		// leading characters regex:  /^([-_> ])*/g;
		// trailing characters regex: /(([-_>* ])+$)/g;
		var regex_trim_these = /(^([-_>* ])*)|(([-_>* ])+$)/g;
		return this.raw_data.replace( regex_trim_these, '');
	}
 // function get_value
}

function get_margin_item( text ) {
	root_text = "root\n";
	text_tree = root_text.concat( shift_right(text) );
	return get_margin_item_from_text_tree( text_tree );
}

function get_margin_item_from_text_tree( text_tree ) {
	var item = new MarginItem( get_top_level_text( text_tree ) );

	var child_text_trees = get_child_text_trees( text_tree );

	child_text_trees.forEach(function(child_text) {
		var child_item = get_margin_item_from_text_tree( child_text );
		item.children.push( child_item );
	});

	return item;
}

function get_child_text_trees( text_tree ) {
	var child_texts = [];

	var lines = text_tree.split('\n');
	var top_level = get_line_indentation_number( lines[0] );

	// Strip off parent text:
	for(var i = 0; i < lines.length; i++) {
		if( get_line_indentation_number( lines[i] ) === top_level ) {
			lines.splice(i, 1);
		}
	}

	return get_margin_text_from_line_array( lines );

}

function get_top_level_text( text_tree ) {
	var lines = text_tree.split('\n');
	return lines[0];
}

function get_margin_text_from_line_array( lines ) {

 	var child_texts = [];
	var current_indentation = null;
	var current_child_text = "";

	for(var i = 0; i < lines.length; i++) {
		if( !current_indentation ) {
			current_indentation = get_line_indentation_number( lines[i] );
			current_child_text += lines[i];
		} else {
			if( get_line_indentation_number( lines[i] ) === current_indentation ) {
				child_texts.push( current_child_text );
				current_indentation = get_line_indentation_number( lines[i] );
				current_child_text = lines[i];
			} else {
				current_child_text += '\n' + lines[i];
			}
		}
	}

	if(current_child_text) {
		child_texts.push( current_child_text );
	}

 	return child_texts;
}

function get_line_indentation_number(text) {
	return text.search(/\S|$/);
}

function shift_right( text, indenter = " " ) {
	var lines = text.split('\n');
	var shifted_lines = [];

	for(var i = 0; i < lines.length; i++) {
		shifted_lines.push( indenter.concat(lines[i]) );
	}

	return shifted_lines.join("\n");
}
