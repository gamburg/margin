class MarginTree extends TreeModel {
}

class MarginItem {

	constructor( parseable_text ) {
		this.raw_data = get_top_level_text( parseable_text );
		this.value = this.get_value();
		this.annotations = this.set_annotations();
		this.children = [];
		var _this = this; // allows this instance to be visible inside forEach loop

		var child_parseable_text = get_child_text_trees( parseable_text );
		console.log(child_parseable_text);

		child_parseable_text.forEach(function(child_text) {
			var child_item = new MarginItem( child_text );
			_this.children.push( child_item );
		});
	}

	get_value() {
		// leading characters regex:  /^([-_> ])*/g;
		// trailing characters regex: /(([-_>* ])+$)/g;
		// annotations regex = ??????? // <-----TODO
		var regex_trim_these = /(^([-_>* \t])*)|(([-_>* \t])+$)/g;
		return this.raw_data.replace( regex_trim_these, '');
	}

	trim_characters( str, characters_to_remove, leading = true ) {

	}

	get_annotations( key = false ) {
		if( !key ) {
			return this.annotations;
		}
		return this.annotations[key];
	}

	set_annotations() {
		// bracketed segments regex: /\[(?:[^\]\[]+|\[(?:[^\]\[]+|\[[^\]\[]*\])*\])*\]/g
		var annotations = {};
		var key_value_separator = ':';
		var regex_annotations = /\[(?:[^\]\[]+|\[(?:[^\]\[]+|\[[^\]\[]*\])*\])*\]/g;
		var raw_annotations = this.raw_data.match( regex_annotations );

		if( raw_annotations ) {
			raw_annotations.forEach(function( raw_annotation ) {
				var key;
				var value = null;
				var raw_annotation_unwrapped = raw_annotation.slice(1,-1); // remove ] & [
				var key_value_separator_index = raw_annotation_unwrapped.indexOf( key_value_separator );
				if( key_value_separator_index < 0 ) { // no annotation separator found
					key = raw_annotation_unwrapped;
				} else {
					key = raw_annotation_unwrapped.substring(0, key_value_separator_index);
					value = raw_annotation_unwrapped.substring(key_value_separator_index + 1, raw_annotation_unwrapped.length);
				}
				annotations[key] = value;// <-------- TODO: assign annotation's value to annotation's key(not currently functioning)
			});
		}
		return annotations;
	}
}

function get_margin_item( text ) {
	var root_text = "root\n";
	var shifted_text = root_text.concat( shift_right( text ) );
	var parseable_text = conform_text_for_parsing( shifted_text );
	return new MarginItem( parseable_text );
}

function conform_text_for_parsing( text ) {
	return remove_blank_lines( text );
}

function remove_blank_lines( text ) {
	return text.replace(/^\s*[\r\n]/gm, '');
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
