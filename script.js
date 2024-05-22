document.getElementById('btn-criar-email').addEventListener('click', async () => {
    try {
        const response = await fetch('https://api.mail.gw/accounts', {
            method: 'POST', // Defina o método como POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address: 'seu-email-temporario@mail.gw', // Preencha com um endereço de email válido
                password: 'senha123'
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error('Erro ao criar conta: ' + response.status + ' - ' + JSON.stringify(errorData));
        }
        const data = await response.json();
        document.getElementById('email-gerado').textContent = `Conta criada com sucesso: ${data.address}`;
        const token = await obterToken(data.address, 'senha123');
        if (token) {
            console.log('Token obtido: ', token);
            document.getElementById('email-gerado').textContent += `\nToken: ${token}`;
            adicionarEmailCriado(data.address, token);
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao criar conta: ' + error.message);
    }
});

async function obterToken(email, senha) {
    try {
        const response = await fetch('https://api.mail.gw/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address: email,
                password: senha
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error('Erro ao obter token: ' + response.status + ' - ' + JSON.stringify(errorData));
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error(error);
        alert('Erro ao obter token: ' + error.message);
    }
}

function adicionarEmailCriado(email, token) {
    const emailsLista = document.getElementById('emails-lista');
    const li = document.createElement('li');
    li.textContent = `Email: ${email} - Token: ${token}`;
    emailsLista.appendChild(li);
}
