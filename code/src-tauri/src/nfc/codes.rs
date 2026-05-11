use std::collections::HashMap;
use std::sync::LazyLock;

pub static UFCODER_ERROR_CODES: LazyLock<HashMap<u32, &'static str>> = LazyLock::new(|| {
    let mut m = HashMap::new();
    m.insert(0x00, "UFR_OK");
    m.insert(0x01, "UFR_COMMUNICATION_ERROR");
    m.insert(0x02, "UFR_CHKSUM_ERROR");
    m.insert(0x03, "UFR_READING_ERROR");
    m.insert(0x04, "UFR_WRITING_ERROR");
    m.insert(0x05, "UFR_BUFFER_OVERFLOW");
    m.insert(0x06, "UFR_MAX_ADDRESS_EXCEEDED");
    m.insert(0x07, "UFR_MAX_KEY_INDEX_EXCEEDED");
    m.insert(0x08, "UFR_NO_CARD");
    m.insert(0x09, "UFR_COMMAND_NOT_SUPPORTED");
    m.insert(0x0A, "UFR_FORBIDEN_DIRECT_WRITE_IN_SECTOR_TRAILER");
    m.insert(0x0B, "UFR_ADDRESSED_BLOCK_IS_NOT_SECTOR_TRAILER");
    m.insert(0x0C, "UFR_WRONG_ADDRESS_MODE");
    m.insert(0x0D, "UFR_WRONG_ACCESS_BITS_VALUES");
    m.insert(0x0E, "UFR_AUTH_ERROR");
    m.insert(0x0F, "UFR_PARAMETERS_ERROR");
    m.insert(0x10, "UFR_MAX_SIZE_EXCEEDED");

    m.insert(0x70, "UFR_WRITE_VERIFICATION_ERROR");
    m.insert(0x71, "UFR_BUFFER_SIZE_EXCEEDED");
    m.insert(0x72, "UFR_VALUE_BLOCK_INVALID");
    m.insert(0x73, "UFR_VALUE_BLOCK_ADDR_INVALID");
    m.insert(0x74, "UFR_VALUE_BLOCK_MANIPULATION_ERROR");
    m.insert(0x75, "UFR_WRONG_UI_MODE");
    m.insert(0x76, "UFR_KEYS_LOCKED");
    m.insert(0x77, "UFR_KEYS_UNLOCKED");
    m.insert(0x78, "UFR_WRONG_PASSWORD");
    m.insert(0x79, "UFR_CAN_NOT_LOCK_DEVICE");
    m.insert(0x7A, "UFR_CAN_NOT_UNLOCK_DEVICE");
    m.insert(0x7B, "UFR_DEVICE_EEPROM_BUSY");
    m.insert(0x7C, "UFR_RTC_SET_ERROR");

    m.insert(0x80, "UFR_WRONG_NDEF_CARD_FORMAT");
    m.insert(0x81, "UFR_NDEF_MESSAGE_NOT_FOUND");
    m.insert(0x82, "UFR_NDEF_UNSUPPORTED_CARD_TYPE");
    m.insert(0x83, "UFR_NDEF_CARD_FORMAT_ERROR");
    m.insert(0x84, "UFR_MAD_NOT_ENABLED");
    m.insert(0x85, "UFR_MAD_VERSION_NOT_SUPPORTED");
    m.insert(0x86, "UFR_NDEF_MESSAGE_NOT_COMPATIBLE");

    m.insert(0x50, "UFR_COMMUNICATION_BREAK");
    m.insert(0x51, "UFR_NO_MEMORY_ERROR");
    m.insert(0x52, "UFR_CAN_NOT_OPEN_READER");
    m.insert(0x53, "UFR_READER_NOT_SUPPORTED");
    m.insert(0x54, "UFR_READER_OPENING_ERROR");
    m.insert(0x55, "UFR_READER_PORT_NOT_OPENED");
    m.insert(0x56, "UFR_CANT_CLOSE_READER_PORT");

    m.insert(0xA0, "UFR_FT_STATUS_ERROR_1");
    m.insert(0xA1, "UFR_FT_STATUS_ERROR_2");
    m.insert(0xA2, "UFR_FT_STATUS_ERROR_3");
    m.insert(0xA3, "UFR_FT_STATUS_ERROR_4");
    m.insert(0xA4, "UFR_FT_STATUS_ERROR_5");
    m.insert(0xA5, "UFR_FT_STATUS_ERROR_6");
    m.insert(0xA6, "UFR_FT_STATUS_ERROR_7");
    m.insert(0xA7, "UFR_FT_STATUS_ERROR_8");
    m.insert(0xA8, "UFR_FT_STATUS_ERROR_9");

    m.insert(0xBB7, "READER_ERROR");
    m.insert(0xBB8, "NO_CARD_DETECTED");
    m.insert(0xBB9, "CARD_OPERATION_OK");
    m.insert(0xBBA, "WRONG_KEY_TYPE");
    m.insert(0xBBB, "KEY_AUTH_ERROR");
    m.insert(0xBBC, "CARD_CRYPTO_ERROR");
    m.insert(0xBBD, "READER_CARD_COMM_ERROR");
    m.insert(0xBBE, "PC_READER_COMM_ERROR");
    m.insert(0xBBF, "COMMIT_TRANSACTION_NO_REPLY");
    m.insert(0x0BC0, "COMMIT_TRANSACTION_ERROR");
    m.insert(0x0C0C, "DESFIRE_CARD_NO_CHANGES");
    m.insert(0x0C03, "DESFIRE_CARD_OUT_OF_EEPROM_ERROR");
    m.insert(0x0C1C, "DESFIRE_CARD_ILLEGAL_COMMAND_CODE");
    m.insert(0x0C1E, "DESFIRE_CARD_INTEGRITY_ERROR");
    m.insert(0x0C40, "DESFIRE_CARD_NO_SUCH_KEY");
    m.insert(0x0C7E, "DESFIRE_CARD_LENGTH_ERROR");
    m.insert(0x0C9D, "DESFIRE_CARD_PERMISSION_DENIED");
    m.insert(0x0C93, "DESFIRE_CARD_PARAMETER_ERROR");
    m.insert(0x0CA0, "DESFIRE_CARD_APPLICATION_NOT_FOUND");
    m.insert(0x0CA1, "DESFIRE_CARD_APPL_INTEGRITY_ERROR");
    m.insert(0x0CAE, "DESFIRE_CARD_AUTHENTICATION_ERROR");
    m.insert(0x0CAF, "DESFIRE_CARD_ADDITIONAL_FRAME");
    m.insert(0x0CBE, "DESFIRE_CARD_BOUNDARY_ERROR");
    m.insert(0x0CC1, "DESFIRE_CARD_PICC_INTEGRITY_ERROR");
    m.insert(0x0CCA, "DESFIRE_CARD_COMMAND_ABORTED");
    m.insert(0x0CCD, "DESFIRE_CARD_PICC_DISABLED_ERROR");
    m.insert(0x0CCE, "DESFIRE_CARD_COUNT_ERROR");
    m.insert(0x0CDE, "DESFIRE_CARD_DUPLICATE_ERROR");
    m.insert(0x0CEE, "DESFIRE_CARD_EEPROM_ERROR_DES");
    m.insert(0x0CF0, "DESFIRE_CARD_FILE_NOT_FOUND");
    m.insert(0x0CF1, "DESFIRE_CARD_FILE_INTEGRITY_ERROR");

    m
});
