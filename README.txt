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
            "texto": "A escadaria é o fio que interliga todos os espaços do Centro Cultural Eliziário Rangel, por isso é batizada de Queimado, revolta que orienta todos os nomes dos outros espaços e a missão da nossa instituição.",
            "urlFoto": "https://i.ibb.co/nRzyxsK/escadaria-queimado.png",
            "urlVideo": "",
            "urlAudio": ""
        }

###### PARA EDITAR SALA
    rota PUT: backend-eli.vercel.app/salas/update/<ID EM .\edit_qrcode\editar_salas.json>
    body json: 
        {
            "titulo": "Escadaria Queimado",
            "texto": "A escadaria é o fio que interliga todos os espaços do Centro Cultural Eliziário Rangel, por isso é batizada de Queimado, revolta que orienta todos os nomes dos outros espaços e a missão da nossa instituição.",
            "urlFoto": "https://i.ibb.co/nRzyxsK/escadaria-queimado.png",
            "urlVideo": "",
            "urlAudio": ""
        }

###### PARA DELETAR SALA
    rota DELETE: backend-eli.vercel.app/salas/delete/<ID EM .\edit_qrcode\editar_salas.json>