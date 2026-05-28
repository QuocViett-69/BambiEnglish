import os

dir_path = 'd:/BambiEnglish/bambi-english-frontend/public/image/licenses'
renames = {
    'Q%C4%90TL%20QT%201(1).jpg': 'cs1_1.jpg',
    'Q%C4%90TL%20QT%202(1).jpg': 'cs1_2.jpg',
    
    'Q%C4%90TL%20QT%201.jpg': 'cs2_1.jpg',
    'Q%C4%90TL%20QT%202.jpg': 'cs2_2.jpg',
    
    'Q%C4%90TL%20NVL%201.jpg': 'cs3_1.jpg',
    'Q%C4%90TL%20NVL%202.jpg': 'cs3_2.jpg',
    
    'Q%C4%90TL%20T%C4%90.jpg': 'cs4_1.jpg',
    'Q%C4%90TL%20T%C4%90%202.jpg': 'cs4_2.jpg',
}

for old, new in renames.items():
    old_path = os.path.join(dir_path, old)
    new_path = os.path.join(dir_path, new)
    if os.path.exists(old_path):
        os.rename(old_path, new_path)
        print(f'Renamed {old} to {new}')
