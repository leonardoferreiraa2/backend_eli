import json
import qrcode
from PIL import Image, ImageDraw, ImageFont

# Função para carregar dados JSON de um arquivo externo
def load_json_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

# Carregar dados JSON do arquivo externo
data_list = load_json_data('./editar_salas.json')

# Carregar a imagem de modelo
template_path = './modelo_qr.png'
template = Image.open(template_path)

# Ajustar dimensões da área branca na imagem de modelo
qr_area_width = 500  # largura da área branca
qr_area_height = 500  # altura da área branca
qr_x_offset = 340  # deslocamento horizontal da área branca
qr_y_offset = 475  # deslocamento vertical da área branca

# Definir o tamanho da página A4 em pixels
a4_width_px = 2480
a4_height_px = 3508

# Carregar a fonte
try:
    font_path = "C:/Windows/Fonts/arialbd.ttf"
    font_size = 60
    font = ImageFont.truetype(font_path, font_size)
except IOError:
    font = ImageFont.load_default()
    print("Fonte não encontrada. Usando fonte padrão.")

# Função para gerar um QR code
def generate_qr_code(data):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_img = qr_img.resize((qr_area_width, qr_area_height))
    return qr_img

# Função para quebrar o texto em várias linhas
def wrap_text(text, font, max_width):
    lines = []
    words = text.split()
    line = ""
    for word in words:
        test_line = f"{line} {word}".strip()
        width, _ = ImageDraw.Draw(Image.new('RGB', (1, 1))).textbbox((0, 0, max_width, max_width), test_line, font=font)[2:4]
        if width <= max_width:
            line = test_line
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines

# Lista para armazenar as páginas do PDF
pdf_pages = []

for i in range(0, len(data_list), 2):
    # Criar uma nova imagem A4
    a4_image = Image.new('RGB', (a4_width_px, a4_height_px), 'white')
    draw = ImageDraw.Draw(a4_image)
    
    for j, (x, y) in enumerate([(int((a4_width_px - template.width) / 2), 100),
                                (int((a4_width_px - template.width) / 2), int(a4_height_px / 2) + 100)]):
        if i + j >= len(data_list):
            break
        item = data_list[i + j]
        
        # Gerar QR code
        qr_code = generate_qr_code(item['urlSala'])
        
        # Pegar o template e colá-lo na posição especificada
        a4_image.paste(template, (x, y))

        # Definir a posição do QR code dentro da área branca do template
        qr_x = x + qr_x_offset
        qr_y = y + qr_y_offset

        # Colar o QR code no template
        a4_image.paste(qr_code, (qr_x, qr_y))

        # Desenhar o título no template acima da área branca
        title = item['titulo']
        max_title_width = template.width - 40  # Largura máxima para o título
        lines = wrap_text(title, font, max_title_width)

        # Desenhar cada linha do título
        current_y = y + qr_y_offset - 170
        for line in lines:
            title_bbox = draw.textbbox((0, 0, a4_width_px, a4_height_px), line, font=font)
            title_width = title_bbox[2] - title_bbox[0]
            title_x = x + int((template.width - title_width) / 2)
            draw.text((title_x, current_y), line, font=font, fill=(40, 40, 40))  # Cor mais escura
            current_y += title_bbox[3] - title_bbox[1] + 10  # Ajustar o espaçamento entre linhas

    # Adicionar a imagem A4 à lista de páginas do PDF
    pdf_pages.append(a4_image)

# Salvar o PDF com todas as páginas
pdf_path = './QRCode_Salas_CCER.pdf'
pdf_pages[0].save(pdf_path, save_all=True, append_images=pdf_pages[1:], resolution=100.0, quality=95)

print(f"PDF salvo com sucesso!")
