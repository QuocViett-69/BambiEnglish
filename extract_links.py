import urllib.request
import re

with open('links.txt', 'w', encoding='utf-8') as f:
    def get_links(url):
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        
        links = re.findall(r'(?is)<a[^>]+href=["\'](https://thieunhi.edu.vn/thong-tin/[^"\']+)["\'][^>]*>(.*?)</a>', html)
        for link in links:
            f.write(f'{link[0]}\n')

    get_links('https://thieunhi.edu.vn/thong-tin/Giay-Phep-Hoat-Dong-8')
