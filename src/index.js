const readline = require('readline');
const Client = require('./client');
const MSproxy = require('./msproxy');

// const client = new MSproxy();
// client.connect();
// setTimeout(() => {
//     client.joinRoom();
//     // client.createVideoProducer();
// }, 1000);

const client = new Client('test000000', 'junshan');
readStdin();

function readStdin() {
    let cmd = readline.createInterface(
        {
            input: process.stdin,
            output: process.stdout
        });

    cmd.question('cmd> ', (answer) => {
        switch (answer) {
            case '':
                {
                    readStdin();
                    break;
                }

            case 'h':
                {
                    console.log('help');
                    break;
                }
            case 'join':
                {
                    break;
                }
            default:
                {
                    stdinError(`unknown command: ${answer}`);
                    stdinLog('press \'h\' or \'help\' to get the list of available commands');

                    readStdin();
                }
        }
    });
}
