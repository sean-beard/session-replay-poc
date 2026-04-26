# Session Replay POC

A simple proof of concept for session replay using [rrweb](https://github.com/rrweb-io/rrweb). This POC demonstrates recording user interactions on a web page and replaying them with full visual accuracy.

This repo intentionally uses **pinned CDN / UMD bundles** so the demo stays build-free and predictable for talks.

## 🎯 Features

- **Record user sessions** with all interactions (clicks, inputs, scrolls, etc.)
- **Save sessions** to IndexedDB for persistent storage
- **Replay sessions** with a feature-rich player (play, pause, speed control)
- **Session management** - view, download, and delete saved sessions
- **Export/Import** sessions as JSON files
- **No backend required** - everything runs in the browser

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Python 3 (or any simple HTTP server)
- No build tools or installation required!

This is a **no-build demo**. It does not use the latest recommended `@rrweb/record` / `@rrweb/replay` package setup from rrweb's docs. Instead, it uses the legacy browser-global pattern on purpose to keep the repo easy to run live.

### Usage

1. **Start a local HTTP server:**

   ```bash
   python3 -m http.server 8000
   ```

   This is required to avoid CORS issues and ensure proper loading of resources.

2. **Open the recorder page:**

   Navigate to `http://localhost:8000/record.html` in your browser.

3. **Interact with the demo page:**
   - Fill out the form
   - Click buttons
   - Type in text fields
   - Check/uncheck boxes
   - Increment/decrement the counter

   All your interactions are being recorded automatically!

4. **Save your session:**
   - Click "💾 Save Session" to save to IndexedDB
   - Or click "⬇️ Download JSON" to download as a file

5. **Replay your session:**
   - Click "▶️ Go to Replay" or navigate to `http://localhost:8000/replay.html`
   - Select a saved session from the list
   - Or upload a JSON file
   - Watch your interactions replay!

## 📁 File Structure

```
session-replay/
├── record.html       # Recording page with interactive demo
├── replay.html       # Replay page with video-like player
├── db.js             # IndexedDB helper functions
├── package.json      # Project metadata
└── README.md         # This file
```

## 🎬 How It Works

### Recording

1. **rrweb** observes DOM mutations and other incremental browser events
2. Events are collected in memory as they occur
3. Events can be saved to IndexedDB or downloaded as JSON
4. The recorder also emits periodic full snapshots via checkout for more robust replay
5. Each session includes metadata (timestamp, duration, event count)

### Replay

1. Load session events from IndexedDB or uploaded file
2. **rrweb-player** provides the replay UI on top of rrweb's replay engine
3. Playback includes timeline, speed controls, and pause/play
4. Sessions can be scrubbed through like a video

## 💾 Storage

This POC uses **IndexedDB** for storing sessions locally:

- **Large capacity**: Can store 50MB+ of session data
- **Asynchronous**: Non-blocking for better performance
- **Persistent**: Data survives browser restarts
- **Multiple sessions**: Store and manage many recordings

## 🔧 Technical Details

### Technologies Used

- **[rrweb](https://github.com/rrweb-io/rrweb)** - Pinned UMD bundle for browser recording
- **[rrweb-player](https://github.com/rrweb-io/rrweb/tree/master/packages/rrweb-player)** - Feature-rich replay UI
- **IndexedDB** - Browser database for persistent storage
- **Vanilla JavaScript** - No framework dependencies

### Key Components

#### db.js

Provides helper functions for IndexedDB operations:

- `saveSession(session)` - Save a new session
- `getAllSessions()` - Retrieve all saved sessions
- `getSession(id)` - Get a specific session
- `deleteSession(id)` - Delete a session
- `clearAllSessions()` - Remove all sessions

#### record.html

- Starts recording automatically on page load
- Includes interactive demo content for testing
- Shows list of previously saved sessions
- Can export sessions as JSON files
- Uses a pinned rrweb UMD bundle loaded from jsDelivr

#### replay.html

- Displays list of saved sessions
- Allows file upload for external sessions
- Uses rrweb-player for playback controls
- Shows session metadata (duration, events, timestamp)
- Uses pinned rrweb and rrweb-player UMD bundles loaded from jsDelivr

## 📊 Session Data Format

Sessions are stored as JSON with this structure:

```json
{
  "id": 1,
  "name": "Session 1/8/2026, 10:30:45 AM",
  "timestamp": 1704715845000,
  "duration": 45230,
  "eventCount": 156,
  "events": [
    { "type": 4, "data": {...}, "timestamp": 1704715845000 },
    ...
  ]
}
```

## 🎯 Use Cases

This POC demonstrates how session replay can be used for:

- **User experience research** - See exactly how users interact with your site
- **Bug reproduction** - Capture and replay the exact steps that caused an issue
- **Support & debugging** - Understand user problems with visual context
- **Conversion optimization** - Analyze user behavior and friction points
- **Quality assurance** - Automated testing and verification

## 🔒 Privacy Considerations

For production use, consider:

- **Sensitive data masking** - rrweb supports masking passwords, credit cards, etc.
- **User consent** - Always inform users about recording
- **Data retention** - Implement policies for how long to keep recordings
- **GDPR compliance** - Handle recordings as personal data

See the [rrweb privacy guide](https://github.com/rrweb-io/rrweb/blob/master/guide.md#privacy) for configuration options.

## 🚧 Limitations (POC)

This is a proof of concept with intentional limitations:

- **No backend** - Sessions only stored locally
- **No authentication** - Anyone can access saved sessions
- **Limited storage** - IndexedDB quota varies by browser
- **Same device only** - Sessions don't sync across devices
- **No analytics** - No metrics or aggregated insights

## 🎓 Next Steps

To move beyond POC, consider:

1. **Backend integration** - Store sessions server-side
2. **User authentication** - Associate sessions with users
3. **Search & filtering** - Find sessions by criteria
4. **Session analytics** - Heatmaps, funnels, user flows
5. **Privacy controls** - Configurable data masking
6. **Performance optimization** - Compression, sampling
7. **Real-time streaming** - Live session monitoring
8. **Error integration** - Link sessions to error reports

## 📚 Resources

- [rrweb Documentation](https://github.com/rrweb-io/rrweb/blob/master/guide.md)
- [rrweb Demo](https://www.rrweb.io/)
- [IndexedDB Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## 📝 License

This is a proof of concept for educational purposes.

## 🤝 Contributing

This is a simple POC, but suggestions welcome! Feel free to:

- Report issues
- Suggest improvements
- Share your use cases

---

**Happy Recording! 🎥**
