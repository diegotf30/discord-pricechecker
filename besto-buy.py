import requests
from bs4 import BeautifulSoup

PRODUCTS = [
  'https://www.bestbuy.com.mx/p/mario-kart-8-deluxe-nintendo-switch-best-buy/1000205548',
  'https://www.bestbuy.com.mx/p/nintendo-switch-super-smash-bros-peleas/1000212258',
  'https://www.bestbuy.com.mx/p/super-mario-odyssey-edicion-estandar-nintendo-switch-best-buy/1000209327'
]

def get_div_text(html, klass='', id=''):
  elem = html.body.find('div', attrs={ 'class': klass, 'id': id })
  return '' if elem is None else elem.text

def found_kword(text):
  return any(k in text for k in kwords)

def get_discount(url):
  r = requests.get(url)
  if not r.ok:
    return f'Couldnt query: {url}'
  html = BeautifulSoup(r.text)

  prod_name = get_div_text(html, id='sku-title')
  if get_div_text(html, klass='shop-add-to-cart') == 'Agotado':
    return f'"{prod_name}" is sold out :/'

  # Current Price
  price_str = get_div_text(html, klass='product-price')
  price = int(price_str.replace('$', '').replace(',', ''))
  # Discount
  disc_str = get_div_text(html, klass='product-savings')
  if disc_str == '':
    return f'Didnt find discount for "{prod_name}"'

  disc = int(disc_str.split()[1].replace('$', '').replace(',', ''))
  return f'Found discount! price: ${price} disc: ${disc} - {url}"'
  

r = requests.get('https://bestbuy.com.mx')
kwords = ['liquidación', 'liquidacion'] # TODO(diegotf): add more kwords

if r.ok:
  for prod in PRODUCTS:
    print(get_discount(prod))
  if found_kword(r.text):
    print('yei hurra yipi')
else:
  print('no jala el peo')
