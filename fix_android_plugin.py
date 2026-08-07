#!/usr/bin/env python3
"""Configura o projeto Android do Capacitor:
1. Copia o plugin nativo NativeSettingsPlugin.java para o lugar certo
2. Adiciona as permissões necessárias no AndroidManifest.xml
3. Registra o plugin no MainActivity
"""
import os, re, sys

def step(msg):
    print(f'== {msg} ==')

# 1. Copiar plugins nativos
step('1. Copiando arquivos nativos')
native_files = [
    'native/NativeSettingsPlugin.java',
    'native/VerseAlarmPlugin.java',
    'native/VerseForegroundService.java',
    'native/VerseAlarmReceiver.java',
    'native/BootReceiver.java',
    'native/GiantVerseActivity.java',
    'native/VerseWidgetProvider.java',
    'native/VerseWidgetConfigActivity.java',
    'native/VerseAccessibilityService.java',
    'native/FlashLightUtil.java',
]
dest_dir = 'android/app/src/main/java/com/luzdiaria/versiculos'
os.makedirs(dest_dir, exist_ok=True)
for src in native_files:
    if not os.path.exists(src):
        print(f'AVISO: {src} não encontrado, pulando')
        continue
    with open(src) as f:
        content = f.read()
    with open(os.path.join(dest_dir, os.path.basename(src)), 'w') as f:
        f.write(content)
    print(f'Copiado: {os.path.basename(src)}')

# 1c. Copiar layouts do widget para res/layout e res/xml
step('1c. Copiando layouts do widget')
os.makedirs('android/app/src/main/res/layout', exist_ok=True)
os.makedirs('android/app/src/main/res/xml', exist_ok=True)
for xml_src, xml_dest in [
    ('native/widget_verse.xml', 'android/app/src/main/res/layout/widget_verse.xml'),
    ('native/widget_verse_info.xml', 'android/app/src/main/res/xml/widget_verse_info.xml'),
]:
    if os.path.exists(xml_src):
        with open(xml_src) as f:
            data = f.read()
        with open(xml_dest, 'w') as f:
            f.write(data)
        print(f'Layout copiado: {xml_dest}')

# 1d. Adicionar string de descrição do widget
step('1d. Adicionando strings (widget + acessibilidade)')
strings_path = 'android/app/src/main/res/values/strings.xml'
if os.path.exists(strings_path):
    strings = open(strings_path).read()
    if 'widget_description' not in strings:
        strings = strings.replace('</resources>',
            '    <string name="widget_description">Versículo do Dia na sua tela inicial</string>\n</resources>')
    if 'accessibility_service_description' not in strings:
        strings = strings.replace('</resources>',
            '    <string name="accessibility_service_description">Permite que o Luz Diária detecte quando o telefone está em uso para entregar o versículo do dia no momento certo.</string>\n</resources>')
    open(strings_path, 'w').write(strings)
    print('Strings adicionadas')

# 1e. Copiar config do serviço de acessibilidade para res/xml
step('1e. Copiando accessibility_service_config.xml')
os.makedirs('android/app/src/main/res/xml', exist_ok=True)
if os.path.exists('native/accessibility_service_config.xml'):
    with open('native/accessibility_service_config.xml') as f:
        data = f.read()
    with open('android/app/src/main/res/xml/accessibility_service_config.xml', 'w') as f:
        f.write(data)
    print('Config de acessibilidade copiada')

# 1b. Copiar ícone de notificação (monocromático) para res/drawable
step('1b. Copiando ícone de notificação')
notif_src = 'assets/notification-icon.png'
if os.path.exists(notif_src):
    drawable_dir = 'android/app/src/main/res/drawable'
    os.makedirs(drawable_dir, exist_ok=True)
    with open(notif_src, 'rb') as f:
        notif_data = f.read()
    with open(os.path.join(drawable_dir, 'ic_stat_notification.png'), 'wb') as f:
        f.write(notif_data)
    print('Ícone de notificação copiado para', drawable_dir)

# 2. Permissões no AndroidManifest
step('2. Adicionando permissões ao AndroidManifest.xml')
manifest = 'android/app/src/main/AndroidManifest.xml'
content = open(manifest).read()

# Garante que o manifest usa os ícones gerados (não o padrão do Capacitor)
if '@mipmap/ic_launcher' not in content:
    content = content.replace(
        'android:icon="@mipmap/ic_launcher"',
        'android:icon="@mipmap/ic_launcher"'
    )
    content = content.replace(
        'android:icon="@mipmap/ic_launcher_round"',
        'android:icon="@mipmap/ic_launcher_round"'
    )

permissions = [
    'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
    'android.permission.SYSTEM_ALERT_WINDOW',
    'android.permission.SCHEDULE_EXACT_ALARM',
    'android.permission.USE_EXACT_ALARM',
    'android.permission.POST_NOTIFICATIONS',
    'android.permission.VIBRATE',
    'android.permission.CAMERA',
    'android.permission.FLASHLIGHT',
    'android.permission.WAKE_LOCK',
    'android.permission.RECEIVE_BOOT_COMPLETED',
]

added = 0
for perm in permissions:
    if perm not in content:
        content = content.replace(
            '<uses-permission android:name="android.permission.INTERNET" />',
            f'<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="{perm}" />'
        )
        added += 1

