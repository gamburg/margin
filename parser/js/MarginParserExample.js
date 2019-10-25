marginInputText = `Parent
 Child
  Grandchild
   Great Grandchild
 Child`;

var sampleTree = new MarginTree();
var root = sampleTree.parse( get_margin_item(marginInputText) );

printOutput(JSON.stringify(root.model, null, 5)); // Parsed Margin

function printOutput( output ) {
	jQuery("textarea").append(output + "\n");
}
