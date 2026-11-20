import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:campusconnect_flutter/main.dart';

void main() {
  testWidgets('CampusConnectApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const CampusConnectApp());
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
