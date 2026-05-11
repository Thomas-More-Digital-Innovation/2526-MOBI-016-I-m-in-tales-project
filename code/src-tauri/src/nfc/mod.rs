use serde::{Deserialize, Serialize};
use thiserror::Error;

pub mod codes;
pub mod handler;
pub mod ufr;

#[derive(Debug, Serialize, Deserialize, Error)]
pub enum NfcError {
    #[error("Device not found")]
    DeviceNotFound,
    #[error("Communication error: {0}")]
    CommunicationError(String),
    #[error("No card present")]
    NoCardPresent,
    #[error("Invalid NDEF format")]
    InvalidNdefFormat,
    #[error("Card is not initialized for NDEF")]
    NotInitialized,
    #[error("Unknown error: {0}")]
    Unknown(String),
}

pub trait NfcReader: Send + Sync {
    fn open(&self) -> Result<(), NfcError>;
    fn close(&self) -> Result<(), NfcError>;
    fn read_ndef_text(&self) -> Result<String, NfcError>;
    fn write_ndef_text(&self, text: &str) -> Result<(), NfcError>;
    fn get_tag_uid(&self) -> Result<String, NfcError>;
}
