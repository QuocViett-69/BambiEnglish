import urllib.request
import re

with open('extract_out2.txt', 'w', encoding='utf-8') as f:
    def get_text(url):
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        
        body_match = re.search(r'(?is)<body.*?>(.*?)</body>', html)
        if body_match:
            body = body_match.group(1)
            body = re.sub(r'(?is)<header.*?>.*?</header>', '', body)
            body = re.sub(r'(?is)<footer.*?>.*?</footer>', '', body)
            body = re.sub(r'(?is)<script.*?>.*?</script>', '', body)
            body = re.sub(r'(?is)<style.*?>.*?</style>', '', body)
            
            # remove hidden full_video
            body = re.sub(r'(?is)<div class="full_video".*?>.*?</div>', '', body)
            # Remove left column (menu) if it's there
            body = re.sub(r'(?is)<div class="w-25[^>]+>.*?</div>(?=\s*<div class="w-75)', '', body)
            
            images = re.findall(r'(?is)<img[^>]+src=["\']([^"\']+)["\']', body)
            text = re.sub(r'(?is)<[^>]+>', ' ', body)
            text = re.sub(r'\s+', ' ', text).strip()
            
            f.write(f'=== {url} ===\n')
            f.write(f'TEXT: {text}\n')
            f.write(f'IMAGES: {images}\n\n')

    get_text('https://thieunhi.edu.vn/thong-tin/Giay-Phep-Hoat-Dong-8')
