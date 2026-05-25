# Ink Calibration Samples

These samples compare Watrmark calculator estimates against printer software ink consumption.

## Sample 1

- File: `WhatsApp Image 2026-04-09 at 13.49.47.jpeg`
- Print size: 10 × 10 inches
- Quantity: 1 sheet
- Printer software ink consumption: 0.141 ml
- Calculator coverage: 18.34%
- Calculator billing tier: 25%
- Calculator estimated ink using current billed formula: 0.125 ml
- Difference: calculator is 0.016 ml low
- Calibration factor vs current billed formula: 1.128
- Raw coverage ink estimate before billing tier: 0.0917 ml
- Calibration factor vs raw coverage formula: 1.5376

Notes:
- This sample suggests the current billed ink formula is about 12.8% lower than printer software for this artwork.
- Do not recalibrate from one image only. Average multiple samples across light, medium, and heavy coverage artwork.

## Sample 2

- File: `Screenshot 2026-05-25 at 1.59.51 PM.jpeg`
- Print size: 10 × 10 inches
- Quantity: 1 sheet
- Printer software ink consumption: 0.472 ml
- Calculator coverage: 43.28%
- Calculator billing tier: 50%
- Calculator estimated ink using current billed formula: 0.25 ml
- Difference: calculator is 0.222 ml low
- Calibration factor vs current billed formula: 1.888
- Raw coverage ink estimate before billing tier: 0.2164 ml
- Calibration factor vs raw coverage formula: 2.1811

Notes:
- This dark background sample shows the current formula underestimates heavy coverage artwork.
- The printer software value is close to the calculator's 100% tier estimate of 0.5 ml for 100 sq.in, which suggests the billing tier mapping may need to move dark/full-background artwork into a higher practical tier.

## Running Average

## Sample 3

- File: `Screenshot 2026-05-25 at 2.03.17 PM.jpeg`
- Print size: 12 × 12 inches
- Quantity: 1 sheet
- Printer software ink consumption: 0.075 ml
- Calculator coverage: 5.05%
- Calculator billing tier: 10%
- Calculator estimated ink using current billed formula: 0.072 ml
- Difference: calculator is 0.003 ml low
- Calibration factor vs current billed formula: 1.0417
- Raw coverage ink estimate before billing tier: 0.0364 ml
- Calibration factor vs raw coverage formula: 2.0627

Notes:
- This light white-background sample is already very close to the current billed formula.
- It supports keeping a minimum/light coverage tier rather than relying only on raw pixel coverage.

## Sample 4

- File: `Screenshot 2026-05-25 at 2.09.34 PM.jpeg`
- Print size: 12 × 12 inches
- Quantity: 1 sheet
- Printer software ink consumption: 0.208 ml
- Calculator coverage: 13.75%
- Calculator billing tier: 25%
- Calculator estimated ink using current billed formula: 0.18 ml
- Difference: calculator is 0.028 ml low
- Calibration factor vs current billed formula: 1.1556
- Raw coverage ink estimate before billing tier: 0.099 ml
- Calibration factor vs raw coverage formula: 2.101

Notes:
- This white-background medium coverage sample is reasonably close to the current 25% billed tier.
- Similar to sample 1, it suggests a small uplift for mid-tier artwork.

## Sample 5

- File: `WhatsApp Image 2026-05-21 at 13.43.59.jpeg`
- Print size: 12 × 12 inches
- Quantity: 1 sheet
- Printer software ink consumption: 0.164 ml
- Calculator coverage: 10.17%
- Calculator billing tier: 25%
- Calculator estimated ink using current billed formula: 0.18 ml
- Difference: calculator is 0.016 ml high
- Calibration factor vs current billed formula: 0.9111
- Raw coverage ink estimate before billing tier: 0.0732 ml
- Calibration factor vs raw coverage formula: 2.2397

Notes:
- This yellow/white artwork falls just above the 10% threshold, which moves it to the 25% tier.
- Printer software consumption is slightly lower than the current 25% billed estimate, suggesting the 10% to 25% threshold may need smoothing rather than a hard jump.

## Running Average

- Average calibration factor vs current billed formula: 1.2249
- Average calibration factor vs raw coverage formula: 2.0244
