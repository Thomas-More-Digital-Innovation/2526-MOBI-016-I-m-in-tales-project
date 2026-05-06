use crate::nfc::codes::UFCODER_ERROR_CODES;
use crate::nfc::NfcError;

pub fn translate_ufr_status(status: u32) -> Result<(), NfcError> {
    if status == 0x00 {
        return Ok(());
    }

    match status {
        0x08 | 0xBB8 => Err(NfcError::NoCardPresent),
        0x01 | 0x50..=0x5F | 0xBB7 | 0xBBD | 0xBBE => Err(NfcError::DeviceNotFound),
        0x80 | 0x81 | 0x83 => Err(NfcError::InvalidNdefFormat),
        0x86 => Err(NfcError::NotInitialized),
        0x02..=0x07 => {
            let error_name = UFCODER_ERROR_CODES.get(&status).unwrap_or(&"COMM_ERROR");
            Err(NfcError::CommunicationError(error_name.to_string()))
        }
        _ => {
            let error_name = UFCODER_ERROR_CODES.get(&status).unwrap_or(&"UNKNOWN_ERROR");
            Err(NfcError::Unknown(format!("{} (0x{:02X})", error_name, status)))
        }
    }
}
