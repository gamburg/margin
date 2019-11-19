function convert_margin( root, output_format ) {
	switch(output_format) {
		case 'json':
			return JSON.stringify(root.model, null, 5);
		break;

		case 'markdown':
			return 'markdown output here';
		break;

		case 'pretty':
			return '<input type="checkbox" name="vehicle1" value="Bike"> I have a bike<br>';
		break;
	}
	return null;
}
