/**
 * Upload Screen - API-integrated: pick files → apiUpload → show/open download link.
 * Works for guests (no login required). Shows file count, total size, copy link.
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientButton } from '@/components/ui/gradient-button';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { GRADIENT_COLORS } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { apiUpload, getDownloadPageUrl } from '@/lib/api';

type PickedFile = { uri: string; name: string; type?: string; size?: number };

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function UploadScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = colors.background !== '#FFFFFF';

  const [files, setFiles] = useState<PickedFile[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickFiles = async () => {
    setUploadError('');
    setDownloadUrl(null);
    // Short delay so the tap is fully handled before opening picker (helps on Android)
    await new Promise((r) => setTimeout(r, 100));
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true,
      });
      if (result.canceled) return;
      const newFiles: PickedFile[] = result.assets.map((a) => ({
        uri: a.uri,
        name: a.name ?? 'file',
        type: a.mimeType ?? undefined,
        size: (a as { size?: number }).size,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    } catch (e: any) {
      setUploadError(e?.message ?? 'Failed to pick files');
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadError('');
  };

  const clearFiles = () => {
    setFiles([]);
    setUploadError('');
    setDownloadUrl(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadError('Add at least one file.');
      return;
    }
    setUploadError('');
    setUploading(true);
    const res = await apiUpload(files);
    setUploading(false);
    if (res.error) {
      setUploadError(res.error);
      return;
    }
    if (res.data?.download_url) {
      setDownloadUrl(res.data.download_url);
    }
  };

  const totalSize = useMemo(
    () => files.reduce((sum, f) => sum + (f.size ?? 0), 0),
    [files]
  );

  const downloadFilename = useMemo(() => {
    if (!downloadUrl) return '';
    const parts = downloadUrl.split('/');
    return parts[parts.length - 1] ?? '';
  }, [downloadUrl]);

  const copyableLink = useMemo(() => {
    if (!downloadFilename) return '';
    return getDownloadPageUrl(downloadFilename);
  }, [downloadFilename]);

  const openDownload = () => {
    if (!copyableLink) return;
    Linking.openURL(copyableLink);
  };

  const copyLink = async () => {
    if (!copyableLink) return;
    try {
      await Clipboard.setStringAsync(copyableLink);
      Alert.alert('Copied', 'Download link copied to clipboard.');
    } catch {
      Alert.alert('Copy failed', 'Could not copy the link.');
    }
  };

  const gradientColors = isDark
    ? ['#0F0D23', '#1a1730', '#0d0b1a']
    : ['#FAF5FF', '#F3E8FF', '#EDE9FE', '#FFFFFF'];

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingTop: Math.max(24, insets.top) + 24,
          paddingBottom: 24,
        }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 100,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            opacity: pressed ? 0.8 : 1,
          })}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
          <Logo size="sm" />
        </Pressable>
        <ThemeToggle size={24} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 56 + insets.bottom,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Hero block */}
        <View style={{ marginBottom: 40 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 100,
              alignSelf: 'flex-start',
              backgroundColor: `${GRADIENT_COLORS.start}18`,
            }}>
            <MaterialIcons name="cloud-upload" size={20} color={GRADIENT_COLORS.start} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary }}>
              Fast & secure
            </Text>
          </View>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '800',
              color: colors.text,
              letterSpacing: -0.6,
              lineHeight: 40,
              marginBottom: 12,
            }}>
            Upload your files
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: colors.textSecondary,
              lineHeight: 26,
              maxWidth: 320,
            }}>
            Tap to add files. Multiple files are zipped automatically and you get a shareable link.
          </Text>
        </View>

        {/* Add files button - primary tap target for mobile (document picker) */}
        <GradientButton
          title="Add files"
          icon="add-circle-outline"
          iconPosition="left"
          onPress={pickFiles}
          style={{ width: '100%', marginBottom: 25 }}
        />

        {/* Drop zone - also opens document picker */}
        <Pressable
          onPress={pickFiles}
          style={({ pressed }) => ({
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(167, 139, 250, 0.6)',
            borderRadius: 24,
            backgroundColor: isDark ? 'rgba(30, 27, 46, 0.6)' : 'rgba(255, 255, 255, 0.85)',
            paddingVertical: 40,
            paddingHorizontal: 28,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
            marginTop: 20,
            opacity: pressed ? 0.92 : 1,
            shadowColor: GRADIENT_COLORS.start,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.08 : 0.06,
            shadowRadius: 24,
            elevation: 4,
          })}>
          <MaterialIcons name="folder-open" size={46} color={GRADIENT_COLORS.start} style={{ marginBottom: 12, marginTop: 10 , alignSelf: 'center' }} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.textSecondary,
              marginBottom: 10,
              textAlign: 'center',
            }}>
            Or tap here to add more files
          </Text>
        </Pressable>

        {uploadError ? (
          <View
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              padding: 12,
              borderRadius: 12,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <MaterialIcons name="error-outline" size={20} color="#DC2626" />
            <Text style={{ fontSize: 14, color: '#DC2626', flex: 1 }}>{uploadError}</Text>
          </View>
        ) : null}

        {downloadUrl ? (
          <View
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              padding: 16,
              borderRadius: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: 'rgba(34, 197, 94, 0.3)',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <MaterialIcons name="check-circle" size={24} color="#16A34A" />
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                Link ready
              </Text>
            </View>
            <Text
              style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12 }}
              numberOfLines={2}>
              {copyableLink}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
              <Pressable
                onPress={openDownload}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: `${GRADIENT_COLORS.start}22`,
                  opacity: pressed ? 0.8 : 1,
                })}>
                <MaterialIcons name="open-in-new" size={18} color={GRADIENT_COLORS.start} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: GRADIENT_COLORS.start }}>
                  Open download page
                </Text>
              </Pressable>
              <Pressable
                onPress={copyLink}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(0,0,0,0.12)',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  opacity: pressed ? 0.8 : 1,
                })}>
                <MaterialIcons name="content-copy" size={18} color={colors.text} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
                  Copy link
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* File list card */}
        <View
          style={{
            borderRadius: 24,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(75, 85, 99, 0.4)' : colors.cardBorder,
            backgroundColor: isDark ? 'rgba(30, 27, 46, 0.5)' : 'rgba(255, 255, 255, 0.9)',
            padding: 24,
            marginBottom: 28,
            minHeight: 160,
            overflow: 'hidden',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: `${GRADIENT_COLORS.start}18`,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialIcons name="folder-open" size={22} color={GRADIENT_COLORS.start} />
            </View>
            <View>
              <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>
                Your files
              </Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>
                {files.length > 0
                  ? `${files.length} file(s)${totalSize > 0 ? ` • ${formatBytes(totalSize)}` : ''}`
                  : 'Added files appear here'}
              </Text>
            </View>
          </View>
          {files.length === 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 32,
                borderStyle: 'dashed',
                borderWidth: 1,
                borderColor: isDark ? 'rgba(75, 85, 99, 0.5)' : colors.cardBorder,
                borderRadius: 16,
              }}>
              <MaterialIcons name="insert-drive-file" size={36} color={colors.textMuted} />
              <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: 12 }}>
                No files added yet
              </Text>
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              {files.map((f, i) => (
                <View
                  key={`${f.uri}-${i}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)',
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <MaterialIcons name="insert-drive-file" size={22} color={colors.textMuted} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        style={{ fontSize: 14, color: colors.text }}
                        numberOfLines={1}>
                        {f.name}
                      </Text>
                      {f.size != null && f.size > 0 ? (
                        <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                          {formatBytes(f.size)}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <Pressable
                    onPress={() => removeFile(i)}
                    hitSlop={12}
                    style={({ pressed }) => ({
                      padding: 6,
                      opacity: pressed ? 0.7 : 1,
                    })}>
                    <MaterialIcons name="close" size={20} color={colors.textMuted} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
          <Pressable
            onPress={clearFiles}
            disabled={uploading}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(75, 85, 99, 0.5)' : colors.cardBorder,
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            })}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text , marginBottom: 10 }}>Clear</Text>
          </Pressable>
        </View>
          <GradientButton
            title={uploading ? 'Uploading…' : 'Upload files'}
            icon={uploading ? undefined : 'link'}
            iconPosition="left"
            onPress={handleUpload}
            style={{ width: '100%' , marginTop: 20 }}
            disabled={uploading || files.length === 0}
          />
      </ScrollView>
    </LinearGradient>
  );
}
