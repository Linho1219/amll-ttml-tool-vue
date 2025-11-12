import csv

CSV_FILE = "./pipelines/splitDict/SUBTLEXus_syllables.csv"
READABLE_FILE = "./pipelines/splitDict/SUBTLEXus_syllables-corrected.txt"
OUTPUT_FILE = "./pipelines/splitDict/SUBTLEXus_syllables-corrected.csv"

corrected = {}
with open(READABLE_FILE, encoding="utf-8") as f:
    for line in f:
        if ":" not in line:
            continue
        if line.startswith("#"):
            continue
        word, split = line.strip().split(":", 1)
        corrected[word.strip()] = split.strip()

with open(CSV_FILE, encoding="utf-8", newline="") as infile, open(
    OUTPUT_FILE, "w", encoding="utf-8", newline=""
) as outfile:

    reader = csv.DictReader(infile)
    writer = csv.DictWriter(outfile, fieldnames=reader.fieldnames)
    writer.writeheader()

    skipped = 0
    updated = 0

    for row in reader:
        w = row["word"]
        if w in corrected:
            val = corrected[w]
            if val == "/":
                skipped += 1
                continue
            row["splitted"] = val
            updated += 1
        writer.writerow(row)

print(f"Updated CSV saved to {OUTPUT_FILE}")
print(f"Updated {updated} words, deleted {skipped} words.")