# Nome do app: "Luz Diária"
strings_path = 'android/app/src/main/res/values/strings.xml'
if os.path.exists(strings_path):
    strings = open(strings_path).read()
    if 'Luz Diária' not in strings:
        strings = strings.replace(
            '<string name="app_name">',
            '<string name="app_name">Luz Diária'
        )
        # Caso o valor venha com o nome antigo, substitui
        strings = re.sub(r'(<string name="app_name">)[^<]*(</string>)', r'\1Luz Diária\2', strings)
        open(strings_path, 'w').write(strings)
        print('Nome do app definido como "Luz Diária"')
    else:
        print('Nome do app já é Luz Diária')

open(manifest, 'w').write(content)
print(f'{added} permissões adicionadas ao manifest')

# 2b. Registrar Service e Receivers no manifest (foreground service + alarmes)
step('2b. Registrando service e receivers no manifest')
service_block = '''
    <service
        android:name="com.luzdiaria.versiculos.VerseForegroundService"
        android:exported="false"
        android:foregroundServiceType="dataSync" />

    <receiver
        android:name="com.luzdiaria.versiculos.VerseAlarmReceiver"
        android:exported="false" />

    <receiver
        android:name="com.luzdiaria.versiculos.BootReceiver"
        android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.BOOT_COMPLETED" />
            <action android:name="android.intent.action.QUICKBOOT_POWERON" />
            <action android:name="com.htc.intent.action.QUICKBOOT_POWERON" />
        </intent-filter>
    </receiver>

    <activity
        android:name="com.luzdiaria.versiculos.GiantVerseActivity"
        android:exported="false"
        android:excludeFromRecents="true"
        android:launchMode="singleTask"
        android:theme="@android:style/Theme.Black.NoTitleBar.Fullscreen"
        android:showWhenLocked="true"
        android:turnScreenOn="true" />

    <activity
        android:name="com.luzdiaria.versiculos.VerseWidgetConfigActivity"
        android:exported="false"
        android:theme="@android:style/Theme.Dialog" />

    <receiver
        android:name="com.luzdiaria.versiculos.VerseWidgetProvider"
        android:exported="true">
        <intent-filter>
            <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            <action android:name="com.luzdiaria.versiculos.WIDGET_UPDATE" />
        </intent-filter>
        <meta-data
            android:name="android.appwidget.provider"
            android:resource="@xml/widget_verse_info" />
    </receiver>

    <service
        android:name="com.luzdiaria.versiculos.VerseAccessibilityService"
        android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
        android:exported="false">
        <intent-filter>
            <action android:name="android.accessibilityservice.AccessibilityService" />
        </intent-filter>
        <meta-data
            android:name="android.accessibilityservice"
            android:resource="@xml/accessibility_service_config" />
    </service>
'''

if 'GiantVerseActivity' not in content:
    # Insere antes do fechamento do <application>
    content = content.replace('</application>', service_block + '\n    </application>')
    open(manifest, 'w').write(content)
    print('Service e receivers registrados no manifest')
else:
    print('Service e receivers já registrados')

# 3. Registrar plugin no MainActivity
step('3. Registrando plugin no MainActivity')
main_activity = None
for root, dirs, files in os.walk('android/app/src/main/java'):
    for f in files:
        if f == 'MainActivity.java':
            main_activity = os.path.join(root, f)
        elif f == 'MainActivity.kt':
            main_activity = os.path.join(root, f)

if not main_activity:
    print('ERRO: MainActivity não encontrado')
    sys.exit(1)

print('MainActivity:', main_activity)
ma = open(main_activity).read()

if 'NativeSettingsPlugin' not in ma:
    if main_activity.endswith('.java'):
        # Adiciona o import e o registerPlugin
        ma = ma.replace(
            'import com.getcapacitor.BridgeActivity;',
            'import com.getcapacitor.BridgeActivity;\nimport com.luzdiaria.versiculos.NativeSettingsPlugin;\nimport com.luzdiaria.versiculos.VerseAlarmPlugin;'
        )
        if 'registerPlugin' in ma:
            # Formato com lista de plugins
            ma = ma.replace(
                'registerPlugin(',
                'registerPlugin(NativeSettingsPlugin.class);\n        registerPlugin(VerseAlarmPlugin.class);\n        registerPlugin(',
                1
            )
        else:
            # Formato simples (herda BridgeActivity)
            ma = ma.replace(
                'public class MainActivity extends BridgeActivity {}',
                '''public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        // Cria o canal de notificações "Luz Diária" (obrigatório no Android 8+)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            android.app.NotificationChannel channel = new android.app.NotificationChannel(
                "luz-diaria",
                "Luz Diária",
                android.app.NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Notificações de versículos diários");
            android.app.NotificationManager nm = getSystemService(android.app.NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(channel);
        }
        registerPlugin(NativeSettingsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}'''
            )
    else:
        # Kotlin
        ma = ma.replace(
            'import com.getcapacitor.BridgeActivity',
            'import com.getcapacitor.BridgeActivity\nimport com.luzdiaria.versiculos.NativeSettingsPlugin'
        )
        ma = ma.replace(
            'class MainActivity : BridgeActivity()',
            '''class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: android.os.Bundle?) {
        registerPlugin(NativeSettingsPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}'''
        )
    open(main_activity, 'w').write(ma)
    print('Plugin registrado no MainActivity')
else:
    print('Plugin já registrado')

print('CONFIGURAÇÃO ANDROID COMPLETA')
