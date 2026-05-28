import urllib.request
import re
import os

links = [
    'https://thieunhi.edu.vn/thong-tin/Giay-phep-QDTL-CS-Ung-Van-Khiem-29.html',
    'https://thieunhi.edu.vn/thong-tin/Giay-phep-QDTL-CS-Quang-Trung-28.html',
    'https://thieunhi.edu.vn/thong-tin/Giay-phep-QDTL-CS-Hiep-Binh-27.html',
    'https://thieunhi.edu.vn/thong-tin/Giay-phep-QDTL-CS-Nguyen-Van-Luong-26.html'
]

output_dir = 'bambi-english-frontend/public/image/licenses'
os.makedirs(output_dir, exist_ok=True)

with open('extract_licenses.txt', 'w', encoding='utf-8') as f:
    for link in links:
        try:
            req = urllib.request.Request(link, headers={'User-Agent': 'Mozilla/5.0'})
            html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
            
            body_match = re.search(r'(?is)<div class="content".*?>(.*?)</div>', html)
            if body_match:
                body = body_match.group(1)
            else:
                body = html
                
            images = re.findall(r'(?is)<img[^>]+src=["\']([^"\']+)["\']', body)
            
            # Filter out header/footer images (e.g., logo, ft1.png)
            content_images = [img for img in images if 'logo' not in img.lower() and 'ft' not in img.lower() and 'n1' not in img.lower() and 'n2' not in img.lower() and 'n3' not in img.lower() and 'n4' not in img.lower()]
            
            f.write(f'=== {link} ===\n')
            for img in content_images:
                f.write(f'{img}\n')
                
                # Download image
                img_url = img if img.startswith('http') else f'https://thieunhi.edu.vn{img}'
                img_name = img.split('/')[-1]
                
                try:
                    img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                    img_data = urllib.request.urlopen(img_req).read()
                    
                    with open(os.path.join(output_dir, img_name), 'wb') as img_f:
                        img_f.write(img_data)
                    f.write(f'  -> Downloaded as {img_name}\n')
                except Exception as e:
                    f.write(f'  -> Failed to download: {e}\n')
                    
        except Exception as e:
            f.write(f'Error accessing {link}: {e}\n')

