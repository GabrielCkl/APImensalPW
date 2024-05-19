const btnCriarEmail = document.getElementById('btn-criar-email');
const emailGerado = document.getElementById('email-gerado');
const mensagensUl = document.getElementById('mensagens');
const visualizarMensagem = document.getElementById('visualizar-mensagem');
const mensagemConteudo = document.getElementById('mensagem-conteudo');

async function criarEmail() {
    try {
        const response = await fetch('https://api.mail.gw/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address: document.getElementById('email-desejado').value,
                password: 'senha123' 
            })
        });

        if (response.status !== 200) {
            throw new Error('Erro ao criar email: ' + response.status);
        }

        const data = await response.json();
        const email = data.address;
        emailGerado.textContent = email;


        mostrarCaixaEntrada();
    } catch (error) {
        console.error(error);
        alert('Erro ao criar email: ' + error.message);
    }
}

async function buscarMensagens() {
    try {
        const response = await fetch('https://api.mail.gw/messages', {
            headers: {
                'Authorization': 'Bearer TOKEN' 
            }
        });

        if (response.status !== 200) {
            throw new Error('Erro ao buscar mensagens: ' + response.status);
        }

        const data = await response.json();
        const mensagens = data.hydra.member;

        mensagensUl.innerHTML = ''; 

        mensagens.forEach(mensagem => {
            const li = document.createElement('li');
            li.textContent = `${mensagem.from.address}: ${mensagem.subject}`;
            li.addEventListener('click', () => mostrarMensagem(mensagem.id));
            mensagensUl.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar mensagens: ' + error.message);
    }
}

async function mostrarMensagem(idMensagem) {
    try {
        const response = await fetch(`https://api.mail.gw/messages/${idMensagem}`, {
            headers: {
                'Authorization': 'Bearer TOKEN'
            }
        });

        if (response.status !== 200) {
            throw new Error('Erro ao buscar mensagem: ' + response.status);
        }

        const data = await response.json();
        const mensagem = data;

        mensagemConteudo.textContent = `
            De: ${mensagem.from.address}
            Para: ${mensagem.to[0].address}
            Assunto: ${mensagem.subject}
            Mensagem: ${mensagem.text}
        `;

        visualizarMensagem.style.display = 'block';
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar mensagem: ' + error.message);
    }
}

function mostrarCaixaEntrada() {
    document.getElementById('criar-email').style.display = 'none';
    document.getElementById('caixa-entrada').style.display = 'block';
}

function esconderCaixaEntrada() {
    document.getElementById('criar-email').style.display = 'block';
    document.getElementById('caixa-entrada').style.display = 'none';
    visualizarMensagem.style.display = 'none';
}

const btnVoltarCaixaEntrada = document.querySelector('#visualizar-mensagem button#voltar-caixa-entrada');
const btnVoltarCriarEmail = document.querySelector('#visualizar-mensagem button#voltar-criar-email');

btnVoltarCaixaEntrada.addEventListener('click', esconderCaixaEntrada);
btnVoltarCriarEmail.addEventListener('click', esconderCaixaEntrada);