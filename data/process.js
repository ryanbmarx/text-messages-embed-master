const text_messages_folder = './data/text-messages/';
const assets_folder = './assets/data/';
const fs = require('fs');
const reader = require ('buffered-reader');
const BufferedReader = reader.DataReader;

let process_file = (path, title) => {
    let data = {
            messages: []
        },
        json_path = assets_folder + title + '.json',
        timestamp = null;
    new BufferedReader (path, { encoding: 'utf8' })
        .on('error', function (error){
            console.log ('error: ' + error);
        })
        .on('line', function (line) {
            let message = null;
            if (line.startsWith('r:')) {
                let text = line.split('r:')[1].trim();
                message ={
                    text: text
                }
            }
            else if (line.startsWith('s:')) {
                let text = line.split('s:')[1].trim();
                message = {
                    sender: true,
                    text: text
                }
            }
            else if (line.startsWith('n:')) {
                let text = line.split('n:')[1].trim();
                data.title = text;
            }
            else if (line.startsWith('t:')) {
                timestamp = line.split('t:')[1].trim();
            }
            else {
                console.warn('Unknown sender/receiver in ' + path + ' line: ' + line);
            }
            if (message) {
                if (timestamp !== null) {
                    message.timestamp = timestamp;
                    timestamp = null;
                }
                data.messages.push(message);
            }
        })
        .on ('end', function (){
            fs.writeFile(json_path, JSON.stringify(data), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log(path + ' was converted to and saved to ' +  json_path);
            });
        })
        .read();
};


fs.readdir(text_messages_folder, (err, files) => {
    files.forEach(file => {
        if (file.indexOf('.txt') !== -1) {
            let path = text_messages_folder + file;
            process_file(path, file.replace('.txt', ''));
        }
    });
});


