import json, sys, os, urllib.request
UA={"User-Agent":"UWCstory/1.0"}
root=sys.argv[1]; res=sys.argv[2]; names=sys.argv[3:]
for n in names:
    d=json.load(urllib.request.urlopen(urllib.request.Request(f"https://api.polyhaven.com/files/{n}",headers=UA),timeout=60))
    g=d['gltf'].get(res) or d['gltf']['1k']; g=g['gltf']
    base=os.path.join(root,n); os.makedirs(base,exist_ok=True)
    files=[(os.path.basename(g['url']), g['url'])]+[(k,v['url']) for k,v in g.get('include',{}).items()]
    for rel,url in files:
        p=os.path.join(base,rel); os.makedirs(os.path.dirname(p),exist_ok=True)
        open(p,'wb').write(urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=120).read())
    print(n, len(files), 'files', sum(os.path.getsize(os.path.join(base,r)) for r,_ in files)//1024, 'KB')
