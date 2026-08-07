#!/usr/bin/env python3
"""Configura o projeto Android do Capacitor:
1. Copia o plugin nativo NativeSettingsPlugin.java para o lugar certo
2. Adiciona as permissões necessárias no AndroidManifest.xml
3. Registra o plugin no MainActivity
"""
import os, re, sys

def step(msg):
    print(f'== {msg} ==')

# 1. Copiar plugin nativo
step('1. Copiando NativeSettingsPlugin.java')
src_plugin = 'native/NativeSettingsPlugin.java'
dest_dir = 'android/app/src/main/java/com/luzdiaria/versiculos'
os.makedirs(dest_dir, exist_ok=True)
with open(src_plugin) as f:
    plugin_content = f.read()
with open(os.path.join(dest_dir, 'NativeSettingsPlugin.java'), 'w') as f:
    f.write(plugin_content)
print('Plugin copiado para', dest_dir)

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
    'android.permission.POST_NOTIFICATIONS',
    'android.permission.VIBRATE',
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

open(manifest, 'w').write(content)
print(f'{added} permissões adicionadas ao manifest')

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
            'import com.getcapacitor.BridgeActivity;\nimport com.luzdiaria.versiculos.NativeSettingsPlugin;'
        )
        if 'registerPlugin' in ma:
            # Formato com lista de plugins
            ma = ma.replace(
                'registerPlugin(',
                'registerPlugin(NativeSettingsPlugin.class);\n        registerPlugin(',
                1
            )
        else:
            # Formato simples (herda BridgeActivity)
            ma = ma.replace(
                'public class MainActivity extends BridgeActivity {}',
                '''public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
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
