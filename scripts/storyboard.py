"""Builds analysis/motion-timeline.json and output/<id>/storyboard.json from content/content.json (source→output time mapping per variant)."""
import json, os
c = json.load(open('content/content.json')); fps = 30
def segs(v):
    cfg = c['variants'][v]; s = cfg.get('segments') or c['variants'][cfg['segmentsFrom']]['segments']
    return [(round(a*fps), round(b*fps)) for a, b in s]
def m(v, t):
    f = t*fps; acc = 0
    for a, b in segs(v):
        if f < a: return acc
        if f < b: return acc + round(f-a)
        acc += b-a
    return acc
def kept(v, t): return any(t*fps >= a-0.5*fps and t*fps < b for a, b in segs(v))
sb = {"productionId": c["productionId"], "fps": fps, "variants": {}}
for v, cfg in c["variants"].items():
    sp = sum(b-a for a, b in segs(v)); out = round(cfg["outroSeconds"]*fps)
    scenes = []
    for s in c["scenes"]:
        if s.get("variants") and v not in s["variants"]: continue
        a, b = m(v, s["s"]), m(v, s["e"])
        if b-a < 8: continue
        spoken = [x["t"].replace("{", "").replace("}", "") for x in c["captions"] if x["e"] > s["s"] and x["s"] < s["e"] and kept(v, x["s"])]
        scenes.append({"id": s["id"], "template": s["type"], "sourceSeconds": [s["s"], s["e"]], "outputSeconds": [round(a/fps, 2), round(b/fps, 2)], "spoken": spoken, "sfx": [x[1] for x in s.get("sfx", [])]})
    scenes.append({"id": "outro", "template": "brandOutro (whip → logo → headline → CFA card → lens flare)", "outputSeconds": [round(sp/fps, 2), round((sp+out)/fps, 2)]})
    caps = [{"outputSeconds": [round(m(v, x["s"])/fps, 2), round(m(v, x["e"])/fps, 2)], "text": x["t"].replace("{", "").replace("}", "")} for x in c["captions"] if kept(v, x["s"])] if cfg["captions"] else []
    sb["variants"][v] = {"file": cfg["file"], "durationSeconds": round((sp+out)/fps, 2), "speechSeconds": round(sp/fps, 2), "scenes": scenes, "captions": caps}
json.dump(sb, open('analysis/motion-timeline.json', 'w'), ensure_ascii=False, indent=1)
od = f"output/{c['productionId']}"; os.makedirs(od, exist_ok=True)
json.dump(sb, open(f"{od}/storyboard.json", 'w'), ensure_ascii=False, indent=1)
print({k: v["durationSeconds"] for k, v in sb["variants"].items()})
