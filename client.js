import axios from 'axios';
import inquirer from 'inquirer';

async function main() {
    while (true) {
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Scegli un\'opzione:',
                choices: ['Registrazione', 'Accesso', 'Esci'],
            },
        ]);

        if (choice === 'Esci') {
            console.log('Bye!');
            process.exit(0);
        }

        const { username, password } = await inquirer.prompt([
            { type: 'input', name: 'username', message: 'Inserisci username:' },
            { type: 'password', name: 'password', message: 'Inserisci password:' },
        ]);

        if (choice === 'Registrazione') {
            try {
                const response = await axios.post('http://localhost:3000/register', { username, password });
                console.log(response.data);
            } catch (error) {
                console.error('Errore nella registrazione:', error.message);
            }
        } else {
            try {
                const response = await axios.post('http://localhost:3000/login', { username, password });
                if (!response.data.userFound) {
                    console.log('Nome non trovato.');
                } else if (response.data.success) {
                    console.log('Accesso effettuato correttamente!');
                } else {
                    console.log('Credenziali errate, riprova.');
                }
            } catch (error) {
                console.error('Errore nell\'accesso:', error.message);
            }
        }
    }
}

main();