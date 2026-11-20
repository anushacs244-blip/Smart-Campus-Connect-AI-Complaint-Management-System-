/**
 * CampusConnect AI - Server Configuration Dialog
 * Author: SPA
 * 
 * Allows dynamic configuration of the Node.js API backend URL
 * for Android Studio Emulators (10.0.2.2) and Physical Mobile Devices (Wi-Fi LAN IP).
 */

import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class ServerConfigDialog extends StatefulWidget {
  const ServerConfigDialog({super.key});

  static Future<void> show(BuildContext context) {
    return showDialog(
      context: context,
      builder: (_) => const ServerConfigDialog(),
    );
  }

  @override
  State<ServerConfigDialog> createState() => _ServerConfigDialogState();
}

class _ServerConfigDialogState extends State<ServerConfigDialog> {
  late TextEditingController _urlController;
  bool _testing = false;
  bool? _isConnected;
  String? _statusMessage;

  @override
  void initState() {
    super.initState();
    _urlController = TextEditingController(text: ApiService.baseUrl);
    _runTest();
  }

  @override
  void dispose() {
    _urlController.dispose();
    super.dispose();
  }

  Future<void> _runTest() async {
    setState(() {
      _testing = true;
      _statusMessage = "Pinging server...";
    });

    final tempUrl = _urlController.text.trim();
    final original = ApiService.baseUrl;
    ApiService.baseUrl = tempUrl;

    final ok = await ApiService.testConnection();

    if (mounted) {
      setState(() {
        _testing = false;
        _isConnected = ok;
        _statusMessage = ok
            ? "Connected to Node.js Backend (Port 5000)"
            : "Cannot reach backend at this address";
      });
    }

    if (!ok) {
      ApiService.baseUrl = original;
    }
  }

  void _applyPreset(String url) {
    setState(() {
      _urlController.text = url;
    });
    _runTest();
  }

  Future<void> _save() async {
    final url = _urlController.text.trim();
    if (url.isEmpty) return;

    await ApiService.saveBaseUrl(url);
    if (mounted) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Backend URL set to: $url"),
          backgroundColor: AppColors.success,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Container(
        padding: const EdgeInsets.all(22),
        constraints: const BoxConstraints(maxWidth: 440),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.dns_rounded, color: AppColors.primary, size: 22),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Backend Server Host",
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                      ),
                      Text(
                        "Switch between Emulator & Physical Phone",
                        style: TextStyle(fontSize: 11.5, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded, size: 20),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // Live Connection Status Banner
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: _isConnected == true
                    ? const Color(0xFFECFDF5)
                    : (_isConnected == false ? const Color(0xFFFEF2F2) : const Color(0xFFF1F5F9)),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _isConnected == true
                      ? const Color(0xFFA7F3D0)
                      : (_isConnected == false ? const Color(0xFFFECACA) : AppColors.border),
                ),
              ),
              child: Row(
                children: [
                  if (_testing)
                    const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                    )
                  else
                    Icon(
                      _isConnected == true
                          ? Icons.check_circle_rounded
                          : (_isConnected == false ? Icons.error_rounded : Icons.info_outline),
                      size: 18,
                      color: _isConnected == true
                          ? AppColors.success
                          : (_isConnected == false ? AppColors.danger : AppColors.textSecondary),
                    ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      _statusMessage ?? "Check connection",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: _isConnected == true
                            ? const Color(0xFF065F46)
                            : (_isConnected == false ? const Color(0xFF991B1B) : AppColors.textSecondary),
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: _testing ? null : _runTest,
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: const Text("Ping", style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Presets
            const Text("Quick Select Network Target:", style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildPresetChip("📱 Emulator", "http://10.0.2.2:5000/api"),
                _buildPresetChip("📲 Physical Phone (Wi-Fi)", "http://192.168.1.34:5000/api"),
                _buildPresetChip("🔌 Localhost / USB", "http://localhost:5000/api"),
              ],
            ),
            const SizedBox(height: 16),

            // Input Field
            const Text("Server API Base URL:", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            TextField(
              controller: _urlController,
              decoration: InputDecoration(
                hintText: "http://<IP_ADDRESS>:5000/api",
                prefixIcon: const Icon(Icons.link_rounded, size: 18),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.refresh_rounded, size: 18),
                  onPressed: _runTest,
                  tooltip: "Test URL",
                ),
              ),
              style: const TextStyle(fontSize: 13, fontFamily: 'monospace'),
            ),
            const SizedBox(height: 20),

            // Action Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text("Cancel"),
                ),
                const SizedBox(width: 8),
                ElevatedButton.icon(
                  onPressed: _save,
                  icon: const Icon(Icons.save_rounded, size: 16),
                  label: const Text("Save & Apply"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPresetChip(String label, String url) {
    final isSelected = _urlController.text.trim() == url;
    return ChoiceChip(
      label: Text(label, style: TextStyle(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
      selected: isSelected,
      onSelected: (_) => _applyPreset(url),
      selectedColor: AppColors.primaryLight,
      backgroundColor: const Color(0xFFF8FAFC),
      labelStyle: TextStyle(color: isSelected ? AppColors.primary : AppColors.textSecondary),
    );
  }
}
