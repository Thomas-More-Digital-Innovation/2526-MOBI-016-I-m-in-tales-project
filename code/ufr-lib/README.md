
# uFCoder libraries

Scope of this project are libraries used with **uFR** and **uFR Zero** Series devices and SDK examples.
Libraries are supported at following platforms:
Windows 32 and 64 bit (static and dynamic)
Windows ARM64 (dynamic only)
Linux 32 and 64 bit (dynamic & static)
Linux ARM and ARM-HF (dynamic & static)
Mac OSX 64 bit & Universal (dynamic only)
iOS 64 bit (static & framework)
Android ARM 64 bit (.aar)
ESP32 ESP-IDF component

## Getting Started

Download project, choose appropriate architecture and place a library in appropriate directory.
Consult documentation for [API reference](https://code.d-logic.com/nfc-rfid-reader-sdk/ufr-doc/-/blob/master/uFR_Series_NFC_reader_API.pdf). For quick insight and functions' prototypes, check **/include/ufCoder.h** header file.

### Prerequisites

[**uFR**](https://webshop.d-logic.com/products/nfc-rfid-reader-writer/ufr-series-dev-tools-with-sdk.html) or [**uFR Zero**](https://webshop.d-logic.com/products/nfc-rfid-reader-writer/ufr-zero-series.html) Series reader.

## License

See the [uFR_library_license.md](/license/uFR_library_license.md) file for details

## Acknowledgments

* Libraries are specific to mentioned hardware ONLY and some other hardware might have different approach, please bear that in mind.  

## Changelog

## [Version 6.0.65] - 2026-03-31

> [!NOTE] Note:
>
> Android platform release only (no changes to other platforms)

- Native .so libraries now use 16KB ELF page alignment, as required by Google Play Store
- Fixed thread-safe AAR variant (uFCoder-ts.aar) — previously built without THREAD_SAFE flag
- Dropped x86 (32-bit) ABI support; remaining supported ABIs: armeabi-v7a, arm64-v8a, x86_64

## [Version 6.0.63] - 2026-03-26

- `GetReaderInfoStr/JSON()` support for Zero Round readers added
- `MRTD_ReadDocumentDataProgress()` added
- RF reset recovery mechanism added to Desfire NDEF Read/Write operations on failure with internal retries

### General Changes

## [Version 6.0.62] - 2026-03-25

- Added new API calls: `GetReaderInfoJSON()` & `Flasher_InstallFirmwarePackageByName()`
- Async UID stability & debounce mechanism, retry/timeout improvements on Desfire NDEF Read/Write operations

### General Changes

## [Version 6.0.61] - 2026-03-15

### General Changes

- Desifre NDEF format EV3 only support

## [Version 6.0.60] - 2026-03-15

- Recursive async card detection bug fix on iOS when `EspReaderReset` succeeds

### General Changes

## [Version 6.0.59] - 2026-03-14

- Added `EspReaderReset` after Desfire NDEF Read/Write operations as a communication recovery method

### General Changes

## [Version 6.0.58] - 2026-03-13

- `ufR_int_DesfireWriteStdDataFile` - bug fix: wrong RSP_EXT len parsing fixed

### General Changes

## [Version 6.0.57] - 2026-03-13

### General Changes

- Minor changes to iOS BLE communication 

## [Version 6.0.56] - 2026-03-11

### General Changes

- `uFR_int_DesfireReadNDEFMessage()` - internal change to chunk reading into smaller packets via APDU

## [Version 6.0.55] - 2026-03-06

### General Changes

- `uFR_int_DesfireReadNDEFMessage()` - internal change to chunk reading into smaller packets

## [Version 6.0.54] - 2026-03-06

- `uFR_int_DesfireReadNDEFMessage()` - internal change to use native desfire read commands instead of APDU

### General Changes

## [Version 6.0.53] - 2026-02-20

### General Changes

- `uFR_int_DesfireReadNDEFPayloadEx()` - Added new caller-supplied buffer variant of NDEF payload read with `payload_length` parameter.

- `uFR_int_DesfireReadNDEFPayload()` - patched issues with potential buffer overruns. 

## [Version 6.0.52] - 2026-02-10

### General Changes

- `ReaderOpen/Ex()` - bug fixed, compatibility for older uFR series readers resolved.

## [Version 6.0.51] - 2026-02-02

### General Changes

- `Flasher_GetInstalledPackageName()` added. Used to retrieve the name of the firmware package currently installed on the device.

## [Version 6.0.50] - 2026-01-27

** Authentication for MIFARE CLASSIC cards **

- MifareAuthKeyA_PK(uint8_t block_addr, uint8_t *crypto1_key);
- MifareAuthKeyB_PK(uint8_t block_addr, uint8_t *crypto1_key);
- MifareAuthKeyA(uint8_t block_addr, uint8_t key_index);
- MifareAuthKeyB(uint8_t block_addr, uint8_t key_index);

## [Version 6.0.49] - 2026-01-26

### General Changes

- Added thread safe libraries.
- Fixed old bootloader flashing issues.
- Added standalone animation functions in thread safe library: `LoadAnimation`, `StartAnimation`, `StopAnimation`, `IsAnimationPlaying`.

## [Version 6.0.48] - 2025-12-24

### General Changes

- `SetRfAnalogRegistersPN7462()`, `SetRfAnalogRegistersPN7462Default()`, `GetRfAnalogRegistersPN7462()` function calls added - for setting RF parameters on uFR Zero series readers. 

## [Version 6.0.47] - 2025-12-19

### General Changes

- `Flasher_InstallLatestStableFirmwarePackage()` added for Windows & iOS.

## [Version 6.0.46] - 2025-12-18

### General Changes

- Resolved build errors with iOS Simulator library distribution.

## [Version 6.0.45] - 2025-12-16

### General Changes

- `Flasher_ListReaderFirmwarePackages()`, `Flasher_GetFirmwarePackageManifest()`, `Flasher_InstallFirmwarePackage()` function calls added for Windows & iOS.

## [Version 6.0.44] - 2025-12-03

### General Changes

- `uFR_int_DesfireWriteNDEF*()` operations fixup: Return value status code fixup, returning more identifiable errors. 

### Platform-specific changes

#### iOS

- BLE communication default timeout changed from 10s -> 2s resulting in faster feedback on retries, improving error handling.

## [Version 6.0.43] - 2025-12-02

### General Changes

- `OriginalityCheck()`: Unsupported as of version 6.0.43. Will be made available in future releases.
- `ReaderList_Add()`: Resolved bug with port assignment when connecting multiple Online series readers via network, resulting device handles now properly returned as well.  
- `ReaderOpenEx()`: Return value status code fixup, now returning more identifiable error codes that were omitted by mistake in earlier versions. 

### Platform-specific changes

#### Android

- `ReaderOpen()` bug fixed: Faulty RTS line check when RS232 readers connected leading to failed port open on FTDI interface.
- `uFR_int_Desfire*()` operations fixup: When using internal NFC interface, patched interaction with tags via internal NFC that was compromised by the refactoring in 6.0.42 version.

#### iOS
- `uFR_int_Desfire*()` operations fixup: Bug with identifying correct DESFire® cards fixed, operations correctly resolving transmission now instead of getting generic `UFR_APDU_TRANSCEIVE_ERROR`. Additional patch applied for using internal NFC for these operations as introduced for Android.   

## [Version 6.0.42] - 2025-12-01

### General Changes

- Internal crypto operations refactoring, removing redundant code duplicates. 

## [Version 6.0.41] - 2025-11-12

** Authentication for Ultralight C cards **.

-  UFR_STATUS DL_API UlcAuth_PK(IN uint8_t *des2key);
-  UFR_STATUS DL_API UlcAuth(uint8_t key_index);

## [Version 6.0.40] - 2025-10-21

**Bug fix**

- `StartAsyncSession()` - Deadlocking and crashing on Android patched. Refactored for Windows, Linux & macOS as well.

## [Version 6.0.39] - 2025-10-16

### General Changes

- `MRTD_ReadDocumentData()` - Updated to support reading additonal DGXX fields. Capable of reading and parsing into JSON format following: DG1, DG2, DG7, DG11, DG12, DG13.
- `StartAsyncSession()` - Updated to detect lost event if card was already placed on the reader before calling this function call. 
- Added API calls: `MRTDGetImageFromDG7()`, `MRTDGetImageFromDG7ToFile()`, `MRTD_ReadDocumentDataEx()`.

## [Version 6.0.38] - 2025-10-10

### General Changes

- `GetReaderInfoStr()` updated device information format: <br>
Format for Online Readers: `<Reader Type>` (ESP Firmware Type: `<type>`, ESP Firmware Version: `x.y.z`, ESP Hardware Version: `x.y`) (NFC Model: `<model>`, NFC Firmware Type: `<type>`, NFC Firmware Version: `x.y.z`, NFC Hardware Version: `x.y`) <br>
Format for Zero Readers: `<Reader Type>` (Firmware Type: `<type>`, Firmware Version: `x.y.z`, Hardware Version: `x.y`)

## [Version 6.0.37] - 2025-10-09

### General Changes

- `GetReaderInfoStr()` API function added: Returns information about the reader in c-string format. <br>
Device info is formatted as: `<Reader Type> (<Firmware type> - <Firmware Version>) [NFC Firmware Version, Hardware Version]` <br>
NFC firmware version is returned if reader is uFR Online/Zero Online series.

### Platform-specific changes

#### iOS

- iOS BLE `startCardDetection()`: Fixed issues: duplicate callback reporting, scenario where error thrown if card was approaching the reader while executing this call.

## [Version 6.0.36] - 2025-10-08

### Platform-specific changes

#### iOS
- iOS BLE Async API updated: Added openBLEConnection(), closeBLEConnection(), startCardDetection(), stopCardDetection()

- iOS BLE ReaderOpenEx(): Verifies communication after connecting to the reader. In case the reader was paired during this function call - it returns error. 
Reconnecting to the reader after pairing on iOS is mandatory.

## [Version 6.0.34] - 2025-10-07

- iOS communication patch: Timeouts extended when connecting to uFR Zero Online peripheral.
- New UFR_STATUS error codes for BLE connection: UFR_BLE_DEVICE_NOT_FOUND, UFR_BLE_DEVICE_CONNECTION_FAILED, UFR_BLE_SERVICE_DISCOVERY_FAILED, UFR_BLE_CHARACTERISTIC_DISCOVERY_FAILED, UFR_BLE_STATE_TURNED_OFF.
- Internal retry mechanism for uFR_int_DesfireRead/WriteNDEFPayload(), uFR_int_DesfireRead/WriteNDEFMessage()

## [Version 6.0.33] - 2025-09-29

** PWD_PASS authentication for T2T cards **
-  UFR_STATUS DL_API T2T_PwdAuth_PK(IN uint8_t *pass, OUT uint8_t *pack);
-  UFR_STATUS DL_API T2T_PwdAuth(uint8_t pass_index, OUT uint8_t *pack);

## [Version 6.0.32] - 2025-09-25

- uFR_int_DesfireReadNDEFPayload() - `payload_str` buffer null-termination issue patched.

## [Version 6.0.31] - 2025-09-18

- Added (Set/Get)AsyncCardJsonSendConfig API functions.

## [Version 6.0.32] - 2025-09-25

- uFR_int_DesfireReadNDEFPayload() - `payload_str` buffer null-termination issue patched.

## [Version 6.0.31] - 2025-09-18

- Added (Set/Get)AsyncCardJsonSendConfig API functions.

## [Version 6.0.30] - 2025-09-10

## EM4237SLIX cards support

** NEW_DL_CARD_TYPE **
#define DL_EM4237SLIX					0x57
#define DL_EM4237SLIC					0x58

** ISO15693 Get system information **
- UFR_STATUS DL_API iso15693_get_system_information_no_auth(uint8_t *info_flags, uint8_t *uid, uint8_t *dsfid, uint8_t *afi, uint16_t *memory_size, uint8_t *ic_ref);
- UFR_STATUS DL_API iso15693_get_system_information_PK(uint8_t *password, uint8_t *info_flags, uint8_t *uid, uint8_t *dsfid, uint8_t *afi, uint16_t *memory_size, uint8_t *ic_ref);
- UFR_STATUS DL_API iso15693_get_system_information(uint8_t pass_index, uint8_t *info_flags, uint8_t *uid, uint8_t *dsfid, uint8_t *afi, uint16_t *memory_size, uint8_t *ic_ref);

** EM4237 protect page **
- UFR_STATUS DL_API em4237_protect_page_PK(uint8_t *password, uint8_t page_address, uint8_t protection_status);
- UFR_STATUS DL_API em4237_protect_page(uint8_t pass_index, uint8_t page_address, uint8_t protection_status);

** EM4237 enable Random ID **
- UFR_STATUS DL_API em4237_enable_RID_PK(uint8_t *password);
- UFR_STATUS DL_API em4237_enable_RID(uint8_t pass_index);

** UFR_STATUS DL_API em4237_get_multiply_block_security_status(uint8_t first_block, uint8_t number_of_blocks, uint8_t *block_data); **

## [Version 6.0.29] - 2025-09-02

- Fixed GetCardInfo function issues

## [Version 6.0.28] - 2025-09-02

- WritePaymentAmount function added
- GetCardInfo function added

## [Version 6.0.27] - 2025-08-27

**Bug fix**
- `ReaderOpenEx` - `port_name` fixup passing reader serial number to open specific device
- COM port interface write timeout fixup. 

## [Version 6.0.26] - 2025-08-04

## ISO 15693 cards NDEF support

** UFR_STATUS DL_API iso15693_get_system_information(uint8_t *info_flags, uint8_t *uid, uint8_t *dsfid, uint8_t *afi, uint16_t *memory_size, uint8_t *ic_ref); 

## [Version 6.0.25] - 2025-07-18

## Mifare Plus EV2 support

** Get CARD UID with wrong key bug fix **


## [Version 6.0.24] - 2025-07-14

### Mifare Plus EV2 support

** New DL_CARD_TYPE **
#define DL_MIFARE_PLUS_EV2_2K_SL0       0x48
#define DL_MIFARE_PLUS_EV2_2K_SL1       0x49
#define DL_MIFARE_PLUS_EV2_2K_SL3       0x4A
#define DL_MIFARE_PLUS_EV2_4K_SL0       0x4B
#define DL_MIFARE_PLUS_EV2_4K_SL1       0x4C
#define DL_MIFARE_PLUS_EV2_4K_SL3       0x4D

** Get CARD UID ** 
- UFR_STATUS DL_API MFP_EvGetUid(uint8_t key_index_sector0_key, OUT uint8_t *uid, VAR uint8_t *uid_len);
- UFR_STATUS DL_API MFP_EvGetUidSamKey(uint8_t key_index_sector0_key, OUT uint8_t *uid, VAR uint8_t *uid_len);
- UFR_STATUS DL_API MFP_EvGetUid_PK(IN uint8_t *sector0_key, OUT uint8_t *uid, VAR uint8_t *uid_len);

## [Version 6.0.23] - 2025-07-04

### Platform-specific changes
#### Windows
- Windows support for BLE communication added.
- Distribution of `uFCoder-BLE<architecture>.dll` libraries added to `windows/x86` and `windows/x86_64` directories. 
- `ReaderOpenEx()` - `port_interface` parameter `L` supported for BLE communication with **uFR Online** and **uFR Zero Online** series readers.
- `openBLESession` and `closeBLESession` added for Windows with support for asynchronous callbacks (Card detected, removed and error callbacks)

## [Version 6.0.22] - 2025-06-19

### General Changes
- uFR_int_DesfireNDEFFormat(): Function signature changed, parameter `write_mode` introduced. 

### Platform-Specific Changes
#### iOS
- Distribution of iOS framework as SPM package introduced.
- EspGetFirmwaresList() and EspUpdateFirmware() added for iOS platform only.
- BLE connection improvements for uFR Online and uFR Zero Online devices.

## [Version 6.0.21] - 2025-06-18

### General Changes

- X.509 ECC curve domain params feature for MRTD SOD verification.
- New MRTD feature: extract signing certificate from the SOD - **MRTD_SOD_CertToHeap()**
- Document validation implemented for the **MRTD_ReadDocumentData()** function

## [Version 6.0.20] - 2025-06-13
**Bug fix**
- MultiReader API: **ReaderList_*()** crash on Windows patched.

## [Version 6.0.19] - 2025-06-11
## Diagnostic
** Reader lock status **
-  GetReaderLockStatus(uint8_t *lock_status);

## [Version 6.0.18] - 2025-05-27
### Diagnostic
** I2C devices at the reader **
-  GetI2cDevicesStatus(uint8_t *dev_num, uint32_t *dev_bits): Function gets number and types of the installed I2C devices at the reader

## [Version 6.0.17] - 2025-05-14
### General Changes
  **Bug fix**
- Async API: **Start/StopAsyncSession()** thread termination bug on Windows patched.

## [Version 6.0.16] - 2025-05-07
### General Changes
-  **API Updates:**
- Async API: **Start/StopAsyncSession()** function calls updated & minor bugs fixed. 
### Platform-Specific Changes
#### Android
- StartAsyncSession(): Support added for usage on Android via cable connection to uFR Series reader (OTG)
- StopAsyncSession(): Support added for usage on Android via cable connection to uFR Series reader (OTG)

### Deprecations
- uFCoder library distribution for `linux/arm-el` and `linux/static-armel` will no longer be receiving regular updates from **v6.0.16** onward as it considered `Deprecated`. 
## [Version 6.0.15] - 2025-05-06

### ISO15693 card support
** ISO15693 cards lock block implementation **

- UFR_STATUS DL_API iso15693_lock_block_no_auth(uint8_t lock_block_address);
- UFR_STATUS DL_API icode_lock_block_PK(IN uint8_t *read_password, IN uint8_t *write_password, uint8_t lock_block_address); //if Protect Page enabled provided passwords
- UFR_STATUS DL_API icode_lock_block(uint8_t read_pass_index, uint8_t write_pass_index, uint8_t lock_block_address); //if Protect Page enabled reader's EEPROM passwords

** ISO15693 get multiply block security status **

- UFR_STATUS DL_API iso15693_get_multiply_block_security_status(uint8_t first_block, uint8_t number_of_blocks, OUT uint8_t *block_data);

### [Version 6.0.14] - 2025-04-25

### General Changes

  **Bug fix**
  
- ReaderOpenEx() - Internal call functionality bug fixed. 
- APDUPlainTransceive() - LE field parsing fixup for extended APDU commands.

### [Version 6.0.13] - 2025-04-17

### ISO15693 cards support
** NXP ICODE cards passwords manipulation **

- UFR_STATUS DL_API icode_write_password_PK(uint8_t pwd_ident, IN uint8_t *current_password, IN uint8_t *new_password); //provided passwords

- UFR_STATUS DL_API icode_write_password(uint8_t pwd_ident, uint8_t current_password_index, uint8_t new_password_index); //reader's EEPROM passwords
  
** NXP ICODE SLIX-S, ICODE SLIX2, ICODE 3 protect page support **

- UFR_STATUS DL_API icode_protect_page_PK(IN uint8_t *read_password, IN uint8_t *write_password,

uint8_t protect_page_address, uint8_t low_read_prot, uint8_t low_write_prot, uint8_t high_read_prot, uint8_t high_write_prot); //provided passwords

- UFR_STATUS DL_API icode_protect_page(uint8_t read_pass_index, uint8_t write_pass_index,

uint8_t protect_page_address, uint8_t low_read_prot, uint8_t low_write_prot, uint8_t high_read_prot, uint8_t high_write_prot); //reader's EEPROM passwords

### [Version 6.0.12] - 2025-04-11

### General Changes

**Bug fix**

- MRTDParseDG1ToHeap() data trimming bug fixed with TD1 format;
- MRTD_ReadDocumentData() minor JSON format fixup.