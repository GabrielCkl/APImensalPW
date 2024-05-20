document.getElementById('btn-criar-email').addEventListener('click', async () => {
    try {
        const emailDesejado = document.getElementById('email-desejado').value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailDesejado || emailDesejado.length < 3 || !emailRegex.test(emailDesejado)) {
            alert('Por favor, digite um endereço de e-mail válido.');
            return;
        }

        const response = await fetch('https://api.mail.gw/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address: emailDesejado,
                password: 'senha123'
            })
        });

        if (response.status !== 201) {
            const errorData = await response.json();
            throw new Error('Erro ao criar conta: ' + response.status + ' - ' + JSON.stringify(errorData));
        }

        const data = await response.json();
        document.getElementById('email-gerado').textContent = `Conta criada com sucesso: ${data.address}`;
        
        // Após criar a conta, obtenha o token
        const token = await obterToken(emailDesejado, 'senha123');
        if (token) {
            console.log('Token obtido: ', token);
            document.getElementById('email-gerado').textContent += `\nToken: ${token}`;
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

        if (response.status !== 200) {
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
