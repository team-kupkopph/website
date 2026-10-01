# V3 app mockups

The `assets/mockup-*.png` sneak-peek images are rendered from the V3 mobile design artboards
(`design/mobile-v3/*.dc.html` in the KupkopPH docs repo), not drawn by hand. When the design
changes, regenerate them instead of editing the PNGs.

## Regenerate

```bash
python3 tools/v3-mockups/serve.py ../design/mobile-v3
```

1. Open <http://localhost:8766/capture.html> in Chrome. It renders each artboard and saves a
   2× capture into `tools/v3-mockups/raw/` (gitignored). Wait for "Done".
2. Put each capture in a phone frame and write it to `assets/`:

   ```bash
   node tools/v3-mockups/frame.js
   ```

`frame.js` needs `sharp`, the same as `gen-assets.js`. Capturing loads `html-to-image` from
jsDelivr, so it needs a network connection.

## How it works

- **`support.js`** stands in for the design canvas's own runtime. It does just enough to draw an
  artboard: it fills in `{{…}}` values from the artboard's `renderVals()`, and handles
  `<sc-if>` / `<sc-for>`. `?state={…}` picks a state; for example, `ShelterHome` with
  `{"status":2}` shows a verified shelter.
- **`?capture=<name>`** turns off animations, then tidies the screen for a public page before
  saving it:
  - It swaps in fictional organizations: *Silungan Shelter* and *Lingap Rescue*. The design
    uses real shelter names and a "KG Test Shelter" fixture.
  - It removes "Photo placeholder" tags.
- **`capture.html`** sets which artboard and state each image comes from. Add a row there to add
  a mockup, then reference `assets/mockup-<name>.png` from the page.

The artboards have no rescue map, stories or donor-side donate screens. Those three V2-era
mockups were retired rather than redrawn by hand.
