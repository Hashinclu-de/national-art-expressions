#!/bin/bash

# Launch National Art Expressions in Kiosk Mode

echo "Starting kiosk mode for National Art Expressions Exhibition..."

# Close any existing Chrome instances (optional)
# killall "Google Chrome" 2>/dev/null

# Launch Chrome in kiosk mode
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --kiosk \
  --app=http://localhost:3000/en \
  --no-first-run \
  --disable-session-crashed-bubble \
  --disable-infobars \
  --disable-translate \
  --disable-features=TranslateUI \
  --disable-pinch \
  --overscroll-history-navigation=0

echo "Kiosk mode launched!"
