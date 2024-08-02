###### SOBRE DEPLOY

- basta rodar npm run build no terminal e subir as os arquivos para o github 
que e o deploys será feito automaticamente, tanto para o back, quanto para o front end

- nao precisa criar as variáveis .env no ambiente de desenvolvimeto

###### IMAGENS

- as imagens estão sendo salvas na minha conta, através desse link: https://ibb.co/album/V26J6n
mas, isso pode ser alterado, so tem que editar todos os registros com os novos links das imagens


###### PARA GERAR NOVO PDF QRCODE
    navegue até esse caminho: 
        cd backend_eli
        cd edit_qrcode

    execute esse comado:    
    python gerar_pdf_qrcode.py

    o arquivo será gerado na raiz



ATENÇÃO!!!!!!!!!!

- SUGIRO USAR O INSOMINIA PARA CRIAR, DELETAR E EDITAR SALAS

- TANTO APÓS CRIAR OU EDITAR SALA, SALVE O JSON DE RETORNO NO ARQUIVO .\edit_qrcode\editar_salas.json,
PERMITINDO A GERAÇÃO DOS QRCODES E A LOCALIZAÇÃO FUTURA PARA CRIAR OU EDITAR SALAS

- rota GET para artualizar o arquivo: backend-eli.vercel.app/salas 
(cole o retorno no arquivo .\edit_qrcode\editar_salas.json)

###### PARA CRIAR NOVA SALA
    rota POST: backend-eli.vercel.app/salas
    body json: 
        {
            "titulo": "Escadaria Queimado",
            "texto": "A escadaria é o fio que interliga todos os espaços do ",
            "urlFoto": "https://i.ibb.co/nRzyxsK/escadaria-queimado.png",
            "urlVideo": "",
            "urlAudio": ""
        }

###### PARA EDITAR SALA
    rota PUT: backend-eli.vercel.app/salas/update/<ID EM .\edit_qrcode\editar_salas.json>
    body json: 
        {
            "titulo": "Escadaria Queimado",
            "texto": "A escadaria é o fio que interliga todos os espaços do ",
            "urlFoto": "https://i.ibb.co/nRzyxsK/escadaria-queimado.png",
            "urlVideo": "",
            "urlAudio": ""
        }

###### PARA DELETAR SALA
    rota DELETE: backend-eli.vercel.app/salas/delete/<ID EM .\edit_qrcode\editar_salas.json>