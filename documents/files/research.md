# Research

## Options

- USB NFC reader connected directly to the tablet/laptop
- Bluetooth NFC reader plus local device logic
- Microcontroller/microcomputer with integrated NFC reader (e.g., ESP32 or Raspberry Pi Pico) hosting a local web‑server or sending data over Bluetooth

## USB NFC reader connected directly to the tablet/laptop

### Pros

- Plug & play
- No setup at all

### Cons

- drivers
- Ipads don't support USB devices easily

## Bluetooth NFC reader

### Pros

- No drivers
- Works on computers and tablets

### Cons

- No plug & play (unless bluetooth searcher in app)
- Expensive

## Microcontroller/microcomputer with integrated NFC reader (e.g., ESP32 or Raspberry Pi Pico) hosting a local web-server or sending data over Bluetooth

### Pros

- No drivers
- Works on computers and tablets
- Plug & play
- Low cost

### Cons

- More complex built
- Flashing the microcontrollers?

## Tech stack

### PWA

- sveltekit
- vite-pwa

### APP

- Flutter

https://pub.dev/packages/bluetooth_low_energy
