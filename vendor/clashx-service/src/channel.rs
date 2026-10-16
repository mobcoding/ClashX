#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ChannelIdentity {
    pub id: &'static str,
    pub service_slug: &'static str,
    pub windows_service_name: &'static str,
    pub service_display_name: &'static str,
    pub macos_app_bundle_id: &'static str,
    pub macos_service_id: &'static str,
}

#[cfg(not(feature = "development-channel"))]
pub const CHANNEL_IDENTITY: ChannelIdentity = ChannelIdentity {
    id: "clashx-production",
    service_slug: "clashx-service",
    windows_service_name: "clashx_service",
    service_display_name: "ClashX Service",
    macos_app_bundle_id: "io.github.mobcoding.clashx",
    macos_service_id: "io.github.mobcoding.clashx.service",
};

#[cfg(feature = "development-channel")]
pub const CHANNEL_IDENTITY: ChannelIdentity = ChannelIdentity {
    id: "clashx-development",
    service_slug: "clashx-service-dev",
    windows_service_name: "clashx_service_dev",
    service_display_name: "ClashX Development Service",
    macos_app_bundle_id: "io.github.mobcoding.clashx.dev",
    macos_service_id: "io.github.mobcoding.clashx.dev.service",
};

pub const SERVICE_SLUG: &str = CHANNEL_IDENTITY.service_slug;
pub const WINDOWS_SERVICE_NAME: &str = CHANNEL_IDENTITY.windows_service_name;
pub const SERVICE_DISPLAY_NAME: &str = CHANNEL_IDENTITY.service_display_name;
pub const MACOS_APP_BUNDLE_ID: &str = CHANNEL_IDENTITY.macos_app_bundle_id;
pub const MACOS_SERVICE_ID: &str = CHANNEL_IDENTITY.macos_service_id;

#[cfg(test)]
mod tests {
    use super::CHANNEL_IDENTITY;

    #[test]
    fn compiled_channel_has_a_self_consistent_identity() {
        assert!(!CHANNEL_IDENTITY.id.is_empty());
        assert!(CHANNEL_IDENTITY.service_slug.starts_with("clashx-service"));
        assert!(CHANNEL_IDENTITY.windows_service_name.starts_with("clashx_service"));
        assert!(
            CHANNEL_IDENTITY
                .macos_service_id
                .starts_with(CHANNEL_IDENTITY.macos_app_bundle_id)
        );
    }
}
