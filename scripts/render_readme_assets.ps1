$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path "screenshots" | Out-Null
@'
from PIL import Image, ImageDraw, ImageFont
W,H=1280,720
bg=(5,8,18); panel=(13,23,39); text=(244,241,234); muted=(168,179,199); cyan=(37,215,239); green=(88,240,179); pink=(255,114,182); amber=(255,209,102)
try:
    title=ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 56)
    body=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 26)
    small=ImageFont.truetype('C:/Windows/Fonts/consolab.ttf', 18)
    huge=ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 52)
except Exception:
    title=body=small=huge=ImageFont.load_default()
im=Image.new('RGB',(W,H),bg); d=ImageDraw.Draw(im)
d.rounded_rectangle([48,48,1232,672], radius=28, fill=panel, outline=cyan, width=2)
d.text((96,112),'Shopify Klaviyo Retention Ops',font=small,fill=green)
d.text((96,188),'Retention leakage becomes visible',font=title,fill=text)
d.text((96,258),'before discounts erase margin.',font=title,fill=text)
d.text((96,350),'Revenue exposure, lifecycle gaps, cohort decay, discount leaks,',font=body,fill=muted)
d.text((96,390),'deliverability, and inventory mismatch in one revenue-safe surface.',font=body,fill=muted)
for i,(label,val) in enumerate([('AGGREGATE RISK','88.2'),('RECOVER SEGMENTS','2'),('REVENUE AT RISK','$273000'),('SEGMENTS TRACKED','3')]):
    x=96+i*272
    d.rounded_rectangle([x,480,x+240,598],radius=18,fill=(16,28,48),outline=(40,48,66),width=1)
    d.text((x+24,526),label,font=small,fill=muted)
    d.text((x+24,562),val,font=huge,fill=text)
im.save('screenshots/01-overview-proof.png')

def card(draw, xy, size, outline, label, heading, lines, metric):
    x,y=xy; w,h=size
    draw.rounded_rectangle([x,y,x+w,y+h], radius=22, fill=panel, outline=outline, width=2)
    draw.text((x+28,y+34), label, font=small, fill=cyan)
    yy=y+82
    for line in heading:
        draw.text((x+28, yy), line, font=body, fill=text)
        yy += 34
    yy += 20
    for line in lines:
        draw.text((x+28, yy), line, font=body, fill=muted)
        yy += 31
    draw.text((x+28, y+h-94), metric, font=huge, fill=text)
im=Image.new('RGB',(W,H),bg); d=ImageDraw.Draw(im)
d.text((64,70),'Retention segment proof',font=title,fill=text)
card(d,(64,150),(360,430),pink,'RECOVER',['first purchase','no second order'],['Second-order education','and replenishment need','to precede discounts.'],'100')
card(d,(464,150),(360,430),pink,'RECOVER',['vip repeat','buyers'],['Rebuild VIP timing','before discount leaks','train margin loss.'],'95')
card(d,(864,150),(360,430),amber,'WATCH',['holiday discount','cohort'],['Suppress broad seasonal','discounting until margin','and inventory align.'],'69.6')
im.save('screenshots/02-segment-proof.png')
'@ | python -
