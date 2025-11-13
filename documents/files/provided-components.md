# Provided components by customer

## NFC reader

https://www.tertiumtechnology.com/en/product/bluerfid-hf/

Blue RFID HF (Tertium)

according to the datasheet: you can read & write with this
Manage all ISO 15693 commands (mandatory, optional, custom), ISO 14443-A (only ID reading)

RFID/NFC reader
USB or TTL serial
USB uses FT232R chip (appears in /dev/ttyUSB0)

115200 baud presumably

5V over USB

Reading distance: up to 10 cm

Antenna is not a known component, according to the website, you have to contact the manufacturer directly to get access to an antenna. -> no datasheet on antenna
The chip should also have an embedded antenna

it also has a multi tone beeper (audible when plugged in) & a led
