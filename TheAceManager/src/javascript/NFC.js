
type = "module"
import { NFC } from 'nfc-pcsc';


const { NFC } = require('nfc-pcsc');

const nfc = new NFC(); 

nfc.on('reader', reader => {


	reader.autoProcessing = false;

	console.log(`${reader.reader.name}  device attached`);

	reader.on('card', card => {

		console.log(`${reader.reader.name}  card inserted`, card);



	});
	
	reader.on('card.off', card => {	
		console.log(`${reader.reader.name}  card removed`, card);
	});

	reader.on('error', err => {
		console.log(`${reader.reader.name}  an error occurred`, err);
	});

	reader.on('end', () => {
		console.log(`${reader.reader.name}  device removed`);
	});

});

nfc.on('error', err => {
	console.log('an error occurred', err);
});